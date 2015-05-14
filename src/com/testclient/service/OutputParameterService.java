package com.testclient.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Service;

import com.testclient.factory.JsonObjectMapperFactory;
import com.testclient.httpmodel.DataGridJson;
import com.testclient.httpmodel.Json;
import com.testclient.httpmodel.ServiceBoundDataItem;
import com.testclient.model.ServiceBoundDataItemContainer;
import com.testclient.utils.FileNameUtils;


@Service("OutputParameterService")
public class OutputParameterService {
	private static final Logger logger = Logger.getLogger(OutputParameterService.class);
	
	public Json addOutputParameterDataItem(String testPath,ServiceBoundDataItem item){	
		Json j = new Json();
		try {
			File f=new File(FileNameUtils.getOutputFilePath(testPath));
			ServiceBoundDataItemContainer c=new ServiceBoundDataItemContainer();
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			if(f.exists())
				c= mapper.readValue(f, ServiceBoundDataItemContainer.class);
			c.getServiceBoundData().put(item.getId(), item);
			mapper.writeValue(f, c);
			j.setSuccess(true);
		} catch (IOException e) {
			j.setMsg(e.getClass()+": "+e.getMessage());
			j.setSuccess(false);
		}
		return j;
	}
	
	public Json deleteOutputParameterDataItem(String testPath,String id){
		Json j = new Json();
		try {
			File f=new File(FileNameUtils.getOutputFilePath(testPath));
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			ServiceBoundDataItemContainer c = mapper.readValue(f, ServiceBoundDataItemContainer.class);
			c.getServiceBoundData().remove(id);
			mapper.writeValue(f, c);
			j.setSuccess(true);
		} catch (IOException e) {
			j.setMsg(e.getClass()+": "+e.getMessage());
			j.setSuccess(false);
		}
		return j;
	}

	public DataGridJson getOutputParameterDataItems(String testPath){
		DataGridJson j = new DataGridJson();
		List<ServiceBoundDataItem> row=new ArrayList<ServiceBoundDataItem>();
		try {
			File f=new File(FileNameUtils.getOutputFilePath(testPath));	
			if(f.exists()){
				ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
				ServiceBoundDataItemContainer c = mapper.readValue(f, ServiceBoundDataItemContainer.class);
				for(Entry<String,ServiceBoundDataItem> entry:c.getServiceBoundData().entrySet()){
					row.add(entry.getValue());
				}
			}
		}catch (IOException e) {
			logger.error(e.getClass()+e.getMessage());
		}
		j.setRows(row);
		j.setTotal(row.size());
		return j;
	}
}
