package com.testclient.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testclient.httpmodel.DataGridJson;
import com.testclient.httpmodel.Json;
import com.testclient.httpmodel.ServiceBoundDataItem;
import com.testclient.service.OutputParameterService;


@Controller
public class OutputParameterController {
	private static final Logger logger = Logger.getLogger(OutputParameterController.class);
	
	@Autowired
	OutputParameterService outputParameterService;
	
	@RequestMapping(value="/addOutputParameterDataItem" )
	@ResponseBody
	public Json addOutputParameterDataItem(@RequestParam String testPath,@RequestBody ServiceBoundDataItem[] item) throws Exception {
		return outputParameterService.addOutputParameterDataItem(testPath, item[0]);
	}
	
	@RequestMapping(value="/deleteOutputParameterDataItem" )
	@ResponseBody
	public Json deleteOutputParameterDataItem(@RequestParam String testPath,@RequestBody ServiceBoundDataItem[] item) throws Exception {
		return outputParameterService.deleteOutputParameterDataItem(testPath, item[0].getId());
	}
	
	@RequestMapping(value="/getOutputParameterDataItems" )
	@ResponseBody
	public DataGridJson getOutputParameterDataItems(@RequestParam String testPath) throws Exception {
		return outputParameterService.getOutputParameterDataItems(testPath);
	}
}
