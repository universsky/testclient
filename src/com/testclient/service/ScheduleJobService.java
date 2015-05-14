package com.testclient.service;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.quartz.CronExpression;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerKey;
import org.quartz.impl.JobDetailImpl;
import org.quartz.impl.triggers.CronTriggerImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.testclient.enums.JobStatus;
import com.testclient.enums.TimeFormatDefiniation;
import com.testclient.factory.JsonObjectMapperFactory;
import com.testclient.httpmodel.DataGridJson;
import com.testclient.httpmodel.Json;
import com.testclient.httpmodel.ScheduledJobItem;
import com.testclient.httpmodel.UpdatedScheduleJobItem;
import com.testclient.model.JobContainer;
import com.testclient.quartz.QuartzScheduleMgrService;
import com.testclient.quartz.ScheduledRunFolderJob;
import com.testclient.utils.FileNameUtils;
import com.testclient.utils.MyFileUtils;


@Service("scheduleJobService")
public class ScheduleJobService {
	private static final Logger logger = Logger.getLogger(ScheduleJobService.class);
	@Autowired
	QuartzScheduleMgrService quartzScheduleMgrService;
	@Autowired
	BatchTestService batchTestService;
	
//	public DataGridJson getScheduledJobItems(){
//		DataGridJson dgj=new DataGridJson();
//		List<ScheduledJobItem> row=new ArrayList<ScheduledJobItem>();
//		File root=new File("root");
//		root=new File(root,FileNameUtils.getScheduledJobFile());
//		if(root.exists()){
//			try {
//				ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
//				JobContainer jobs = new JobContainer();
//				jobs = mapper.readValue(root, JobContainer.class);
//				for(Entry<String,ScheduledJobItem> entry:jobs.getJob().entrySet()){
//					row.add(entry.getValue());
//				}
//			} catch (IOException e) {
//				logger.error(e.getMessage());
//			}
//		}
//		dgj.setRows(row);
//		dgj.setTotal(row.size());
//		return dgj;
//	}
//	
//	public Json addScheduledJobItem(ScheduledJobItem item){
//		Json j = new Json();	
//		try {
//			File file=new File("root");
//			file=new File(file,FileNameUtils.getScheduledJobFile());
//			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
//			item.setStatus(JobStatus.active);
//			JobContainer jobs=new JobContainer();
//			if(file.exists()){
//				jobs= mapper.readValue(file, JobContainer.class);
//			}else{
//				file.createNewFile();
//			}
//			jobs.getJob().put(item.getJobName(), item);
//			mapper.writeValue(file, jobs);
//			j.setSuccess(true);
//		} catch (IOException e) {
//			j.setSuccess(false);
//			j.setMsg(e.getClass().toString()+": "+e.getMessage());
//		}
//		return j;
//	}
//	
//	public Json addScheduledJob(ScheduledJobItem item){
//		Json j = new Json();
//		try{
//			String expression=item.getCronExpression();
//			if(CronExpression.isValidExpression(expression)){
//				CronExpression cronEx=new CronExpression(expression);
//				Date current = new Date();
//				Date nextDate = cronEx.getNextValidTimeAfter(current);
//				if(nextDate!=null){
//					if(current.before(nextDate)){
//						SimpleDateFormat format = new SimpleDateFormat(TimeFormatDefiniation.format);			
//						String jobName=format.format(current);
//						item.setJobName(jobName);
//						Trigger trigger=new CronTriggerImpl(jobName, Scheduler.DEFAULT_GROUP, item.getCronExpression());
//						JobDetail jobdetail=new JobDetailImpl(jobName, Scheduler.DEFAULT_GROUP, ScheduledRunFolderJob.class);
//						jobdetail.getJobDataMap().put("dirPath", item.getDirPath());
//						jobdetail.getJobDataMap().put("batchTestService", batchTestService);
//						quartzScheduleMgrService.scheduleJob(jobdetail, trigger);			
//						j.setObj(item);
//						j.setSuccess(true);
//					}
//					else{
//						j.setSuccess(false);
//						j.setMsg("创建任务失败，设定时间不得早于当前时间！");
//					}
//					return j;
//				}
//			}
//			j.setSuccess(false);
//			j.setMsg("Cron表达式非法,请重新设置！");
//		}catch(Exception e){
//			j.setSuccess(false);
//			j.setMsg(e.getClass().toString()+": "+e.getMessage());
//		}
//		return j;
//	}
//	
//	public Json deleteScheduledJobItem(String jobName){
//		Json j = new Json();
//		
//		try {
//			File f=new File("root");
//			f=new File(f,FileNameUtils.getScheduledJobFile());
//			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
//			JobContainer jobs = mapper.readValue(f, JobContainer.class);
//			jobs.getJob().remove(jobName);
//			mapper.writeValue(f, jobs);
//			j.setObj(jobName);
//			j.setSuccess(true);
//		} catch (IOException e) {
//			j.setSuccess(false);
//			j.setMsg(e.getClass().toString()+": "+e.getMessage());
//		}
//		
//		return j;
//	}
	
