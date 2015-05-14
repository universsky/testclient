package com.testclient.model;

import java.util.HashMap;
import java.util.Map;

import com.testclient.httpmodel.QueryBoundDataItem;



public class QueryBoundDataItemContainer {
	private Map<String,QueryBoundDataItem> queryBoundData= new HashMap<String,QueryBoundDataItem>();

	public Map<String,QueryBoundDataItem> getQueryBoundData() {
		return queryBoundData;
	}

	public void setQueryBoundData(Map<String,QueryBoundDataItem> queryBoundData) {
		this.queryBoundData = queryBoundData;
	}
}
