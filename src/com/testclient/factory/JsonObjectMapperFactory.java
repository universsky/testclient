package com.testclient.factory;

import org.codehaus.jackson.map.ObjectMapper;

public class JsonObjectMapperFactory {
	static ObjectMapper instance=null;
	
	public static ObjectMapper getObjectMapper(){
		if(instance==null){
			instance=new ObjectMapper();
		}
		return instance;
	}
}
