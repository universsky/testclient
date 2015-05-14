package com.testclient.httpmodel;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.testclient.enums.TimeFormatDefiniation;


public class TestResultItem {
	
	String startTime;
	String duration;
	String requestInfo;
	String responseInfo;
	Set<CheckPointItem> checkPoint=new HashSet<CheckPointItem>();
	Set<String> callback=new HashSet<String>();
	String result;
	String comment;
	
	public static void main(String args[]){
		SimpleDateFormat format=new SimpleDateFormat(TimeFormatDefiniation.format);
		String time=format.format(new Date());
		
		System.out.println(time);
	}
	
	public TestResultItem(){
		SimpleDateFormat format=new SimpleDateFormat(TimeFormatDefiniation.format);
		this.startTime=format.format(new Date());
	}
	
	public String getTime() {
		return startTime!=null ? startTime : "";	
	}
	
	public void setTime(String time) {
		this.startTime=time;	
	}
	
	public Set<String> getCallback() {
		return callback;
	}
	public void setCallback(Set<String> callback) {
		this.callback = callback;
	}
	public String getRequestInfo() {
		return requestInfo!=null ? requestInfo : "";
	}
	public void setRequestInfo(String requestInfo) {
		this.requestInfo = requestInfo;
	}
	public String getResponseInfo() {
		return responseInfo!=null ? responseInfo : "";
	}
	public void setResponseInfo(String responseInfo) {
		this.responseInfo = responseInfo;
	}
	public Set<CheckPointItem> getCheckPoint() {
		return checkPoint;
	}
	public void setCheckPoint(Set<CheckPointItem> checkPoint) {
		this.checkPoint = checkPoint;
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

	public String getComment() {
		return comment!=null ? comment : "";
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
}
