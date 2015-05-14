package com.testclient.model;

import java.util.HashMap;
import java.util.Map;

import com.testclient.httpmodel.ServiceBoundDataItem;


public class ServiceBoundDataItemContainer {
	private Map<String,ServiceBoundDataItem> serviceBoundData= new HashMap<String,ServiceBoundDataItem>();

	public Map<String,ServiceBoundDataItem> getServiceBoundData() {
		return serviceBoundData;
	}

	public void setServiceBoundData(Map<String,ServiceBoundDataItem> serviceBoundData) {
		this.serviceBoundData = serviceBoundData;
	}
}
