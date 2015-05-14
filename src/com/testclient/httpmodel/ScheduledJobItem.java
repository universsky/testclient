package com.testclient.httpmodel;

public class ScheduledJobItem {
	private String jobName;
	private String dirPath;
	private String cronExpression;
	private String status;

	public String getJobName() {
		return jobName != null ? jobName : "";
	}
	public void setJobName(String jobName) {
		this.jobName = jobName;
	}
	public String getDirPath() {
		return dirPath != null ? dirPath : "";
	}
	public void setDirPath(String dirPath) {
		this.dirPath = dirPath;
	}
	public String getCronExpression() {
		return cronExpression != null ? cronExpression : "";
	}
	public void setCronExpression(String cronExpression) {
		this.cronExpression = cronExpression;
	}
	public String getStatus() {
		return status != null ? status : "";
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
}