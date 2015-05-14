package com.testclient.model;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class HttpTarget {
	//String folderName;
	String requestBody;
	String path;
	Set<KeyValue> heads=new HashSet<KeyValue>();
	Map<String,Parameter> parameters=new HashMap<String,Parameter>();
	
//	public String getFolderName() {
//		return folderName;
//	}
//	public void setFolderName(String folderName) {
//		this.folderName = folderName;
//	}
	public String getRequestBody() {
		return requestBody;
	}
	public void setRequestBody(String requestBody) {
		this.requestBody = requestBody;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public Set<KeyValue> getHeads() {
		return heads;
	}
	public void setHeads(Set<KeyValue> heads) {
		this.heads = heads;
	}
	public Map<String, Parameter> getParameters() {
		return parameters;
	}
	public void setParameters(Map<String, Parameter> parameters) {
		this.parameters = parameters;
	}
	
}
