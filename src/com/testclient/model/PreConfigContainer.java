package com.testclient.model;

import java.util.HashMap;
import java.util.Map;

import com.testclient.httpmodel.PreConfigItem;


public class PreConfigContainer {
	private Map<String,PreConfigItem> pc= new HashMap<String,PreConfigItem>();

	public Map<String,PreConfigItem> getPreConfig() {
		return pc;
	}

	public void setPreConfig(Map<String,PreConfigItem> pc) {
		this.pc = pc;
	}
	
	
	
}
