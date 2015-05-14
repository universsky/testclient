package com.testclient.httpmodel;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.testclient.enums.TestStatus;


public class BatchTestItem {
	private String name;
	private String time;
	private String duration;
	private String status;
	private String path;
	private String testpath;
	private boolean doesrun=false;
	
	public String getName() {
		return name!=null ? name : "";
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getTime() {
		return time!=null ? time : "";
	}
	public void setTime(String time) {
		this.time = time;
	}
	public String getDuration() {
		return duration!=null ? duration : "";
	}
	public void setDuration(String duration) {
		this.duration = duration;
	}
	public String getStatus() {
		return status!=null ? status : "";
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public boolean isDoesrun() {
		return doesrun;
	}
	public void setDoesrun(boolean doesrun) {
		this.doesrun = doesrun;
	}
	public String getTestpath() {
		return testpath;
	}
	public void setTestpath(String testpath) {
		this.testpath = testpath;
	}

	
}
