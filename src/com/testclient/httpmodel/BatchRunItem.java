package com.testclient.httpmodel;

public class BatchRunItem {
	private String time;
	private String path;
	
	
	public String getTime() {
		return time != null ? time : "";
	}
	public void setTime(String startTime) {
		this.time = startTime;
	}
	public String getPath() {
		return path != null ? path : "";
	}
	public void setPath(String path) {
		this.path = path;
	}
	
}
