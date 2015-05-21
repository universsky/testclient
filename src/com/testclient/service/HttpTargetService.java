package ccom.testclient.service;

import java.io.File;
import java.io.IOException;
import java.io.StringWriter;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.UUID;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import ccom.testclient.enums.CheckPointType;
import ccom.testclient.enums.SeperatorDefinition;
import ccom.testclient.factory.JsonObjectMapperFactory;
import ccom.testclient.httpmodel.CheckPointItem;
import ccom.testclient.httpmodel.DataGridJson;
import ccom.testclient.httpmodel.Json;
import ccom.testclient.httpmodel.TestConfigItem;
import ccom.testclient.model.CheckPointContianer;
import ccom.testclient.model.HttpTarget;
import ccom.testclient.model.KeyValue;
import ccom.testclient.model.Parameter;
import ccom.testclient.model.SocketTarget;
import ccom.testclient.utils.FileNameUtils;
import ccom.testclient.utils.MyFileUtils;

@Service("httpTargetService")
public class HttpTargetService {
	private static final Logger logger = Logger.getLogger(HttpTargetService.class);
	
	public Json addOrModifyHttpTarget(TestConfigItem item){
		Json j=new Json();
		HttpTarget httptarget=new HttpTarget();
		MyFileUtils.makeDir(item.getFolderName());
		try {
			httptarget.setPath(item.getPath());
			
			String[] headerarray=item.getHeaders().replace("\r", "").split("\n");
			Set<KeyValue> headset=new HashSet<KeyValue>();
			for(String one:headerarray){
				
				if(one!=null && !one.trim().equals("")){
				
					String[] kva=one.split("=");
					KeyValue kv=new KeyValue();
					if(kva.length==2){
						kv.setKey(kva[0]);
						kv.setValue(kva[1]);
					}else if(kva.length==1){
						kv.setKey(kva[0]);
					}else if(kva.length>2){
						kv.setKey(kva[0]);
						kv.setValue(StringUtils.substringAfter(one, kva[0]+"="));
					}
					headset.add(kv);
				}
			}
			
			httptarget.setHeads(headset);
			
			Map<String,Parameter> pm=new HashMap<String,Parameter>();
			
			String[] parameterarray=item.getParameters().replace("\r", "").replace("\n", "").split(";");
			for(String paras:parameterarray){
				
				if(paras!=null && !paras.trim().equals("")){
					ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
					Parameter p = mapper.readValue(paras, Parameter.class);
					pm.put(p.getName(), p);
				}
			}
			httptarget.setParameters(pm);
			httptarget.setRequestBody(item.getBody());
			String method=item.getMethod();
			if(null!=method && !method.isEmpty() && !method.equals("default")){
				httptarget.setMethod(item.getMethod());
			}
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			mapper.writeValue(new File(FileNameUtils.getHttpTarget(item.getFolderName())), httptarget);
			j.setSuccess(true);
		} catch (JsonGenerationException e) {
			logger.error("httptarget新建失败(json文件生成失败)", e);
			j.setSuccess(false);
			j.setMsg("httptarget新建失败(json文件生成失败)");
		} catch (JsonMappingException e) {
			logger.error("httptarget新建失败(json文件生成失败)", e);
			j.setSuccess(false);
			j.setMsg("httptarget新建失败(json文件生成失败)");
		} catch (IOException e) {
			logger.error("httptarget新建失败(json文件生成失败)", e);
			j.setSuccess(false);
			j.setMsg("httptarget新建失败(json文件生成失败)");
		}
		return j;
	}
	
