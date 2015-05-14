package com.testclient.controller;

import java.io.File;
import java.util.Map.Entry;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testclient.enums.ActionFileName;
import com.testclient.enums.SeperatorDefinition;
import com.testclient.factory.JsonObjectMapperFactory;
import com.testclient.httpmodel.Json;
import com.testclient.httpmodel.SqlEntity;


@Controller
public class TestActionController {
	
	private static final Logger logger = Logger.getLogger(TestActionController.class);
	
	@RequestMapping(value="/saveTestAction" )
	@ResponseBody
	public Json saveTestAction(@RequestParam String testPath,@RequestParam String sqlActionType,@RequestParam String source,@RequestParam String server,
			@RequestParam String port,@RequestParam String username,@RequestParam String password,@RequestParam String database,@RequestParam String sql) throws Exception {
		Json j = new Json();
		String filename=getFileName(sqlActionType);
		ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
		File f=new File(testPath+"/"+filename);
		SqlEntity entity=new SqlEntity();
		if(!f.exists()){
			f.createNewFile();
		}
		entity.setSource(source);
		entity.setServer(server);
		entity.setPort(port);
		entity.setUsername(username);
		entity.setPassword(password);
		entity.setDatabase(database);
		entity.setSql(sql);	
		mapper.writeValue(f, entity);
		j.setSuccess(true);
		return j;
	}
	
	@RequestMapping(value="/saveServiceAction" )
	@ResponseBody
	public Json saveServiceAction(@RequestParam String testPath,@RequestParam String serviceCalled,@RequestParam String srvActionType) throws Exception {
		Json j = new Json();
		String filename=getFileName(srvActionType);
		File f=new File(testPath+"/"+filename+"2");
		if(f.exists())
			f.delete();
		f.createNewFile();
		FileUtils.writeStringToFile(f, serviceCalled);
		j.setSuccess(true);
		return j;
	}
	
	@RequestMapping(value="/cleanServiceAction" )
	@ResponseBody
	public void cleanServiceAction(@RequestParam String testPath,@RequestParam String srvActionType) throws Exception {
		String filename=getFileName(srvActionType);
		File f=new File(testPath+"/"+filename+"2");
		if(f.exists())
			f.delete();
	}

	@RequestMapping(value="/cleanTestAction" )
	@ResponseBody
	public void cleanTestAction(@RequestParam String testPath,@RequestParam String sqlActionType) throws Exception {
		String filename=getFileName(sqlActionType);
		File f=new File(testPath+"/"+filename);
		if(f.exists())
			f.delete();
	}
	
	private String getFileName(String sqlActionType){
		String filename="";
		if(sqlActionType.equalsIgnoreCase(ActionFileName.setup)){
			filename=ActionFileName.setup;
		}else if(sqlActionType.equalsIgnoreCase(ActionFileName.teardown)){
			filename=ActionFileName.teardown;
		}
		return filename;
	}
	
	@RequestMapping(value="/getTestAction",method=RequestMethod.POST )
	@ResponseBody
	public Json getTestAction(@RequestParam String testPath,@RequestParam String sqlActionType) throws Exception {
		Json j = new Json();
		String filename=getFileName(sqlActionType);
		File f=new File(testPath+"/"+filename);
		if(f.exists()){
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			SqlEntity entity= mapper.readValue(f, SqlEntity.class);
			j.setObj(entity);
		}
		j.setSuccess(true);
		return j;
	}
	
	@RequestMapping(value="/getServiceAction",method=RequestMethod.POST )
	@ResponseBody
	public Json getServiceAction(@RequestParam String testPath,@RequestParam String srvActionType) throws Exception {
		Json j = new Json();
		String filename=getFileName(srvActionType);
		File f=new File(testPath+"/"+filename+"2");
		if(f.exists()){
			String service=FileUtils.readFileToString(f);
			j.setObj(service);
		}
		j.setSuccess(true);
		return j;
	}
}
