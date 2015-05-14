package com.testclient.controller;

import java.text.ParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testclient.enums.JobStatus;
import com.testclient.enums.LabFolderName;
import com.testclient.enums.SeperatorDefinition;
import com.testclient.httpmodel.DataGridJson;
import com.testclient.httpmodel.Json;
import com.testclient.httpmodel.RunningSet;
import com.testclient.httpmodel.ScheduledRunningSet;
import com.testclient.service.ScheduleJobService;
import com.testclient.service.ScheduleRunningSetService;


@Controller
public class ScheduleRunningSetController {
	@Autowired
	ScheduleRunningSetService scheduleRunningSetService;
	@Autowired
	ScheduleJobService scheduleJobService;
	
	@RequestMapping(value="/getAllScheduledRunningSet", method=RequestMethod.GET)
	@ResponseBody
	public DataGridJson getAllScheduledRunningSet(@RequestParam String folderName) {
		return scheduleRunningSetService.getAllScheduledRunningSet(folderName);
	}
	
	@RequestMapping(value="/deleteScheduledRunningSet" )
	@ResponseBody
	public Json deleteScheduledRunningSet(@RequestParam String folderName,@RequestParam String jobName) {
		return scheduleRunningSetService.deleteScheduledRunningSet(folderName, jobName);
	}
	
	@RequestMapping(value="/deleteScheduledRSJob" )
	@ResponseBody
	public Json deleteScheduledRSJob(@RequestBody ScheduledRunningSet[] items) {
		return scheduleJobService.deleteScheduledJob(items[0].getJobName());
	}
	
	@RequestMapping(value="/deleteAllJobsUnderRunningSet" )
	@ResponseBody
	public Json deleteAllJobsUnderRunningSet(@RequestParam String rootName,@RequestBody RunningSet[] runningSets) {
		String foldername=runningSets[0].getName()+SeperatorDefinition.seperator+runningSets[0].getTime()+SeperatorDefinition.seperator+runningSets[0].getAuthor();
		foldername=rootName+"/"+LabFolderName.folder+"/"+foldername;
		return scheduleRunningSetService.deleteAllJobsUnderRunningSet(foldername);
	}
	
	@RequestMapping(value="/addScheduledRunningSet" )
	@ResponseBody
	public Json addScheduledRunningSet(@RequestParam String folderName,@RequestParam String jobName,@RequestParam String expression) {
		ScheduledRunningSet srs=new ScheduledRunningSet();
		srs.setJobName(jobName);
		srs.setCronExpression(expression);
		return scheduleRunningSetService.addScheduledRunningSet(folderName, srs);
	}
	
	@RequestMapping(value="/addScheduledRSJob")
	@ResponseBody
	public Json addScheduledRSJob(@RequestParam String folderName,@RequestBody ScheduledRunningSet[] items) {
		return scheduleRunningSetService.addScheduledJob(folderName, items[0]);
	}
		
	@RequestMapping(value="/updateScheduledRSJob" )
	@ResponseBody
	public Json updateScheduledRSJob(@RequestParam String folderName,@RequestBody ScheduledRunningSet[] items) {
		return scheduleRunningSetService.updateScheduledJob(folderName, items[0]);
	}

	@RequestMapping(value="/updateScheduledRunningSet" )
	@ResponseBody
	public Json updateScheduledRunningSet(@RequestParam String folderName,@RequestParam String jobName,@RequestParam String expression) {
		ScheduledRunningSet srs=new ScheduledRunningSet();
		srs.setJobName(jobName);
		srs.setCronExpression(expression);
		return scheduleRunningSetService.addScheduledRunningSet(folderName,srs);
	}
	
	@RequestMapping(value="/pauseScheduledRSJobs" )
	@ResponseBody
	public Json pauseScheduledRSJobs(@RequestParam List<String> jobs) {
		return scheduleJobService.pauseScheduledJobs(jobs);
	}
	
	@RequestMapping(value="/resumeScheduledRSJobs" )
	@ResponseBody
	public Json resumeScheduledRSJobs(@RequestParam List<String> jobs) {
		return scheduleJobService.resumeScheduledJobs(jobs);
	}

	@RequestMapping(value="/setRunningSetStatusReactive" )
	@ResponseBody
	public void setJobStatusReactive(@RequestParam String folderName,@RequestParam List<String> jobs) {
		scheduleRunningSetService.setJobsStatus(folderName, jobs, JobStatus.reactive);
	}
	
	@RequestMapping(value="/setRunningSetStatusSuspend" )
	@ResponseBody
	public void setJobStatusSuspend(@RequestParam String folderName,@RequestParam List<String> jobs) {
		scheduleRunningSetService.setJobsStatus(folderName, jobs, JobStatus.suspend);
	}

	@RequestMapping(value="/getCronExpressionSummary", method=RequestMethod.POST )
	@ResponseBody
	public String getCronExpressionSummary(@RequestParam String expression) {
	    try {
	    	String description=new org.quartz.CronExpression(expression).getExpressionSummary();
			return description.replace("\"", "").replace("\n", "<br>");
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "";
		}
	}
	
	
}
