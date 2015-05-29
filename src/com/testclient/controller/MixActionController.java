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
import com.testclient.httpmodel.MixActionSettingInfo;
import com.testclient.service.MixActionService;

@Controller
public class MixActionController {

	@Autowired
	MixActionService mixActionService;
	
	private static final Logger logger = Logger.getLogger(MixActionController.class);
	
	@RequestMapping(value="/getMixActionSettings" )
	@ResponseBody
	public DataGridJson getMixActionSettings(@RequestParam String testPath,@RequestParam String action) throws Exception {
		return mixActionService.getMixActionSettings(testPath, action);
	}
	
	@RequestMapping(value="/addMixActionSetting" )
	@ResponseBody
	public Json addMixActionSetting(@RequestParam String testPath,@RequestParam String action,@RequestBody MixActionSettingInfo[] item) throws Exception {
		return mixActionService.addMixActionSetting(testPath, action, item[0]);
	}
	
	@RequestMapping(value="/deleteMixActionSetting" )
	@ResponseBody
	public Json deleteMixActionSetting(@RequestParam String testPath,@RequestParam String action,@RequestBody MixActionSettingInfo[] item) throws Exception {
		return mixActionService.deleteMixActionSetting(testPath, action, item[0].getId());
	}
	
}
