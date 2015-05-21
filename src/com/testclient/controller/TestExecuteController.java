package com.testclient.controller;

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

import com.testclient.enums.LoopParameterNameInForm;
import com.testclient.enums.SeperatorDefinition;
import com.testclient.enums.TestStatus;
import com.testclient.httpmodel.CheckPointItem;
import com.testclient.httpmodel.Json;
import com.testclient.httpmodel.TestResultItem;
import com.testclient.service.TestExecuteService;
import com.testclient.utils.Auto;
import com.testclient.utils.TemplateUtils;

@Controller
public class TestExecuteController {
	private static final Logger logger = Logger.getLogger(TestExecuteController.class);
	
	@Autowired
	TestExecuteService testExecuteService;

	@RequestMapping(value="/executeTest", method=RequestMethod.POST )
	@ResponseBody
	public Json executeTest(HttpServletRequest request, HttpServletResponse response) {
		Json j = new Json();
		String path = "";
		List<TestResultItem> objlist=new ArrayList<TestResultItem>();
		Map requestmap =new HashMap();
		try{
			Map map=request.getParameterMap(); 
	        Set key = map.keySet(); 
	        requestmap.put("auto", new Auto());
	        for(Object aaa: key.toArray()){ 
	        	String parakey = aaa.toString(); 
	        	String paravalue = ((String[])map.get(aaa))[0];
	        	String paraval=testExecuteService.parsePreServiceReqParameter(paravalue);
	        	//if defaultvalue is returned function of Auto class.
	        	if(paravalue.equals(paraval)){
	        		paraval = TemplateUtils.getString(paravalue, requestmap);
	        	}
	        	requestmap.put(parakey, paraval);
	        }
	        path = requestmap.get("__HiddenView_path").toString();
	        String looptimes=(String)requestmap.get(LoopParameterNameInForm.name);
	        looptimes=looptimes!=null?looptimes:"1";
	        String[] loopparas=looptimes.split(SeperatorDefinition.seperator);
	        looptimes=loopparas[0];
	        if(!looptimes.isEmpty() && StringUtils.isNumeric(looptimes)){
	        	for(int i=0;i<Integer.parseInt(looptimes);i++){
	        		try{
	        			if(loopparas.length>1)
			        		Thread.sleep(Integer.parseInt(StringUtils.isNumeric(loopparas[1])?loopparas[1]:"1"));
		        		testExecuteService.setupAction(path);
						j = testExecuteService.executeTest(requestmap);
		        	}catch(Exception e){
		        		j.setMsg(e.getClass()+e.getMessage());
		        		j.setSuccess(false);
		        	}finally{
		    			try{
		    				TestResultItem result=(TestResultItem)j.getObj();
		    				objlist.add(result);
		    				testExecuteService.teardownAction(path,requestmap,result.getResponseInfo());
		    			}catch(Exception e){
		    				j.setMsg(e.getClass()+e.getMessage());
		    				j.setSuccess(false);
		    			}
		    		}
	        	}
	        	j.setObj(objlist);
	        }else{
	        	j.setMsg("循环次数必须为自然数！");
	        	j.setSuccess(false);
	        }
		}catch(Exception e){
			j.setMsg(e.getClass()+e.getMessage());
			logger.error(e.getClass()+e.getMessage());
			j.setSuccess(false);
		}
		return j;
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
