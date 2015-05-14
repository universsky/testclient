package com.testclient.controller;

import java.io.File;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testclient.httpmodel.DataGridJson;
import com.testclient.httpmodel.Json;
import com.testclient.httpmodel.SqlVerificationDataItem;
import com.testclient.service.DatabaseVerficationService;
import com.testclient.utils.FileNameUtils;


@Controller
public class DatabaseVerificationController {
	private static final Logger logger = Logger.getLogger(DatabaseVerificationController.class);
	
	@Autowired
	DatabaseVerficationService databaseVerficationService;
	
	@RequestMapping(value="/addSqlVerificationDataItem" )
	@ResponseBody
	public Json addSqlVerificationDataItem(@RequestParam String testPath,@RequestParam String timestamp,@RequestBody SqlVerificationDataItem[] item) throws Exception {
		return databaseVerficationService.addSqlVerificationDataItem(testPath, timestamp, item[0]);
	}
	
	@RequestMapping(value="/deleteSqlVerificationDataItem" )
	@ResponseBody
	public Json deleteSqlVerificationDataItem(@RequestParam String testPath,@RequestParam String timestamp,@RequestBody SqlVerificationDataItem[] item) throws Exception {
		return databaseVerficationService.deleteSqlVerificationDataItem(testPath, timestamp,item[0].getId());
	}
	
	@RequestMapping(value="/getSqlVerificationDataItems" )
	@ResponseBody
	public DataGridJson getSqlVerificationDataItems(@RequestParam String testPath,@RequestParam String timestamp) throws Exception {
		return databaseVerficationService.getSqlVerificationDataItems(testPath,timestamp);
	}
	
	@RequestMapping(value="/getSqlVerificationDataItemsString" )
	@ResponseBody
	public Json getSqlVerificationDataItemsString(@RequestParam String testPath,@RequestParam String timestamp){
		Json j =new Json();
		String str=databaseVerficationService.getSqlVerificationDataItemsString(testPath,timestamp);
		j.setObj(str);
		j.setSuccess(true);
		return j;
	}
	
	@RequestMapping(value="/removeTempSqlVerificationConfigFile" )
	@ResponseBody
	public void removeTempSqlVerificationConfigFile(@RequestParam String testPath,@RequestParam String timestamp) throws Exception {
		File f=new File(FileNameUtils.getDBVerificationConfigFilePath(testPath,timestamp));	
		if(f.exists())
			f.delete();
	}
	
}
