package com.testclient.httpmodel;

public class TestHistoryItem {

	private String time;
	private String result;
	private String duration;
	
	public String getTime() {
		return time!=null ? time : "";
	}
	public void setTime(String time) {
		this.time = time;
	}
	public String getResult() {
		return result!=null ? result : "";
	}
	public void setResult(String result) {
		this.result = result;
	}
	public String getDuration() {
		return duration!=null ? duration : "";
	}
	public void setDuration(String duration) {
		this.duration = duration;
	}
	
	
}
