package com.testclient.controller;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testclient.enums.LabFolderName;
import com.testclient.enums.RunningStatus;
import com.testclient.enums.SeperatorDefinition;
import com.testclient.enums.TimeFormatDefiniation;
import com.testclient.httpmodel.DataGridJson;
import com.testclient.httpmodel.Json;
import com.testclient.httpmodel.TestExecutionJson;
import com.testclient.httpmodel.TestExecutionStore;
import com.testclient.service.BatchTestService;
import com.testclient.service.TestExecuteService;
import com.testclient.utils.HttpServletRequestUtils;

@Controller
public class BatchTestController {
	private static final Logger logger = Logger.getLogger(BatchTestController.class);
	
	@Autowired
	BatchTestService batchTestService;
	@Autowired
	TestExecuteService testExecuteService;

	@RequestMapping(value="/executeBatchTest")
	@ResponseBody
	public void executeBatchTest(@RequestParam String dirPath){
		batchTestService.executeBatchTest(dirPath,null);
	}
	
	@RequestMapping(value="/getTestItems")
	@ResponseBody
	public DataGridJson getTestItems(@RequestParam String folderName){
		return batchTestService.getRecentTestItems(folderName);
	}
	
	@RequestMapping(value="/getTestDetailResult")
	@ResponseBody
	public Json getTestDetailResult(@RequestParam String testPath){
		return batchTestService.getDetailTestResultByTestPath(testPath);
	}
	
	@RequestMapping(value="/deleteTestInfo")
	@ResponseBody
	public Json deleteTestInfo(@RequestParam String folder,@RequestParam String time){
		return batchTestService.deleteTestInfo(folder, time);
	}
	
	////暂时只支持运行公共RunningSet
	@RequestMapping(value="/asyncRunTest")
	@ResponseBody
	public synchronized TestExecutionJson asyncRunTest(HttpServletRequest request, HttpServletResponse response){
		return this.asyncRunTest(request, response, null);
	}
	
	@RequestMapping(value="/asyncRunTest4GBK")
	@ResponseBody
	public synchronized TestExecutionJson asyncRunTest4GBK(HttpServletRequest request, HttpServletResponse response){
		return this.asyncRunTest(request, response, "GBK");
	}

	private synchronized TestExecutionJson asyncRunTest(HttpServletRequest request, HttpServletResponse response,String charset){
		TestExecutionJson json = new TestExecutionJson();
		charset=null!=charset && charset.equalsIgnoreCase("GBK") ? charset : "utf-8";
		response.setCharacterEncoding(charset);
		response.setContentType("application/json");
		try {
			request.setCharacterEncoding(charset);
			String body = HttpServletRequestUtils.getHttpServletRequestBody(request);
			String source=request.getParameter("source")==null ? HttpServletRequestUtils.getValueFromRequestInput(body,"source") : request.getParameter("source");
			String rsfullname="";
			if(null==source || source.isEmpty()){
				json.setStatus("parameter 'source' configuration error.");
				return json;
			}else{
				source=!source.endsWith("/")?source:source.substring(0,source.length()-1);
				if(!source.contains("/")){
					rsfullname=batchTestService.getRunningSetFoldername(source);
					if(rsfullname.isEmpty()){
						json.setStatus("Not found Running Set '"+source+"'");
						return json;
					}
				}else{
					if(!new File(source).exists()){
						json.setStatus("Not found Path '"+source+"'");
						return json;
					}
				}
			}
			String iteration=request.getParameter("iteration")==null ? HttpServletRequestUtils.getValueFromRequestInput(body,"iteration") : request.getParameter("iteration");
			int loop=1;
			if(null!=iteration && !iteration.isEmpty() && StringUtils.isNumeric(iteration)){
				loop=Integer.parseInt(iteration);
			}
			TestExecutionStore store = TestExecutionStore.getInstance();
			Map<String,TestExecutionJson> result=store.getResultStore();
			if(result.containsKey(source)){
				json=result.get(source);}
			json.setReportview("http://192.168.81.33"+request.getContextPath()+"#report="+source);
			if(!source.endsWith("-leaf") && !source.endsWith("-t")){
				if(result.containsKey(source)){
					json=result.get(source);
					if(json.getStatus().equals(RunningStatus.inProgress)){
						//get status and result of resultstore
						return batchTestService.retrieveBatchTestExecutionJson(source,null,null,RunningStatus.inProgress);
					}
				}
				//insert initialized record
				SimpleDateFormat format = new SimpleDateFormat(TimeFormatDefiniation.standard);			
				String time=format.format(new Date());
				if(!json.getTime().isEmpty()){
					json.setLasttime(json.getTime());
				}
				json.setTime(time);
				if(!json.getStatus().isEmpty()){
					json.setLaststatus(json.getStatus());
				}
				json.setStatus(RunningStatus.inProgress);
				json.setRunningtimes(json.getRunningtimes()+"+1");
				int total=batchTestService.getNumberOfCaseFromFolder(rsfullname.isEmpty()?source:rsfullname);
				json.setTotal(total);
				json.setNorun(total);
				json.setPass(0);
				json.setFail(0);
				json.setInvalid(0);
				json.setError(0);
				result.put(source, json);
				store.setResultStore(result);
				new Thread(source+"|"+loop+"|"+time){ 
					public void run(){
						String str=this.getName();
						String source=StringUtils.substringBefore(str, "|");
						str=str.replace(source+"|", "");
						String iteration=StringUtils.substringBefore(str, "|");
						String time=StringUtils.substringAfter(str, "|");
						SimpleDateFormat sdf = new SimpleDateFormat(TimeFormatDefiniation.standard);
						Date date=null; 
						try {
							date = sdf.parse(time);
							batchTestService.runTest(source, Integer.parseInt(iteration), date);
						} catch (Exception e) {
							// TODO Auto-generated catch block
							batchTestService.retrieveBatchTestExecutionJson(source,date,null,null);
						}
					}
				}.start();
				return json;
			}else{
				result.put(source, json);
				return batchTestService.runTest(source, loop, null);
			}
		}catch(Exception e){
			try {
				response.getWriter().println(e.getMessage()+" "+e.getStackTrace());
			} catch (IOException ex) {
				// TODO Auto-generated catch block
				logger.error(ex.getMessage()+" "+ex.getStackTrace());
			}
		}
		return json;
	}
}
