package com.testclient.httpmodel;

import java.util.HashMap;
import java.util.Map;

public class TestExecutionStore {
	private TestExecutionStore() {}  
    private static TestExecutionStore single=null;  
    public synchronized  static TestExecutionStore getInstance() {  
         if (single == null) {    
             single = new TestExecutionStore();  
         }    
        return single;  
    }  
	  
	private Map<String,TestExecutionJson> resultStore= new HashMap<String,TestExecutionJson>();

	public Map<String,TestExecutionJson> getResultStore() {
		return resultStore;
	}

	public void setResultStore(Map<String,TestExecutionJson> resultStore) {
		this.resultStore = resultStore;
	}
	
	
}
