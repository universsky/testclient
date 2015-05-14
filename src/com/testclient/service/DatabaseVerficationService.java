package com.testclient.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Service;

import com.testclient.enums.SeperatorDefinition;
import com.testclient.factory.JsonObjectMapperFactory;
import com.testclient.httpmodel.DataGridJson;
import com.testclient.httpmodel.Json;
import com.testclient.httpmodel.SqlVerificationDataItem;
import com.testclient.model.SqlVerificationDataItemContainer;
import com.testclient.utils.FileNameUtils;


@Service("databaseVerficationService")
public class DatabaseVerficationService {
	private static final Logger logger = Logger.getLogger(DatabaseVerficationService.class);
	
	public Json addSqlVerificationDataItem(String testPath,String timestamp,SqlVerificationDataItem item){
		Json j = new Json();
		if(item.getColumn().startsWith(" ") || item.getColumn().endsWith(" "))
			item.setColumn(item.getColumn().trim());
		if(item.getRowIndex().startsWith(" ") || item.getRowIndex().endsWith(" "))
			item.setRowIndex(item.getRowIndex().trim());
		if(item.getExpectedValue().startsWith(" ") || item.getExpectedValue().endsWith(" "))
			item.setExpectedValue(item.getExpectedValue().trim());
		try {
			File f=new File(FileNameUtils.getDBVerificationConfigFilePath(testPath,timestamp));
			SqlVerificationDataItemContainer c=new SqlVerificationDataItemContainer();
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			if(f.exists())
				c= mapper.readValue(f, SqlVerificationDataItemContainer.class);
			c.getDbVerificationData().put(item.getId(), item);
			mapper.writeValue(f, c);
			j.setSuccess(true);
		} catch (IOException e) {
			j.setMsg(e.getClass()+": "+e.getMessage());
			j.setSuccess(false);
		}
		return j;
	}
	
	public Json deleteSqlVerificationDataItem(String testPath,String timestamp,String id){
		Json j = new Json();
		try {
			File f=new File(FileNameUtils.getDBVerificationConfigFilePath(testPath,timestamp));
			ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			SqlVerificationDataItemContainer c = mapper.readValue(f, SqlVerificationDataItemContainer.class);
			c.getDbVerificationData().remove(id);
			mapper.writeValue(f, c);
			j.setSuccess(true);
		} catch (IOException e) {
			j.setMsg(e.getClass()+": "+e.getMessage());
			j.setSuccess(false);
		}
		return j;
	}
	
	public DataGridJson getSqlVerificationDataItems(String testPath,String timestamp){
		DataGridJson j = new DataGridJson();
		List<SqlVerificationDataItem> row=new ArrayList<SqlVerificationDataItem>();
		try {
			File f=new File(FileNameUtils.getDBVerificationConfigFilePath(testPath,timestamp));	
			if(f.exists()){
				ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
				SqlVerificationDataItemContainer c = mapper.readValue(f, SqlVerificationDataItemContainer.class);
				for(Entry<String,SqlVerificationDataItem> entry:c.getDbVerificationData().entrySet()){
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
	
	public String getSqlVerificationDataItemsString(String testPath,String timestamp){
		String str="";
		try {
			File f=new File(FileNameUtils.getDBVerificationConfigFilePath(testPath,timestamp));	
			if(f.exists()){
				ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
				SqlVerificationDataItemContainer c = mapper.readValue(f, SqlVerificationDataItemContainer.class);
				for(Entry<String,SqlVerificationDataItem> entry:c.getDbVerificationData().entrySet()){
					SqlVerificationDataItem item = entry.getValue();
					str+=item.getColumn()+SeperatorDefinition.verifiedDataItem+item.getRowIndex()
							+SeperatorDefinition.verifiedDataItem+item.getComparedType()
							+SeperatorDefinition.verifiedDataItem+item.getExpectedValue()
							+SeperatorDefinition.verifiedDataRow;
				}
				str=str.substring(0, str.length()-SeperatorDefinition.verifiedDataRow.length());
			}
		}catch (IOException e) {
			logger.error(e.getClass()+e.getMessage());
		}
		return str;
	}
	
}
