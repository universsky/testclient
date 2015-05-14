package com.testclient.httpmodel;

public class TestExecutionJson {
	private String time = "";
	private String status = "";
	private String reportview = "";
	private String lasttime = "";
	private String laststatus = "";
	private String runningtimes = "";
	private int total = 0;
	private int pass = 0;
	private int fail = 0;
	private int invalid = 0;
	private int error = 0;
	private int norun = 0;
	
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public String getStatus() {
		return null!=status?status:"";
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public int getPass() {
		return pass;
	}
	public void setPass(int pass) {
		this.pass = pass;
	}
	public int getFail() {
		return fail;
	}
	public void setFail(int fail) {
		this.fail = fail;
	}
	public int getInvalid() {
		return invalid;
	}
	public void setInvalid(int invalid) {
		this.invalid = invalid;
	}
	public int getError() {
		return error;
	}
	public void setError(int error) {
		this.error = error;
	}
	public int getNorun() {
		return norun;
	}
	public void setNorun(int norun) {
		this.norun = norun;
	}
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public String getReportview() {
		return null!=reportview?reportview:"";
	}
	public void setReportview(String reportview) {
		this.reportview = reportview;
	}
	public String getLasttime() {
		return null!=lasttime?lasttime:"";
	}
	public void setLasttime(String lasttime) {
		this.lasttime = lasttime;
	}
	public String getLaststatus() {
		return null!=laststatus?laststatus:"";
	}
	public void setLaststatus(String laststatus) {
		this.laststatus = laststatus;
	}
	public String getRunningtimes() {
		return null!=runningtimes?runningtimes:"";
	}
	public void setRunningtimes(String runningtimes) {
		this.runningtimes = runningtimes;
	}
}
