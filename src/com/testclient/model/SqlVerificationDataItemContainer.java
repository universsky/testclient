package com.testclient.model;

import java.util.HashMap;
import java.util.Map;

import com.testclient.httpmodel.SqlVerificationDataItem;



public class SqlVerificationDataItemContainer {
	private Map<String,SqlVerificationDataItem> dbVerificationData= new HashMap<String,SqlVerificationDataItem>();

	public Map<String,SqlVerificationDataItem> getDbVerificationData() {
		return dbVerificationData;
	}

	public void setDbVerificationData(Map<String,SqlVerificationDataItem> dbVerificationData) {
		this.dbVerificationData = dbVerificationData;
	}
}
