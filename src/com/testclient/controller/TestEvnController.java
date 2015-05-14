package com.testclient.controller;

import java.io.File;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testclient.httpmodel.Json;
import com.testclient.utils.FileNameUtils;


@Controller
public class TestEvnController {
	private static final Logger logger = Logger.getLogger(TestEvnController.class);
	
	@RequestMapping(value="/showEnvironment", method=RequestMethod.POST )
	@ResponseBody
	public Json showEnvironment(@RequestParam String folderName) throws Exception {
		Json j=new Json();
		File f=new File(FileNameUtils.getEnvFilePath(folderName));
		if(!f.exists()){
			j.setSuccess(true);
			j.setObj("");
			return j;
		}
		String envstring=FileUtils.readFileToString(f, "utf-8");
		j.setObj(envstring);
		System.out.println(envstring);
		j.setSuccess(true);
		return j;
	}
	@RequestMapping(value="/saveEnvironment", method=RequestMethod.POST )
	@ResponseBody
	public Json saveEnvironment(@RequestParam String folderName,@RequestParam String env) throws Exception {
		Json j=new Json();
		File f=new File(FileNameUtils.getEnvFilePath(folderName));
		String[] envarray = env.replace("\r", "").split("\n");
		String formatenv="";
		for(String st:envarray){
			String[] kv=st.split("=");
			if(kv.length==2){
				formatenv+=kv[0].trim()+"="+kv[1].trim()+"\n";
			}if(kv.length>2){
				formatenv+=kv[0].trim()+"="+ StringUtils.substringAfter(st, kv[0]+"=").trim()+"\n";
			}
		}
		FileUtils.writeStringToFile(f, formatenv, "utf-8");
		j.setSuccess(true);
		return j;
	}
}
