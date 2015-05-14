package com.testclient.httpmodel;

public class TestStatusDistributionItem {
	private String number;
	private String status;
	private String test;
	
	public String getNumber() {
		return number != null ? number : "";
	}
	public void setNumber(String number) {
		this.number = number;
	}
	public String getStatus() {
		return status != null ? status : "";
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getTest() {
		return test != null ? test : "";
	}
	public void setTest(String test) {
		this.test = test;
	}
	
}
