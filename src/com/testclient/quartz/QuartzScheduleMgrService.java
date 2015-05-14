package com.testclient.quartz;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.quartz.CronExpression;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;
import org.quartz.Trigger;
import org.quartz.TriggerKey;
import org.quartz.impl.JobDetailImpl;
import org.quartz.impl.StdSchedulerFactory;
import org.quartz.impl.matchers.GroupMatcher;
import org.quartz.impl.triggers.CronTriggerImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.testclient.enums.JobStatus;
import com.testclient.enums.LabFolderName;
import com.testclient.enums.SeperatorDefinition;
import com.testclient.factory.JsonObjectMapperFactory;
import com.testclient.httpmodel.ScheduledJobItem;
import com.testclient.httpmodel.ScheduledRunningSet;
import com.testclient.model.JobContainer;
import com.testclient.model.ScheduledRunningSetContainer;
import com.testclient.service.BatchTestService;
import com.testclient.utils.FileNameUtils;


@Service("quartzScheduleMgrService")
public class QuartzScheduleMgrService {
	@Autowired
	BatchTestService batchTestService;
	
	static Object object=new Object();
	static boolean isStarted=false;
	private static final Logger logger = Logger.getLogger(QuartzApplicationLoader.class);
	private static  Scheduler scheduler=getScheduler(); 

    private static Scheduler getScheduler() {  
            SchedulerFactory sf = new StdSchedulerFactory();  
            Scheduler scheduler=null;  
            try {  
                scheduler = sf.getScheduler();  
            } catch (SchedulerException e) {  
                e.printStackTrace();  
            }  
            return scheduler;  
    }
    
    public static Scheduler getInstanceScheduler(){
        return scheduler;
    }

    @Transactional(readOnly=true)
    public void onApplicationEvent(ContextRefreshedEvent event) {
		synchronized (object) {
			if (!isStarted) {
				try {
					scheduler = QuartzScheduleMgrService.getInstanceScheduler();
					scheduler.start();
					isStarted=true;
					scheduleExistingJobs(scheduler,true);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					logger.error("QuartzApplicationLoader 创建失败", e);
				}
			}
		}
	}
    
    private void scheduleExistingJobs(Scheduler scheduler,boolean isRunningSet){
		try {
			JobContainer jobs;
	    	if(isRunningSet)
	    		jobs=getJosFromRunEnvironment();
	    	else
	    		jobs=getJosFromTestConfigEnvironment();
			for(ScheduledJobItem job : jobs.getJob().values()){
				String expression=job.getCronExpression();
				if(CronExpression.isValidExpression(expression)){
					CronExpression cronEx=new CronExpression(expression);
					Date current = new Date();
					Date nextDate = cronEx.getNextValidTimeAfter(current);
					if(nextDate!=null){
						if(current.before(nextDate)){
							String jobName = job.getJobName();
							Trigger trigger = new CronTriggerImpl(jobName, Scheduler.DEFAULT_GROUP, expression);
							JobDetail jobdetail=new JobDetailImpl(jobName, Scheduler.DEFAULT_GROUP, ScheduledRunFolderJob.class);
							jobdetail.getJobDataMap().put("dirPath", job.getDirPath());
							jobdetail.getJobDataMap().put("batchTestService", batchTestService);
							scheduleJob(jobdetail, trigger);
							if(job.getStatus().equalsIgnoreCase(JobStatus.suspend)){
								pauseJob(new JobKey(jobName));
								pauseTrigger(new TriggerKey(jobName));
							}
						}
					}
				}
			}
		}catch (ParseException e) {
			logger.error(e.getMessage());
		}catch (SchedulerException e) {
			logger.error(e.getMessage());
		}
    }
    
    private JobContainer getJosFromTestConfigEnvironment(){
    	File file=new File("root");
		file=new File(file,FileNameUtils.getScheduledJobFile());
		return getJobsFromScheduledJobFile(file);
    }
    
