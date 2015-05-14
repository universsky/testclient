package com.testclient.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testclient.httpmodel.CheckPointItem;
import com.testclient.httpmodel.DataGridJson;
import com.testclient.httpmodel.Json;
import com.testclient.httpmodel.TestConfigItem;
import com.testclient.service.HttpTargetService;
import com.testclient.utils.MyFileUtils;


@Controller
public class TestConfigController {
	private static final Logger logger = Logger.getLogger(TestConfigController.class);
	
	@Autowired
	HttpTargetService httpTargetService;
	
	@RequestMapping(value="/saveConfig", method=RequestMethod.POST )
	@ResponseBody
	public Json saveConfig(@ModelAttribute TestConfigItem  testconfigitem) {
		return httpTargetService.addOrModifyHttpTarget(testconfigitem);
	}
	
	@RequestMapping(value="/getConfig", method=RequestMethod.POST )
	@ResponseBody
	public Json getConfig(@RequestParam String folderName) {
		return httpTargetService.getHttpTarget(folderName);
	}
	
	@RequestMapping(value="/addCheckPoint" )
	@ResponseBody
	public Json addCheckPoint(@RequestParam String folderName,@RequestBody CheckPointItem[] item) throws Exception {
		return httpTargetService.addCheckPoint(folderName, item[0]);
	}
	
	@RequestMapping(value="/deleteCheckPoint" )
	@ResponseBody
	public Json deleteCheckPoint(@RequestParam String folderName,@RequestBody CheckPointItem[] item) throws Exception {
		return httpTargetService.deleteCheckPoint(folderName, item[0].getId());
	}
	
	@RequestMapping(value="/getCheckPoint" )
	@ResponseBody
	public DataGridJson getCheckPoint(@RequestParam String folderName) throws Exception {
		return httpTargetService.getCheckPoints(folderName);
	}
	
	@RequestMapping(value="/setParameterInfo" )
	@ResponseBody
	public void setParameterInfo(@RequestParam String path,@RequestParam String fieldName,@RequestParam String info) {
		httpTargetService.updateParameterExtraInfo(path, fieldName, info);
	}
	
	@RequestMapping(value="/generateCheckpoints" )
	@ResponseBody
	public void generateCheckpointsByArray(@RequestParam String testPath,@RequestParam Object[] checkInfos) throws Exception {
		httpTargetService.generateCheckpointsByArray(testPath, checkInfos);
	}
}
