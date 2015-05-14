package com.testclient.service;

import java.io.File;
import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Service;

import com.testclient.enums.PreConfigType;
import com.testclient.enums.SeperatorDefinition;
import com.testclient.factory.JsonObjectMapperFactory;
import com.testclient.httpmodel.DataGridJson;
import com.testclient.httpmodel.Json;
import com.testclient.httpmodel.PreConfigItem;
import com.testclient.httpmodel.QueryBoundDataItem;
import com.testclient.httpmodel.ServiceBoundDataItem;
import com.testclient.httpmodel.TestConfigItem;
import com.testclient.model.HttpTarget;
import com.testclient.model.KeyValue;
import com.testclient.model.Parameter;
import com.testclient.model.PreConfigContainer;
import com.testclient.model.QueryBoundDataItemContainer;
import com.testclient.model.ServiceBoundDataItemContainer;
import com.testclient.model.SocketTarget;
import com.testclient.utils.FileNameUtils;


@Service("preConfigService")
public class PreConfigService {
	private static final Logger logger = Logger.getLogger(PreConfigService.class);
	
	public DataGridJson getPreConfigItems(String testPath){
		DataGridJson j = new DataGridJson();
		List<PreConfigItem> row=new ArrayList<PreConfigItem>();
		try {
			File f=new File(FileNameUtils.getPreConfigFilePath(testPath));	
			if(f.exists()){
				ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
				PreConfigContainer pcs;
				pcs = mapper.readValue(f, PreConfigContainer.class);
				for(Entry<String,PreConfigItem> entry:pcs.getPreConfig().entrySet()){
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
	
	public Json addPreConfigItem(String testPath,PreConfigItem item){	
		Json j = new Json();
		try {
			File f=new File(FileNameUtils.getPreConfigFilePath(testPath));
			PreConfigContainer c=new PreConfigContainer();
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			if(f.exists())
				c= mapper.readValue(f, PreConfigContainer.class);
			c.getPreConfig().put(item.getId(), item);
			mapper.writeValue(f, c);
			j.setSuccess(true);
		} catch (IOException e) {
			j.setMsg(e.getClass()+": "+e.getMessage());
			j.setSuccess(false);
		}
		return j;
	}
	
	public Json markParameter(String testPath){
		Json j=new Json();
		try {
			List<String> list=extractParameters(testPath);
			addLabel2TypeInParameterObject(testPath,list);
			j.setSuccess(true);
		} catch (Exception e) {
			j.setMsg(e.getClass()+": "+e.getMessage());
			j.setSuccess(false);
		}
		return j;
	}
	
	public Json recoveryParameter(String testPath){
		Json j=new Json();
		try {
			recoveryTypeInParameterObject(testPath);
			j.setSuccess(true);
		}catch (Exception e) {
			j.setMsg(e.getClass()+": "+e.getMessage());
			j.setSuccess(false);
		}
		return j;
	}
	
	private List<String> extractParameters(String testPath){
		List<String> preConfigParas=new ArrayList<String>();
		DataGridJson dgj=getPreConfigItems(testPath);
		List<PreConfigItem> items=dgj.getRows();
		for(PreConfigItem item : items){
			String setting=item.getSetting();
			String[] arr=setting.split(SeperatorDefinition.paraForReferencedService);
			if(arr.length>0){
				setting=arr[arr.length-1];
				String comment="已引用前置接口 ：" + arr[0];
				arr = setting.split(SeperatorDefinition.queryBoundRow);
				if(item.getType().equalsIgnoreCase(PreConfigType.query)){
					comment="已引用数据库查询字段 - ";
					for(String dataitem : arr){
						preConfigParas.add(dataitem.split(SeperatorDefinition.queryBoundItem)[0]
								+SeperatorDefinition.testInfoSeperator
								+comment
								+dataitem.split(SeperatorDefinition.queryBoundItem)[1]);
					}
				}else{
					for(String dataitem : arr){
						preConfigParas.add(dataitem.split(SeperatorDefinition.queryBoundItem)[0]+SeperatorDefinition.testInfoSeperator+comment);
					}
				}
			}
		}
		return preConfigParas;
	}
	
	private void addLabel2TypeInParameterObject(String testPath,List<String> parastrs){
		try {
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			Map<String,Parameter> p = new HashMap<String,Parameter>();
			if(testPath.endsWith("-leaf")){
				File f=new File(FileNameUtils.getHttpTarget(testPath));
				HttpTarget target = mapper.readValue(f, HttpTarget.class);
				p=target.getParameters();
				for(String parastr : parastrs){
					String para=parastr.split(SeperatorDefinition.testInfoSeperator)[0];
					String comment=parastr.split(SeperatorDefinition.testInfoSeperator)[1];
					if(p.containsKey(para)){
						Parameter updatedPara=p.get(para);
						updatedPara.setType("label+"+updatedPara.getType());
						updatedPara.setExtraInfo(comment+"+"+updatedPara.getExtraInfo());
						p.put(para, updatedPara);
					}
				}
				target.setParameters(p);
				mapper.writeValue(f, target);
			}else if(testPath.endsWith("-t")){
				File f=new File(FileNameUtils.getSocketTestAbsPath(testPath));
				SocketTarget target = mapper.readValue(f, SocketTarget.class);
				p=target.getParameters();
				for(String parastr : parastrs){
					String para=parastr.split(SeperatorDefinition.testInfoSeperator)[0];
					String comment=parastr.split(SeperatorDefinition.testInfoSeperator)[1];
					if(p.containsKey(para)){
						Parameter updatedPara=p.get(para);
						updatedPara.setType("label+"+updatedPara.getType());
						updatedPara.setExtraInfo(comment+"+"+updatedPara.getExtraInfo());
						p.put(para, updatedPara);
					}
				}
				target.setParameters(p);
				mapper.writeValue(f, target);
			}
		} catch (Exception e) {
			logger.error("httptarget详情读取失败", e);
		}
	}
	
	private void recoveryTypeInParameterObject(String testPath){
		try{
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			if(testPath.endsWith("-leaf")){
				File f=new File(FileNameUtils.getHttpTarget(testPath));
				HttpTarget target = mapper.readValue(f, HttpTarget.class);
				Map<String,Parameter> c=target.getParameters();
				for(Entry<String,Parameter> e : c.entrySet()){
					Parameter p=e.getValue();
					String type=p.getType();
					String info=p.getExtraInfo();
					if(type.startsWith("label+")){
						p.setType(type.substring(6));
					}
					if(info.contains("+")){
						int pos=info.indexOf("+")+1;
						if(info.length()!=pos)
							p.setExtraInfo(info.substring(pos));
						else
							p.setExtraInfo("");
					}
					c.put(p.getName(), p);
				}
				target.setParameters(c);
				mapper.writeValue(f, target);
			}else if(testPath.endsWith("-t")){
				File f=new File(FileNameUtils.getSocketTestAbsPath(testPath));
				SocketTarget target = mapper.readValue(f, SocketTarget.class);
				Map<String,Parameter> c=target.getParameters();
				for(Entry<String,Parameter> e : c.entrySet()){
					Parameter p=e.getValue();
					String type=p.getType();
					String info=p.getExtraInfo();
					if(type.startsWith("label+")){
						p.setType(type.substring(6));
					}
					if(info.contains("+")){
						int pos=info.indexOf("+")+1;
						if(info.length()!=pos)
							p.setExtraInfo(info.substring(pos));
						else
							p.setExtraInfo("");
					}
					c.put(p.getName(), p);
				}
				target.setParameters(c);
				mapper.writeValue(f, target);
			}
		}catch(Exception e){
			logger.error(e.getClass()+e.getMessage());
		}
	}
	
	
	public Json deletePreConfigItem(String testPath,String id){
		Json j = new Json();
		try {
			File f=new File(FileNameUtils.getPreConfigFilePath(testPath));
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			PreConfigContainer c = mapper.readValue(f, PreConfigContainer.class);
			c.getPreConfig().remove(id);
			mapper.writeValue(f, c);
			j.setSuccess(true);
		} catch (IOException e) {
			j.setMsg(e.getClass()+": "+e.getMessage());
			j.setSuccess(false);
		}
		return j;
	}
	
	public Json addQueryBoundDataItem(String testPath,String timestamp,QueryBoundDataItem item){	
		Json j = new Json();
		if(item.getReference().startsWith(" ") || item.getReference().endsWith(" "))
			item.setReference(item.getReference().trim());
		if(item.getRowIndex().startsWith(" ") || item.getRowIndex().endsWith(" "))
			item.setRowIndex(item.getRowIndex().trim());
		try {
			File f=new File(FileNameUtils.getQueryBoundConfigFilePath(testPath,timestamp));
			QueryBoundDataItemContainer qbdic=new QueryBoundDataItemContainer();
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			if(f.exists())
				qbdic= mapper.readValue(f, QueryBoundDataItemContainer.class);
			qbdic.getQueryBoundData().put(item.getId(), item);
			mapper.writeValue(f, qbdic);
			j.setSuccess(true);
		} catch (IOException e) {
			j.setMsg(e.getClass()+": "+e.getMessage());
			j.setSuccess(false);
		}
		return j;
	}
	
	public Json deleteQueryBoundDataItem(String testPath,String timestamp,String id){
		Json j = new Json();
		try {
			File f=new File(FileNameUtils.getQueryBoundConfigFilePath(testPath,timestamp));
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			QueryBoundDataItemContainer c = mapper.readValue(f, QueryBoundDataItemContainer.class);
			c.getQueryBoundData().remove(id);
			mapper.writeValue(f, c);
			j.setSuccess(true);
		} catch (IOException e) {
			j.setMsg(e.getClass()+": "+e.getMessage());
			j.setSuccess(false);
		}
		return j;
	}
	
	public DataGridJson getQueryBoundDataItems(String testPath,String timestamp){
		DataGridJson j = new DataGridJson();
		List<QueryBoundDataItem> row=new ArrayList<QueryBoundDataItem>();
		try {
			File f=new File(FileNameUtils.getQueryBoundConfigFilePath(testPath,timestamp));	
			if(f.exists()){
				ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
				QueryBoundDataItemContainer qbdic = mapper.readValue(f, QueryBoundDataItemContainer.class);
				for(Entry<String,QueryBoundDataItem> entry:qbdic.getQueryBoundData().entrySet()){
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
	
	public String getQueryBoundDataItemsString(String testPath,String timestamp){
		String str="";
		try {
			File f=new File(FileNameUtils.getQueryBoundConfigFilePath(testPath,timestamp));	
			if(f.exists()){
				ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
				QueryBoundDataItemContainer qbdic = mapper.readValue(f, QueryBoundDataItemContainer.class);
				for(Entry<String,QueryBoundDataItem> entry:qbdic.getQueryBoundData().entrySet()){
					QueryBoundDataItem item = entry.getValue();
					str+=item.getName()+SeperatorDefinition.queryBoundItem+item.getReference()
							+SeperatorDefinition.queryBoundItem+item.getRowIndex()+SeperatorDefinition.queryBoundRow;
				}
				str=str.substring(0, str.length()-SeperatorDefinition.queryBoundRow.length());
			}
		}catch (IOException e) {
			logger.error(e.getClass()+e.getMessage());
		}
		return str;
	}
	
	public Json addServiceBoundDataItem(String testPath,String timestamp,ServiceBoundDataItem item){	
		Json j = new Json();
		try {
			File f=new File(FileNameUtils.getServiceBoundConfigFilePath(testPath,timestamp));
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
	
	public Json deleteServiceBoundDataItem(String testPath,String timestamp,String id){
		Json j = new Json();
		try {
			File f=new File(FileNameUtils.getServiceBoundConfigFilePath(testPath,timestamp));
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

	public DataGridJson getServiceBoundDataItems(String testPath,String timestamp){
		DataGridJson j = new DataGridJson();
		List<ServiceBoundDataItem> row=new ArrayList<ServiceBoundDataItem>();
		try {
			File f=new File(FileNameUtils.getServiceBoundConfigFilePath(testPath,timestamp));	
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
	
	public String getServiceBoundDataItemsString(String testPath,String timestamp){
		String str="";
		try {
			File f=new File(FileNameUtils.getServiceBoundConfigFilePath(testPath,timestamp));	
			if(f.exists()){
				ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
				ServiceBoundDataItemContainer c = mapper.readValue(f, ServiceBoundDataItemContainer.class);
				for(Entry<String,ServiceBoundDataItem> entry:c.getServiceBoundData().entrySet()){
					ServiceBoundDataItem item = entry.getValue();
					str+=item.getName()+SeperatorDefinition.queryBoundItem+item.getLb()+SeperatorDefinition.queryBoundItem
						+item.getRb()+SeperatorDefinition.queryBoundItem+item.getTimes()+SeperatorDefinition.queryBoundRow;
				}
				str=str.substring(0, str.length()-SeperatorDefinition.queryBoundRow.length());
			}
		}catch (IOException e) {
			logger.error(e.getClass()+e.getMessage());
		}
		return str;
	}
	
	
	
}
