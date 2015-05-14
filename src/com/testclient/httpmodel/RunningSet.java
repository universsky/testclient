package com.testclient.httpmodel;

public class RunningSet {
	private String name;
	private String time;
	private String author;
	
	public RunningSet(){
		
	}
	
	public RunningSet(String _name,String _time,String _author){
		name=_name;
		time=_time;
		author=_author;
	}
	
	public String getName() {
		return name!=null?name:"";
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getTime() {
		return time!=null?time:"";
	}
	public void setTime(String time) {
		this.time = time;
	}
	public String getAuthor() {
		return author!=null?author:"";
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	
	
}
