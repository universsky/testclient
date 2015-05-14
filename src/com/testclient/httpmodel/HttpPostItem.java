package com.testclient.httpmodel;

import java.util.HashMap;
import java.util.Map;

public class HttpPostItem {
	String HttpTargetPath;
	String HttpTargetName;
	String protocol;
	String host;
	Map<String,String> parameters=new HashMap<String,String>();
	
	public String getHttpTargetName() {
		return HttpTargetName;
	}
	public void setHttpTargetName(String httpTargetName) {
		HttpTargetName = httpTargetName;
	}
	public String getHttpTargetPath() {
		return HttpTargetPath;
	}
	public void setHttpTargetPath(String httpTargetPath) {
		HttpTargetPath = httpTargetPath;
	}
	public String getProtocol() {
		return protocol;
	}
	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}
	public String getHost() {
		return host;
	}
	public void setHost(String host) {
		this.host = host;
	}
	public Map<String, String> getParameters() {
		return parameters;
	}
	public void setParameters(Map<String, String> parameters) {
		this.parameters = parameters;
	}
}
