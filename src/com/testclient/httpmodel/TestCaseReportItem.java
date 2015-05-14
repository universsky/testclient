package com.testclient.httpmodel;

public class TestCaseReportItem {
	private String test;
	private String result;
	private String total;
	private String passed;
	private String failed;
	private String rate;
	
	public String getResult() {
		return result !=null ? result : "";
	}
	public void setResult(String result) {
		this.result = result;
	}
	public String getTotal() {
		return total !=null ? total : "";
	}
	public void setTotal(String total) {
		this.total = total;
	}
	public String getPassed() {
		return passed !=null ? passed : "";
	}
	public void setPassed(String passed) {
		this.passed = passed;
	}
	public String getFailed() {
		return failed !=null ? failed : "";
	}
	public void setFailed(String failed) {
		this.failed = failed;
	}
	public String getRate() {
		return rate !=null ? rate : "";
	}
	public void setRate(String rate) {
		this.rate = rate;
	}
	public String getTest() {
		return test !=null ? test : "";
	}
	public void setTest(String test) {
		this.test = test;
	}
	
}
