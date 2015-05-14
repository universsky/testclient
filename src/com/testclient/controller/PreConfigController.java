package com.testclient.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testclient.factory.JsonObjectMapperFactory;
import com.testclient.httpmodel.DataGridJson;
import com.testclient.httpmodel.Json;
import com.testclient.httpmodel.PreConfigItem;
import com.testclient.httpmodel.QueryBoundDataItem;
import com.testclient.httpmodel.ServiceBoundDataItem;
import com.testclient.model.HttpTarget;
import com.testclient.model.Parameter;
import com.testclient.model.SocketTarget;
import com.testclient.model.SqlQueryReturn;
import com.testclient.service.PreConfigService;
import com.testclient.service.TestExecuteService;
import com.testclient.utils.FileNameUtils;
import com.testclient.utils.JdbcUtils;
import com.testclient.utils.TemplateUtils;


@Controller
public class PreConfigController {
	@Autowired
	PreConfigService preConfigService;
	@Autowired
	TestExecuteService testExecuteService;
	
	private static final Logger logger = Logger.getLogger(PreConfigController.class);
	
	@RequestMapping(value="/addPreConfigItem" )
	@ResponseBody
	public Json addPreConfigItem(@RequestParam String testPath,@RequestBody PreConfigItem[] item) throws Exception {
		return preConfigService.addPreConfigItem(testPath, item[0]);
	}
	
	@RequestMapping(value="/markParameter" )
	@ResponseBody
	public Json markParameter(@RequestParam String testPath) {
		return preConfigService.markParameter(testPath);
	}
	
	@RequestMapping(value="/recoveryParameter" )
	@ResponseBody
	public Json recoveryParameter(@RequestParam String testPath) {
		return preConfigService.recoveryParameter(testPath);
	}
	
	@RequestMapping(value="/deletePreConfigItem" )
	@ResponseBody
	public Json deletePreConfigItem(@RequestParam String testPath,@RequestBody PreConfigItem[] item) throws Exception {
		return preConfigService.deletePreConfigItem(testPath, item[0].getId());
	}
	
	@RequestMapping(value="/getPreConfigItems" )
	@ResponseBody
	public DataGridJson getPreConfigItems(@RequestParam String testPath) throws Exception {
		return preConfigService.getPreConfigItems(testPath);
	}
	
	@RequestMapping(value="/testDBConnection", method=RequestMethod.POST)
	@ResponseBody
	public Json testDBConnection(HttpServletRequest request, HttpServletResponse response) {
		Json j=new Json();
		String path = request.getParameter("__HiddenView_path").toString();
		Map<String,String> evnmap=testExecuteService.loadEnv(path);
		String source = request.getParameter("source") != null ? request.getParameter("source").toString() : "";
		String server = request.getParameter("server") != null ? request.getParameter("server").toString() : "";
		String port = request.getParameter("port") != null ? request.getParameter("port").toString() : "";
		String username= "";//request.getParameter("username") != null ? request.getParameter("username").toString() : "";
		String password= "";//request.getParameter("password") != null ? request.getParameter("password").toString() : "";
		String database= request.getParameter("database") != null ? request.getParameter("database").toString() : "";
		if(source.startsWith("[[")){
			source=testExecuteService.processVariableInEnv(evnmap,source);
			//若未设置source环境变量，则默认数据源为sqlserver
			source=source==null?"sql server":source;
		}
		if(source.equals("sql server")){
			username = request.getParameter("username_sqlserver") != null ? request.getParameter("username_sqlserver").toString() : "";
			password = request.getParameter("password_sqlserver") != null ? request.getParameter("password_sqlserver").toString() : "";
		}else if(source.equals("mysql")){
			username = request.getParameter("username_mysql") != null ? request.getParameter("username_mysql").toString() : "";
			password = request.getParameter("password_mysql") != null ? request.getParameter("password_mysql").toString() : "";
		}
		if(server.startsWith("[["))
			server=testExecuteService.processVariableInEnv(evnmap,server);
		if(port.startsWith("[["))
			port=testExecuteService.processVariableInEnv(evnmap,port);
		if(username.startsWith("[["))
			username=testExecuteService.processVariableInEnv(evnmap,username);
		if(password.startsWith("[["))
			password=testExecuteService.processVariableInEnv(evnmap,password);
		if(database.startsWith("[["))
			database=testExecuteService.processVariableInEnv(evnmap,database);
		boolean isPass=new JdbcUtils(source,server,port,username,password,database).testDBConnection();
		j.setSuccess(isPass);
		return j;
	}
	
