package com.testclient.httpmodel;

public class Json {
	// 是否成功
	private boolean success = false;
	// 提示信息
	private String msg = "";
	// 其他信息
	private Object obj = null;

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public Object getObj() {
		return obj;
	}

	public void setObj(Object obj) {
		this.obj = obj;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

}
