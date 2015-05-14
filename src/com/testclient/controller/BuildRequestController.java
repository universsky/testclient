package com.testclient.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testclient.httpmodel.Json;
import com.testclient.service.BuildRequestService;


@Controller
public class BuildRequestController {
	private static final Logger logger = Logger.getLogger(BuildRequestController.class);
	
	@Autowired
	BuildRequestService buildRequestService;
	
	@RequestMapping(value="/buildRequestForm", method=RequestMethod.POST )
	@ResponseBody
	public Json buildRequestForm(@RequestParam String folderName) throws Exception {
		return buildRequestService.buildRequest(folderName);
	}
	
}