	@RequestMapping(value="/executeSqlQuery" )
	@ResponseBody
	public Json executeSqlQuery(@RequestParam String testPath,@RequestParam String source,@RequestParam String server,
			@RequestParam String port,@RequestParam String username,
			@RequestParam String password,@RequestParam String database,@RequestParam String sql) {
		Json j=new Json();
		try {
			Map<String,String> evnmap=testExecuteService.loadEnv(testPath);
			if(source.startsWith("[["))
				source=testExecuteService.processVariableInEnv(evnmap,source);
			if(server.startsWith("[["))
				server=testExecuteService.processVariableInEnv(evnmap,server);
			if(port.startsWith("[["))
				port=testExecuteService.processVariableInEnv(evnmap,port);
			if(username.startsWith("[["))
				username=testExecuteService.processVariableInEnv(evnmap,username);
			if(password.startsWith("[["))
				password=testExecuteService.processVariableInEnv(evnmap,password);
			if(database.startsWith("[["))
				database=testExecuteService.processVariableInEnv(evnmap,database);
			if(sql.contains("[[") && sql.contains("]]"))
				sql=testExecuteService.processEnv(evnmap,sql);
			if(sql.contains("${")){
				Map parameters = testExecuteService.getRequestParameterMap(testPath);
				sql = TemplateUtils.getString(sql, parameters);
			}
			SqlQueryReturn obj=new JdbcUtils(source,server,port,username,password,database).getReturnedColumnsAndRows(sql);
			j.setObj(obj);
			j.setSuccess(true);
		} catch (Exception e) {
			j.setMsg(e.getClass()+e.getMessage());
			j.setSuccess(false);
		}
		return j;
	}
	
	@RequestMapping(value="/executeSqlQueryAfterResponse" )
	@ResponseBody
	public Json executeSqlQueryAfterResponse(@RequestParam String testPath,@RequestParam String source,@RequestParam String server,
			@RequestParam String port,@RequestParam String username,
			@RequestParam String password,@RequestParam String database,@RequestParam String sql) {
		Json j=new Json();
		try {
			Map<String,String> evnmap=testExecuteService.loadEnv(testPath);
			if(source.startsWith("[["))
				source=testExecuteService.processVariableInEnv(evnmap,source);
			if(server.startsWith("[["))
				server=testExecuteService.processVariableInEnv(evnmap,server);
			if(port.startsWith("[["))
				port=testExecuteService.processVariableInEnv(evnmap,port);
			if(username.startsWith("[["))
				username=testExecuteService.processVariableInEnv(evnmap,username);
			if(password.startsWith("[["))
				password=testExecuteService.processVariableInEnv(evnmap,password);
			if(database.startsWith("[["))
				database=testExecuteService.processVariableInEnv(evnmap,database);
			if(sql.contains("[[") && sql.contains("]]"))
				sql=testExecuteService.processEnv(evnmap,sql);
			if(sql.contains("${")){
				Map parameters = testExecuteService.getRequestParameterMap(testPath);
				sql = TemplateUtils.getString(sql, parameters);
			}
			sql=testExecuteService.processOutputParameter(testPath, sql);
			SqlQueryReturn obj=new JdbcUtils(source,server,port,username,password,database).getReturnedColumnsAndRows(sql);
			j.setObj(obj);
			j.setSuccess(true);
		} catch (Exception e) {
			j.setMsg(e.getClass()+e.getMessage());
			j.setSuccess(false);
		}
		return j;
	}
	
	@RequestMapping(value="/addQueryBoundDataItem" )
	@ResponseBody
	public Json addQueryBoundDataItem(@RequestParam String testPath,@RequestParam String timestamp,@RequestBody QueryBoundDataItem[] item) throws Exception {
		return preConfigService.addQueryBoundDataItem(testPath, timestamp, item[0]);
	}
	
