package com.testclient.model;

import java.util.HashMap;
import java.util.Map;

import com.testclient.httpmodel.ServerItem;


public class SocketTarget {
	private ServerItem server=new ServerItem();
	private String code="";
	private String head="";
	private String body="";
	private int datagramVersion=5;
	private boolean indented=true;
	private Map<String,Parameter> parameters=new HashMap<String,Parameter>();
	private String serviceDescription;
	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public ServerItem getServer() {
		return server;
	}
	public void setServer(ServerItem server) {
		this.server = server;
	}
	public String getHead() {
		return head;
	}
	public void setHead(String head) {
		this.head = head;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	public int getDatagramVersion() {
		return datagramVersion;
	}
	public void setDatagramVersion(int datagramVersion) {
		this.datagramVersion = datagramVersion;
	}
	public boolean isIndented() {
		return indented;
	}
	public void setIndented(boolean indented) {
		this.indented = indented;
	}
	public Map<String,Parameter> getParameters() {
		return parameters;
	}
	public void setParameters(Map<String,Parameter> parameters) {
		this.parameters = parameters;
	}
	public String getServiceDescription() {
		return serviceDescription;
	}
	public void setServiceDescription(String serviceDescription) {
		this.serviceDescription = serviceDescription;
	}
}
