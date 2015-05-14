package com.testclient.service;

import java.io.File;
import java.io.IOException;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.testclient.factory.JsonObjectMapperFactory;
import com.testclient.httpmodel.Json;
import com.testclient.model.ConvertRequest;
import com.testclient.model.ConvertResponse;
import com.testclient.model.SocketTarget;
import com.testclient.utils.FileNameUtils;
import com.testclient.utils.MyFileUtils;
import com.testclient.utils.SocketOperationUtils;


@Service("socketTestConfigService")
public class SocketTestConfigService {
	private static final Logger logger = Logger.getLogger(SocketTestConfigService.class);
	@Autowired
	SocketOperationUtils socketOperationUtils;
	
	public Json saveSocketTarget(SocketTarget item,String folderName){
		Json j=new Json();
		MyFileUtils.makeDir(folderName);
		try {
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			mapper.writeValue(new File(FileNameUtils.getSocketTestAbsPath(folderName)), item);
			j.setSuccess(true);
		} catch (IOException e) {
			logger.error("sockettarget新建失败(json文件生成失败)", e);
			j.setSuccess(false);
			j.setMsg("sockettarget新建失败(json文件生成失败)");
		}
		return j;
	}
	
	public Json getSocketTarget(String folderName){
		Json j=new Json();
		try {
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			File f=new File(FileNameUtils.getSocketTestAbsPath(folderName));
			if(!f.exists()){
				j.setSuccess(false);
				j.setMsg("not found file");
				return j;
			}
			SocketTarget item = mapper.readValue(f, SocketTarget.class);
			j.setObj(item);
			j.setSuccess(true);
		} catch (Exception e) {
			logger.error("sockettarget详情读取失败", e);
			j.setSuccess(false);
			j.setMsg(e.getMessage());
		}
		return j;
	}
	
	public Json convertDatagram(String datagram,int datagramVersion,boolean includeHead){
		Json j=new Json();
		ConvertResponse obj=new ConvertResponse();
		ConvertRequest request=new ConvertRequest();
		request.setDatagram(datagram);
		request.setDatagramVersion(datagramVersion);
		request.setIncludeHead(includeHead);
		obj=socketOperationUtils.convertDatagram(request);
		j.setObj(obj);
		j.setSuccess(true);
		return j;
	}
}
