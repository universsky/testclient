package com.testclient.httpmodel;

public class UpdatedScheduleJobItem {
	private String oldJobName;
	
	private ScheduledJobItem newJob;

	public String getOldJobName() {
		return oldJobName!=""?oldJobName:"";
	}

	public void setOldJobName(String oldJobName) {
		this.oldJobName = oldJobName;
	}

	public ScheduledJobItem getNewJob() {
		return newJob;
	}

	public void setNewJob(ScheduledJobItem newJob) {
		this.newJob = newJob;
	}
}
