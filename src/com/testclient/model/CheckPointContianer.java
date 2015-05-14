package com.testclient.model;

import java.util.HashMap;
import java.util.Map;

import com.testclient.httpmodel.CheckPointItem;

public class CheckPointContianer {
	Map<String,CheckPointItem> checkPoint= new HashMap<String,CheckPointItem>();

	public Map<String, CheckPointItem> getCheckPoint() {
		return checkPoint;
	}

	public void setCheckPoint(Map<String, CheckPointItem> checkPoint) {
		this.checkPoint = checkPoint;
	}
	
}
