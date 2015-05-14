package com.testclient.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testclient.enums.JobStatus;
import com.testclient.httpmodel.DataGridJson;
import com.testclient.httpmodel.Json;
import com.testclient.httpmodel.ScheduledJobItem;
import com.testclient.service.ScheduleJobService;


@Controller
public class ScheduleJobController {
	@Autowired
	ScheduleJobService scheduleJobService;
	
//	@RequestMapping(value="/getScheduledJobItems", method=RequestMethod.GET)
//	@ResponseBody
//	public DataGridJson getScheduledJobItems() {
//		return scheduleJobService.getScheduledJobItems();
//	}
//	
//	@RequestMapping(value="/deleteScheduledJobItem" )
//	@ResponseBody
//	public Json deleteScheduledJobItem(@RequestParam String jobName) {
//		return scheduleJobService.deleteScheduledJobItem(jobName);
//	}
//	
//	@RequestMapping(value="/deleteScheduledJob" )
//	@ResponseBody
//	public Json deleteScheduledJob(@RequestBody ScheduledJobItem[] items) {
//		return scheduleJobService.deleteScheduledJob(items[0].getJobName());
//	}
//	
//	@RequestMapping(value="/addScheduledJobItem" )
//	@ResponseBody
//	public Json addScheduledJobItem(@RequestParam String jobName,@RequestParam String dirPath, @RequestParam String cronExpression) {
//		ScheduledJobItem item =new ScheduledJobItem();
//		item.setJobName(jobName);
//		item.setDirPath(dirPath);
//		item.setCronExpression(cronExpression);
//		return scheduleJobService.addScheduledJobItem(item);
//	}
//	
//	@RequestMapping(value="/addScheduledJob")
//	@ResponseBody
//	public Json addScheduledJob(@RequestBody ScheduledJobItem[] items) {
//		return scheduleJobService.addScheduledJob(items[0]);
//	}
//		
//	@RequestMapping(value="/updateScheduledJobItem" )
//	@ResponseBody
//	public Json updateScheduledJobItem(@RequestParam String jobName,@RequestParam String dirPath, @RequestParam String cronExpression) {
//		ScheduledJobItem item =new ScheduledJobItem();
//		item.setJobName(jobName);
//		item.setDirPath(dirPath);
//		item.setCronExpression(cronExpression);
//		return scheduleJobService.addScheduledJobItem(item);
//	}
//
//	@RequestMapping(value="/updateScheduledJob" )
//	@ResponseBody
//	public Json updateScheduledJob(@RequestBody ScheduledJobItem[] items){
//		return scheduleJobService.updateScheduledJob(items[0]);
//	}
//	
//	
//	@RequestMapping(value="/pauseScheduledJobs" )
//	@ResponseBody
//	public Json pauseScheduledJobs(@RequestParam List<String> jobs) {
//		return scheduleJobService.pauseScheduledJobs(jobs);
//	}
//	
//	@RequestMapping(value="/resumeScheduledJobs" )
//	@ResponseBody
//	public Json resumeScheduledJobs(@RequestParam List<String> jobs) {
//		return scheduleJobService.resumeScheduledJobs(jobs);
//	}
//
//	@RequestMapping(value="/setJobStatusReactive" )
//	@ResponseBody
//	public void setJobStatusReactive(@RequestParam List<String> jobs) {
//		scheduleJobService.updateJobsStatus(jobs, JobStatus.reactive);
//	}
//	
//	@RequestMapping(value="/setJobStatusSuspend" )
//	@ResponseBody
//	public void setJobStatusSuspend(@RequestParam List<String> jobs) {
//		scheduleJobService.updateJobsStatus(jobs, JobStatus.suspend);
//	}

	
}
