package ctripwireless.testclient.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import ctripwireless.testclient.enums.LoopParameterNameInForm;
import ctripwireless.testclient.enums.SeperatorDefinition;
import ctripwireless.testclient.enums.TestStatus;
import ctripwireless.testclient.httpmodel.CheckPointItem;
import ctripwireless.testclient.httpmodel.Json;
import ctripwireless.testclient.httpmodel.TestResultItem;
import ctripwireless.testclient.service.TestExecuteService;
import ctripwireless.testclient.utils.Auto;
import ctripwireless.testclient.utils.TemplateUtils;

@Controller
public class TestExecuteController {
	private static final Logger logger = Logger.getLogger(TestExecuteController.class);
	
	@Autowired
	TestExecuteService testExecuteService;

	@RequestMapping(value="/executeTest", method=RequestMethod.POST )
	@ResponseBody
	public Json executeTest(HttpServletRequest request, HttpServletResponse response) {
		Json j = new Json();
		return testExecuteService.executeTestInFront(request);
	}

	@RequestMapping(value="/generateHistoryFile", method=RequestMethod.POST )
	@ResponseBody
	public void generateHistoryFile(HttpServletRequest request, HttpServletResponse response) {
		String foldername = request.getParameter("foldername");
		String reqstate=request.getParameter("reqstate");
		if(reqstate.equalsIgnoreCase("success")){
			JSONArray ja= JSONArray.fromObject(request.getParameter("testresultitemcollectionjson"));
			for(int i=0;i<ja.length();i++){
				TestResultItem tri=new TestResultItem();
				try{
					JSONObject itemobj=ja.getJSONObject(i);
					String result=itemobj.getString("result");
					tri.setResult(result);
					if(!result.equals(TestStatus.exception)){
						Set<CheckPointItem> cps=new HashSet<CheckPointItem>();
						
						tri.setTime(itemobj.getString("time"));
						tri.setRequestInfo(itemobj.getString("requestInfo"));
						tri.setResponseInfo(itemobj.getString("responseInfo"));
						tri.setDuration(itemobj.getString("duration"));
						
						Object[] callbackarr=JSONArray.fromObject(itemobj.get("callback")).toArray();
						tri.setCallback(new HashSet(Arrays.asList(callbackarr)));
						JSONArray jsonarr=JSONArray.fromObject(itemobj.get("checkPoint"));
						for(int j=0;j<jsonarr.length();j++){
							CheckPointItem item=(CheckPointItem)JSONObject.toBean(jsonarr.getJSONObject(j), CheckPointItem.class);
							cps.add(item);
						}
						tri.setCheckPoint(cps);
					}else
						tri.setComment(itemobj.getString("comment"));
				}catch(Exception e){
					tri.setDuration("");
					tri.setResult(TestStatus.exception);
					tri.setComment(e.getClass().toString()+": "+e.getMessage());
				}finally{
					testExecuteService.generateHistoryFile(foldername, tri);
				}
			}
		}else{
			TestResultItem tri=new TestResultItem();
			tri.setDuration("");
			tri.setResult(TestStatus.exception);
			String comment="";
			String json=request.getParameter("obj");
			if(json.startsWith("{") && json.endsWith("}"))
				comment=JSONObject.fromObject(json).get("comment").toString();
			else if(json.startsWith("[") && json.endsWith("]"))
				comment=JSONArray.fromObject(json).getJSONObject(0).get("comment").toString();
			tri.setComment(comment);
			testExecuteService.generateHistoryFile(foldername, tri);
		}
	}
	
	@RequestMapping(value="/getTestResponse", method=RequestMethod.POST )
	@ResponseBody
	public Json getTestResponse(@RequestParam String path){
		Json j=new Json();
		Map request = testExecuteService.getRequestParameterMap(path);
		TestResultItem item = testExecuteService.getTestResultItem(path,request);
		if(!item.getResult().equals(TestStatus.exception)){
			j.setObj(item.getResponseInfo());
			j.setSuccess(true);
		}else{
			j.setMsg(item.getComment());
			j.setSuccess(false);
		}
		return j;
	}
}
