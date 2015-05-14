package com.testclient.model;

import java.util.HashMap;
import java.util.Map;

import com.testclient.httpmodel.ScheduledJobItem;


public class JobContainer {
	private Map<String,ScheduledJobItem> job= new HashMap<String,ScheduledJobItem>();

	public Map<String,ScheduledJobItem> getJob() {
		return job;
	}

	public void setJob(Map<String,ScheduledJobItem> job) {
		this.job = job;
	}

	
}
