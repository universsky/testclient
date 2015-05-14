package com.testclient.service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Service;

import com.testclient.factory.JsonObjectMapperFactory;
import com.testclient.httpmodel.Json;
import com.testclient.model.HttpTarget;
import com.testclient.model.Parameter;
import com.testclient.model.SocketTarget;
import com.testclient.utils.FileNameUtils;


@Service("buildRequestService")
public class BuildRequestService {
	private static final Logger logger = Logger.getLogger(BuildRequestService.class);
	
	public Json buildRequest(String foldername) throws Exception{
		Json j=new Json();
		Map<String,Parameter> pm=new HashMap<String,Parameter>();
		if(foldername.endsWith("-leaf")){
			File f=new File(FileNameUtils.getHttpTarget(foldername));
			if(!f.exists()){
				j.setSuccess(true);
				return j;
			}
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			HttpTarget target = mapper.readValue(f, HttpTarget.class);
			pm=target.getParameters();
		}else if(foldername.endsWith("-t")){
			File f=new File(FileNameUtils.getSocketTestAbsPath(foldername));
			if(!f.exists()){
				j.setSuccess(true);
				return j;
			}
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			SocketTarget target = mapper.readValue(f, SocketTarget.class);
			pm=target.getParameters();
		}
		j.setObj(pm);
		j.setSuccess(true);
		
		return j;
	}
	
}
