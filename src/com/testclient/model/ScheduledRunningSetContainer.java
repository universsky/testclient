package com.testclient.model;

import java.util.HashMap;
import java.util.Map;

import com.testclient.httpmodel.ScheduledRunningSet;


public class ScheduledRunningSetContainer {
	private Map<String,ScheduledRunningSet> job= new HashMap<String,ScheduledRunningSet>();

	public Map<String,ScheduledRunningSet> getJob() {
		return job;
	}

	public void setJob(Map<String,ScheduledRunningSet> job) {
		this.job = job;
	}
}
