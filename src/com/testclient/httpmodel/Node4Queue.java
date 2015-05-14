package com.testclient.httpmodel;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Node4Queue implements Serializable {
	private String action;
	private String path;
	private String name;
	private boolean isTest;
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public boolean getIsTest() {
		return isTest;
	}
	public void setIsTest(boolean isTest) {
		this.isTest = isTest;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
}