	public Json deleteScheduledJob(String jobName){
		Json j = new Json();	
		try {
			boolean isDeleted1 = quartzScheduleMgrService.unscheduleJob(new TriggerKey(jobName));
			boolean isDeleted2 = quartzScheduleMgrService.deleteJob(jobName);
			j.setSuccess(true);
		} catch (SchedulerException e) {
			j.setSuccess(false);
			j.setMsg(e.getClass().toString()+": "+e.getMessage());
		}
		return j;
	}
//	
//	public Json updateScheduledJob(ScheduledJobItem item){
//		Json j = new Json();
//		j = deleteScheduledJob(item.getJobName());
//		if(j.isSuccess()){
//			j = deleteScheduledJobItem(item.getJobName());
//			if(j.isSuccess()){
//				j = addScheduledJob(item);
//				if(j.isSuccess()){
//					ScheduledJobItem sji =(ScheduledJobItem)j.getObj();
//					j.setObj(sji);
//					j.setSuccess(true);
//				}
//			}
//		}
//		return j;
//	}
//	
//	public List getFolderTree() {
//		List treeList = new ArrayList();
//		MyFileUtils.makeDir("root");
//		File root=new File("root");
//		File list[]=root.listFiles();
//		for(File f:list){
//			getFolder(treeList,f,"root");
//		}
//		return treeList;
//	}
//	
//	private void getFolder(List treeList,File f,String fathername){
//		if(f.isFile()){
//			return;
//		}	
//		if(f.getName().endsWith("-dir")){
//			String path=fathername+"/"+f.getName();
//			String name=StringUtils.substringBeforeLast(f.getName(), "-dir");
//			Map<String,Object> node = new HashMap<String,Object>();
//			List subtreeList = new ArrayList<Map<String, Object>>();
//			node.put("children", subtreeList);
//			node.put("text", name);
//			node.put("path", path);
//			//node.put("leaf", false);
//			treeList.add(node);
//			File list[]=f.listFiles();
//			for(File child:list){
//				getFolder(subtreeList,child,path);
//			}
//		}		
//	}
//	
//	public Json pauseScheduledJob(String jobName){
//		Json j=new Json();
//		try {
//			quartzScheduleMgrService.pauseJob(new JobKey(jobName));
//			quartzScheduleMgrService.pauseTrigger(new TriggerKey(jobName));
//			j.setSuccess(true);
//		} catch (SchedulerException e) {
//			j.setSuccess(false);
//			j.setMsg(e.getClass().toString()+": "+e.getMessage());
//		}
//		return j;
//	}
//	
//	public Json resumeScheduledJob(String jobName){
//		Json j=new Json();
//		try {
//			quartzScheduleMgrService.resumeJob(new JobKey(jobName));
//			quartzScheduleMgrService.resumeTrigger(new TriggerKey(jobName));
//			j.setSuccess(true);
//		} catch (SchedulerException e) {
//			j.setSuccess(false);
//			j.setMsg(e.getClass().toString()+": "+e.getMessage());
//		}
//		return j;
//	}
//	
	public Json pauseScheduledJobs(List<String> jobs){
		Json j=new Json();
		try {
			for(String jobName : jobs){
				quartzScheduleMgrService.pauseJob(new JobKey(jobName));
				quartzScheduleMgrService.pauseTrigger(new TriggerKey(jobName));
			}
			j.setObj(jobs);
			j.setSuccess(true);
		} catch (SchedulerException e) {
			j.setSuccess(false);
			j.setMsg(e.getClass().toString()+": "+e.getMessage());
		}
		return j;
	}

	public Json resumeScheduledJobs(List<String> jobs){
		Json j=new Json();
		try {
			for(String jobName : jobs){
				quartzScheduleMgrService.resumeJob(new JobKey(jobName));
				quartzScheduleMgrService.resumeTrigger(new TriggerKey(jobName));
			}
			j.setObj(jobs);
			j.setSuccess(true);
		} catch (SchedulerException e) {
			j.setSuccess(false);
			j.setMsg(e.getClass().toString()+": "+e.getMessage());
		}
		return j;
	}
//	
//	public void updateJobStatus(String jobName,String status){
//		try {
//			File f=new File("root");
//			f=new File(f,FileNameUtils.getScheduledJobFile());
//			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
//			JobContainer jobs = mapper.readValue(f, JobContainer.class);
//			ScheduledJobItem item = jobs.getJob().get(jobName);
//			item.setStatus(status);
//			jobs.getJob().put(jobName, item);
//			mapper.writeValue(f, jobs);
//		} catch (JsonParseException e) {
//			// TODO Auto-generated catch block
//			logger.error(e.getMessage());
//		} catch (JsonMappingException e) {
//			// TODO Auto-generated catch block
//			logger.error(e.getMessage());
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			logger.error(e.getMessage());
//		}
//	}
//	
//	public void updateJobsStatus(List<String> jobNames,String status){
//		try {
//			File f=new File("root");
//			f=new File(f,FileNameUtils.getScheduledJobFile());
//			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
//			JobContainer jobs = mapper.readValue(f, JobContainer.class);
//			for(String jobName : jobNames){
//				ScheduledJobItem item = jobs.getJob().get(jobName);
//				item.setStatus(status);
//				jobs.getJob().put(jobName, item);
//			}
//			mapper.writeValue(f, jobs);
//		} catch (JsonParseException e) {
//			// TODO Auto-generated catch block
//			logger.error(e.getMessage());
//		} catch (JsonMappingException e) {
//			// TODO Auto-generated catch block
//			logger.error(e.getMessage());
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			logger.error(e.getMessage());
//		}
//	}
	
}