	@RequestMapping(value="/deleteQueryBoundDataItem" )
	@ResponseBody
	public Json deleteQueryBoundDataItem(@RequestParam String testPath,@RequestParam String timestamp,@RequestBody QueryBoundDataItem[] item) throws Exception {
		return preConfigService.deleteQueryBoundDataItem(testPath, timestamp,item[0].getId());
	}
	
	@RequestMapping(value="/getQueryBoundDataItems" )
	@ResponseBody
	public DataGridJson getQueryBoundDataItems(@RequestParam String testPath,@RequestParam String timestamp) throws Exception {
		return preConfigService.getQueryBoundDataItems(testPath,timestamp);
	}
	
	@RequestMapping(value="/getQueryBoundDataItemsString" )
	@ResponseBody
	public Json getQueryBoundDataItemsString(@RequestParam String testPath,@RequestParam String timestamp){
		Json j =new Json();
		String str=preConfigService.getQueryBoundDataItemsString(testPath,timestamp);
		j.setObj(str);
		j.setSuccess(true);
		return j;
	}
	
	@RequestMapping(value="/getRequestParameterNames" )
	@ResponseBody
	public Json getRequestParameterNames(@RequestParam String testPath) throws Exception {
		Json j = new Json();
		List<String> list=new ArrayList<String>();
		try {
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			Map<String, Parameter> paras=new HashMap<String,Parameter>();
			if(testPath.endsWith("-leaf")){
				File f=new File(FileNameUtils.getHttpTarget(testPath));
				if(f.exists()){
					HttpTarget target = mapper.readValue(f, HttpTarget.class);
					paras = target.getParameters();
				}
			}else if(testPath.endsWith("-t")){
				File f=new File(FileNameUtils.getSocketTestAbsPath(testPath));
				if(f.exists()){
					SocketTarget target = mapper.readValue(f, SocketTarget.class);
					paras=target.getParameters();
				}
			}
			for(Parameter p : paras.values()){
				String name=p.getName();
				list.add(name);
			}
		}catch (IOException e) {
			j.setMsg(e.getClass()+e.getMessage());
			j.setSuccess(false);
		}
		j.setObj(list);
		j.setSuccess(true);
		return j;
	}
	
	@RequestMapping(value="/removeTempQueryBoundConfigFile" )
	@ResponseBody
	public void removeTempQueryBoundConfigFile(@RequestParam String testPath,@RequestParam String timestamp) throws Exception {
		File f=new File(FileNameUtils.getQueryBoundConfigFilePath(testPath,timestamp));	
		if(f.exists())
			f.delete();
	}

	@RequestMapping(value="/addServiceBoundDataItem" )
	@ResponseBody
	public Json addServiceBoundDataItem(@RequestParam String testPath,@RequestParam String timestamp,@RequestBody ServiceBoundDataItem[] item) throws Exception {
		return preConfigService.addServiceBoundDataItem(testPath, timestamp, item[0]);
	}
	
	@RequestMapping(value="/deleteServiceBoundDataItem" )
	@ResponseBody
	public Json deleteServiceBoundDataItem(@RequestParam String testPath,@RequestParam String timestamp,@RequestBody ServiceBoundDataItem[] item) throws Exception {
		return preConfigService.deleteServiceBoundDataItem(testPath, timestamp,item[0].getId());
	}
	
	@RequestMapping(value="/getServiceBoundDataItems" )
	@ResponseBody
	public DataGridJson getServiceBoundDataItems(@RequestParam String testPath,@RequestParam String timestamp) throws Exception {
		return preConfigService.getServiceBoundDataItems(testPath,timestamp);
	}
	
	@RequestMapping(value="/getServiceBoundDataItemsString" )
	@ResponseBody
	public Json getServiceBoundDataItemsString(@RequestParam String testPath,@RequestParam String timestamp){
		Json j =new Json();
		String str=preConfigService.getServiceBoundDataItemsString(testPath,timestamp);
		j.setObj(str);
		j.setSuccess(true);
		return j;
	}
		
	@RequestMapping(value="/removeTempServiceBoundConfigFile" )
	@ResponseBody
	public void removeTempServiceBoundConfigFile(@RequestParam String testPath,@RequestParam String timestamp) throws Exception {
		File f=new File(FileNameUtils.getServiceBoundConfigFilePath(testPath,timestamp));	
		if(f.exists())
			f.delete();
	}
	
}
