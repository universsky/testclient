package com.testclient.httpmodel;

public class PreConfigItem {
	private String id;
	private String type;
	private String setting;
	public String getId() {
		return id!=null?id:"";
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getType() {
		return type!=null?type:"";
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getSetting() {
		return setting!=null?setting:"";
	}
	public void setSetting(String setting) {
		this.setting = setting;
	}
	
}