    private JobContainer getJobsFromScheduledJobFile(File file){
    	JobContainer jobs=new JobContainer();
    	if(file.exists() && file.isFile()){
    		ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			try {
				if(file.getParent().contains(SeperatorDefinition.seperator)){
					ScheduledRunningSetContainer rsjobs=mapper.readValue(file, ScheduledRunningSetContainer.class);
					for(ScheduledRunningSet srs : rsjobs.getJob().values()){
						ScheduledJobItem item=new ScheduledJobItem();
						String jobname=srs.getJobName();
						item.setDirPath(file.getParent());
						item.setCronExpression(srs.getCronExpression());
						item.setJobName(jobname);
						item.setStatus(srs.getStatus());
						jobs.getJob().put(jobname, item);
					}
	        	}else
	        		jobs= mapper.readValue(file, JobContainer.class);
			} catch (JsonParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (JsonMappingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return jobs;
    }
    
    private JobContainer getJosFromRunEnvironment(){
    	JobContainer jobs=new JobContainer();
    	File f=new File("root/"+LabFolderName.folder);
    	if(f.exists()){
    		for(File rs : f.listFiles()){
        		File file=new File(rs,FileNameUtils.getScheduledJobFile());
        		JobContainer eachjobs=getJobsFromScheduledJobFile(file);
        		jobs.getJob().putAll(eachjobs.getJob());
        	}
    	}
    	return jobs;
    }
    
    /** 
     * 检查调度是否启动 
     * @return 
     * @throws SchedulerException 
     */  
    public  boolean isStarted() throws SchedulerException  
    {  
        return scheduler.isStarted();  
    }  
  
    /** 
     * 关闭调度信息 
     * @throws SchedulerException 
     */  
    public  void shutdown() throws SchedulerException   {  
        scheduler.shutdown();  
    }  
    /** 
     * 添加调度的job信息 
     * @param jobdetail 
     * @param trigger 
     * @return 
     * @throws SchedulerException 
     */  
    public Date scheduleJob(JobDetail jobdetail, Trigger trigger)  
            throws SchedulerException{  
                return scheduler.scheduleJob(jobdetail, trigger);   
    }  
    /** 
     * 添加相关的触发器 
     * @param trigger 
     * @return 
     * @throws SchedulerException 
     */  
    public  Date scheduleJob(Trigger trigger) throws SchedulerException{  
        return scheduler.scheduleJob(trigger);  
    }  
     /** 
      * 添加多个job任务 
      * @param triggersAndJobs 
      * @param replace 
      * @throws SchedulerException 
      */  
    public  void scheduleJobs(Map<JobDetail, Set<? extends Trigger>> triggersAndJobs, boolean replace) throws SchedulerException {  
    	scheduler.scheduleJobs(triggersAndJobs, replace);
    } 
    /** 
     * 停止调度Job任务 
     * @param triggerkey 
     * @return 
     * @throws SchedulerException 
     */  
    public  boolean unscheduleJob(TriggerKey triggerkey) throws SchedulerException{  
        return scheduler.unscheduleJob(triggerkey);  
    }
  
    /** 
     * 停止调度多个触发器相关的job 
     * @param list 
     * @return 
     * @throws SchedulerException 
     */  
    public  boolean unscheduleJobs(List<TriggerKey> triggerKeylist) throws SchedulerException{  
        return scheduler.unscheduleJobs(triggerKeylist);  
    }  
    /** 
     * 重新恢复触发器相关的job任务  
     * @param triggerkey 
     * @param trigger 
     * @return 
     * @throws SchedulerException 
     */  
    public  Date rescheduleJob(TriggerKey triggerkey, Trigger trigger)  
    throws SchedulerException{  
        return scheduler.rescheduleJob(triggerkey, trigger);  
    }  
    /** 
     * 添加相关的job任务 
     * @param jobdetail 
     * @param flag 
     * @throws SchedulerException 
     */  
    public  void addJob(JobDetail jobdetail, boolean flag)  
            throws SchedulerException   {  
        scheduler.addJob(jobdetail, flag);  
    }  
  
    /** 
     * 删除相关的job任务 
     * @param jobkey 
     * @return 
     * @throws SchedulerException 
     */  
    public  boolean deleteJob(String jobName) throws SchedulerException{ 
    	JobKey jobkey=new JobKey(jobName);
        return scheduler.deleteJob(jobkey);  
    }  
  
    /** 
     * 删除相关的多个job任务 
     * @param jobKeys 
     * @return 
     * @throws SchedulerException 
     */  
    public boolean deleteJobs(List<JobKey> jobKeys)  
    throws SchedulerException{  
        return scheduler.deleteJobs(jobKeys);  
    }  
    /** 
     *  
     * @param jobkey 
     * @throws SchedulerException 
     */  
    public  void triggerJob(JobKey jobkey) throws SchedulerException    {  
        scheduler.triggerJob(jobkey);  
    }  
    /** 
     *  
     * @param jobkey 
     * @param jobdatamap 
     * @throws SchedulerException 
     */  
    public  void triggerJob(JobKey jobkey, JobDataMap jobdatamap)  
            throws SchedulerException   {  
        scheduler.triggerJob(jobkey, jobdatamap);  
    }  
    /** 
     * 停止一个job任务 
     * @param jobkey 
     * @throws SchedulerException 
     */  
    public  void pauseJob(JobKey jobkey) throws SchedulerException  {  
        scheduler.pauseJob(jobkey);  
    }  
    /** 
     * 停止多个job任务 
     * @param groupmatcher 
     * @throws SchedulerException 
     */  
    public  void pauseJobs(GroupMatcher<JobKey> groupmatcher)  
            throws SchedulerException   {  
        scheduler.pauseJobs(groupmatcher);  
    }  
    /** 
     * 停止使用相关的触发器 
     * @param triggerkey 
     * @throws SchedulerException 
     */  
    public  void pauseTrigger(TriggerKey triggerkey)  
            throws SchedulerException   {  
        scheduler.pauseTrigger(triggerkey);  
    }  
  
    public  void pauseTriggers(GroupMatcher<TriggerKey> groupmatcher)  
            throws SchedulerException   {  
        scheduler.pauseTriggers(groupmatcher);  
    }  
    /** 
     * 恢复相关的job任务 
     * @param jobkey 
     * @throws SchedulerException 
     */  
    public  void resumeJob(JobKey jobkey) throws SchedulerException {  
        scheduler.pauseJob(jobkey);  
    }  
      
    public  void resumeJobs(GroupMatcher<JobKey> matcher)  
            throws SchedulerException   {  
        scheduler.resumeJobs(matcher);  
    }  
  
    public  void resumeTrigger(TriggerKey triggerkey)  
            throws SchedulerException   {  
        scheduler.resumeTrigger(triggerkey);  
    }  
     
    public  void resumeTriggers(GroupMatcher<TriggerKey>  groupmatcher)  
            throws SchedulerException  
    {  
        scheduler.resumeTriggers(groupmatcher);   
    }  
    /** 
     * 暂停调度中所有的job任务 
     * @throws SchedulerException 
     */  
    public  void pauseAll() throws SchedulerException  
    {  
        scheduler.pauseAll();  
    }  
    /** 
     * 恢复调度中所有的job的任务 
     * @throws SchedulerException 
     */  
    public  void resumeAll() throws SchedulerException  
    {  
        scheduler.resumeAll();  
    }  
      
     
      
}
