package com.testclient.httpmodel;

public class MixActionSettingInfo {
	private String id;
	private String description;
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
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
}
