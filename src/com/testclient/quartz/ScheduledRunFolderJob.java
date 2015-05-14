package com.testclient.quartz;

import java.io.File;
import java.io.IOException;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.SchedulerContext;
import org.quartz.SchedulerException;

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


public class ScheduledRunFolderJob implements Job {
	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
		JobDataMap dataMap = context.getJobDetail().getJobDataMap();
		String path=String.valueOf(dataMap.get("dirPath"));
		((BatchTestService) dataMap.get("batchTestService")).executeBatchTest(path,null);
		
		String jobName=context.getJobDetail().getKey().getName();
		changeStauts2Complete(jobName,true);
	}
	
	
	private synchronized void changeStauts2Complete(String jobName,boolean isRunningSet){
		if(isRunningSet){
			changeStatus2CompleteInScheduledRSFileContainsJobName(jobName); 
		}else{
			File file=new File("root");
			file=new File(file,FileNameUtils.getScheduledJobFile());
			if(file.exists()){
				try {
					ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
					JobContainer jobs= mapper.readValue(file, JobContainer.class);
					ScheduledJobItem sji= jobs.getJob().get(jobName);
					String status=sji.getStatus();
					if(status.contains(JobStatus.executed)){
						int count=Integer.parseInt(status.replace(JobStatus.executed, ""))+1;
						sji.setStatus(JobStatus.executed+count);
					}
					else
						sji.setStatus(JobStatus.executed+"1");
					jobs.getJob().put(jobName, sji);
					mapper.writeValue(file, jobs);	
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
	}
	
	private synchronized void changeStatus2CompleteInScheduledRSFileContainsJobName(String jobName){
		File f=new File("root/"+LabFolderName.folder);
    	if(f.exists()){
    		for(File rs : f.listFiles()){
        		File file=new File(rs,FileNameUtils.getScheduledJobFile());
        		if(file.exists() && file.isFile()){
            		ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
        			try {
        				ScheduledRunningSetContainer rsjobs=mapper.readValue(file, ScheduledRunningSetContainer.class);
    					for(ScheduledRunningSet srs : rsjobs.getJob().values()){
    						if(srs.getJobName().equalsIgnoreCase(jobName)){
    							String status=srs.getStatus();
    							if(status.contains(JobStatus.executed)){
    								int count=Integer.parseInt(status.replace(JobStatus.executed, ""))+1;
    								srs.setStatus(JobStatus.executed+count);
    							}
    							else
    								srs.setStatus(JobStatus.executed+"1");
    							rsjobs.getJob().put(jobName, srs);
    							mapper.writeValue(file, rsjobs);	
    						}
    					}
        			} catch (Exception e) {
        				// TODO Auto-generated catch block
        			}
        		}
        	}
    	}
	}
	
}
