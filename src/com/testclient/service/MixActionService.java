package com.testclient.service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Service;

import com.testclient.factory.JsonObjectMapperFactory;
import com.testclient.httpmodel.DataGridJson;
import com.testclient.httpmodel.Json;
import com.testclient.httpmodel.MixActionSettingContainer;
import com.testclient.httpmodel.MixActionSettingInfo;

@Service("mixActionService")
public class MixActionService {
	private static final Logger logger = Logger.getLogger(MixActionService.class);
	
	public Json addMixActionSetting(String path,String filename,MixActionSettingInfo item){
		item.setId(String.valueOf(System.currentTimeMillis()));
		Json j=new Json();
		File f=new File(path+"/"+filename);
		MixActionSettingContainer c=new MixActionSettingContainer();
		ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
		try{
			if(f.exists()){
				c= mapper.readValue(f, MixActionSettingContainer.class);
			}
			c.getMixActionSettings().put(item.getId(), item);
			mapper.writeValue(f, c);
			j.setSuccess(true);
		}catch(Exception e){
			j.setSuccess(false);
		}
		return j;
	}
	
	public DataGridJson getMixActionSettings(String path,String filename) throws Exception{
		DataGridJson j = new DataGridJson();
		List<MixActionSettingInfo> row=new ArrayList<MixActionSettingInfo>();
		File f=new File(path+"/"+filename);
		if(f.exists()){
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			MixActionSettingContainer c = mapper.readValue(f, MixActionSettingContainer.class);
			for(Entry<String,MixActionSettingInfo> entry:c.getMixActionSettings().entrySet()){
				row.add(entry.getValue());
			}
		}
		j.setRows(row);
		j.setTotal(row.size());
		return j;
	}
	
	public Json deleteMixActionSetting(String path,String filename,String id){
		Json j = new Json();
		File f=new File(path+"/"+filename);
		MixActionSettingContainer c=new MixActionSettingContainer();
		ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
		try{
			if(f.exists()){
				c= mapper.readValue(f, MixActionSettingContainer.class);
				c.getMixActionSettings().remove(id);
				mapper.writeValue(f, c);
			}
			j.setSuccess(true);
		}catch(Exception e){
			j.setSuccess(false);
		}
		return j;
	}
	
}