	public void updateParameterExtraInfo(String path, String fieldName, String info){
		try {
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			Map<String, Parameter> paras = new HashMap<String, Parameter>();
			if(path.endsWith("-leaf")){
				String httptargetjson=FileNameUtils.getHttpTarget(path);
				HttpTarget target = mapper.readValue(new File(httptargetjson), HttpTarget.class);
				paras = target.getParameters();
				for(Parameter p : paras.values()){
					if(p.getName().equalsIgnoreCase(fieldName)){
						p.setExtraInfo(info);
						paras.put(p.getName(), p);
						break;
					}
				}
				target.setParameters(paras);
				mapper.writeValue(new File(httptargetjson), target);
			}else if(path.endsWith("-t")){
				String socketjson=FileNameUtils.getSocketTestAbsPath(path);
				SocketTarget target = mapper.readValue(new File(socketjson), SocketTarget.class);
				paras = target.getParameters();
				for(Parameter p : paras.values()){
					if(p.getName().equalsIgnoreCase(fieldName)){
						p.setExtraInfo(info);
						paras.put(p.getName(), p);
						break;
					}
				}
				target.setParameters(paras);
				mapper.writeValue(new File(socketjson), target);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
	}
	
	public Json getHttpTarget(String foldername){
		Json j=new Json();
		ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
		
		File f=new File(FileNameUtils.getHttpTarget(foldername));
		if(!f.exists()){
			j.setSuccess(false);
			return j;
		}
		try {
			HttpTarget target = mapper.readValue(f, HttpTarget.class);
			j.setSuccess(true);
			TestConfigItem item=new TestConfigItem();
			//item.setFolderName(target.getFolderName());
			item.setFolderName(foldername);
			item.setBody(target.getRequestBody());
			item.setPath(target.getPath());
			
			Set<KeyValue> headset = target.getHeads();
			String kvs="";
			for(KeyValue kv:headset){
				if(kv.getValue()==null || kv.getValue().equals("")){
					kvs+=kv.getKey()+"\n";
				}else{
					kvs+=kv.getKey()+"="+kv.getValue()+"\n";
				}
			}
			
			item.setHeaders(kvs);
			
			Map<String,Parameter> pm=target.getParameters();
			String paras="";
			
			
			for(Entry<String, Parameter> e:pm.entrySet()){
				StringWriter sw=new StringWriter();
				mapper.writeValue(sw, e.getValue());
				paras+=sw.toString()+";\n";
				
			}
			
			item.setParameters(paras);
			
			item.setMethod(target.getMethod());
			
			j.setObj(item);
		} catch (Exception e) {
			logger.error("httptarget详情读取失败", e);
			j.setSuccess(false);
			j.setMsg("httptarget详情读取失败");
		}
		return j;
	}
	
	public DataGridJson getCheckPoints(String foldname) throws Exception{
		DataGridJson j = new DataGridJson();
		List<CheckPointItem> row=new ArrayList<CheckPointItem>();
		File f=new File(FileNameUtils.getCheckPointsFilePath(foldname));
		if(f.exists()){
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			CheckPointContianer checkpointc = mapper.readValue(f, CheckPointContianer.class);
			for(Entry<String,CheckPointItem> entry:checkpointc.getCheckPoint().entrySet()){
				row.add(entry.getValue());
			}
		}
		j.setRows(row);
		j.setTotal(row.size());
		return j;
	}
	
	public Json deleteCheckPoint(String foldname,String id) throws Exception{
		Json j = new Json();
		File f=new File(FileNameUtils.getCheckPointsFilePath(foldname));
		ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
		CheckPointContianer checkpointc = mapper.readValue(f, CheckPointContianer.class);
		checkpointc.getCheckPoint().remove(id);
		mapper.writeValue(f, checkpointc);
		j.setSuccess(true);
		return j;
	}
	
	public Json addCheckPoint(String foldname,CheckPointItem item) throws Exception{
		ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
		Json j = new Json();
		File f=new File(FileNameUtils.getCheckPointsFilePath(foldname));
		CheckPointContianer c=new CheckPointContianer();
		if(f.exists()){
			c= mapper.readValue(f, CheckPointContianer.class);
		}
		c.getCheckPoint().put(item.getId(), item);
		mapper.writeValue(f, c);
		j.setSuccess(true);
		return j;
	}
	
	public void generateCheckpointsByArray(String testPath,Object[] checkInfos) throws Exception{
		ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
		File f=new File(FileNameUtils.getCheckPointsFilePath(testPath));
		CheckPointContianer c=new CheckPointContianer();
		if(f.exists()){
			c= mapper.readValue(f, CheckPointContianer.class);
		}
		for(Object info : checkInfos){
			CheckPointItem item =new CheckPointItem();
			
			item.setType(CheckPointType.CheckContain);
			String checkinfo=info.toString();
			String str="节点";
			if(info instanceof String){
				if(!checkinfo.startsWith("<") || !checkinfo.endsWith(">")){
					str="字段";
				}
			}
			item.setName("验证"+str+"："+info.toString());
			item.setCheckInfo(checkinfo);
			item.setId(UUID.randomUUID().toString());
			c.getCheckPoint().put(item.getId(), item);
		}
		mapper.writeValue(f, c);
	}
}
