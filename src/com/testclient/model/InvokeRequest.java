package com.testclient.model;

import com.testclient.httpmodel.ServerItem;

public class InvokeRequest {
	private ServerItem server;
	private String code;
	private String head;
	private String body;
	private int datagramVersion=5;
	private boolean indented=true;
	
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
}
