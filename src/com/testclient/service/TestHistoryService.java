package com.testclient.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;

import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Service;

import com.testclient.enums.HistoryFolderName;
import com.testclient.enums.SeperatorDefinition;
import com.testclient.factory.JsonObjectMapperFactory;
import com.testclient.httpmodel.CheckPointItem;
import com.testclient.httpmodel.DataGridJson;
import com.testclient.httpmodel.Json;
import com.testclient.httpmodel.TestHistoryItem;
import com.testclient.httpmodel.TestResultItem;
import com.testclient.model.CheckPointContianer;
import com.testclient.utils.FileNameUtils;



@Service("testHistoryService")
public class TestHistoryService {
	private static final Logger logger = Logger.getLogger(TestHistoryService.class);
	
	public DataGridJson getHistories(String foldername){
		DataGridJson j = new DataGridJson();
		List<TestHistoryItem> row=new ArrayList<TestHistoryItem>();
		File dir=new File(foldername+"/"+HistoryFolderName.folderName);
		
		if(dir.exists()){
	        String files[] = dir.list();
	        for(String file : files){
	        	TestHistoryItem thi=new TestHistoryItem();
	        	String seperator=SeperatorDefinition.seperator;
	        	int len=file.split(seperator).length;
	        	if(len>0){
	        		String time=file.split(seperator)[0];
		        	if(len==3){
		        		String duration=file.split(seperator)[1];
		                String result=file.split(seperator)[2].replaceAll(".json", "");
		                thi.setDuration(duration);
		                thi.setResult(result);
		        	}
		        	else if(len==2){
		        		String str=file.split(seperator)[1];
		                if(!Character.isDigit(str.charAt(0))){
		                	String result=str.replaceAll(".json", "");
		                	thi.setResult(result);
		                }
		                else{
		                	thi.setDuration(str);
		                }
		        	}
		        	thi.setTime(time);
	        	}
	        	row.add(thi);
	        }
		}
		j.setRows(row);
		j.setTotal(row.size());
		return j;
	}
	
	/**
	 * @param time
	 * @return
	 */
	public Json getDetailHistoryByTime(String foldername,String time){
		Json j =new Json();
		try{
			TestResultItem tri=new TestResultItem();
			File dir = new File(foldername+"/"+HistoryFolderName.folderName);
			if(dir.exists()){
		        String files[] = dir.list();
		        for (String file : files) {
		        	if(file.startsWith(time)){
		        		File f=new File(dir,file);
		        		ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
		        		tri = mapper.readValue(f, TestResultItem.class);
		        		break;
		        	}
	            }
			}
			j.setObj(tri);
			j.setSuccess(true);
		} catch (IOException e) {
			j.setSuccess(false);
			logger.error("获取历史文件失败", e);
		}
		return j;
	}
	
	public Json deleteHistory(String foldername, String time){
		Json j =new Json();
		try{
			File dir = new File(foldername+"/"+HistoryFolderName.folderName);
			if(dir.exists()){
		        String files[] = dir.list();
		        for (String file : files) {
		        	if(file.startsWith(time)){
		        		File f=new File(dir,file);
		        		if(f.isFile() && f.exists()){     
		                    f.delete();
		                    j.setSuccess(true);
		                    break;
		        		}	
		        	}
	            }
			}
		} catch (Exception e) {
			j.setSuccess(false);
			logger.error("删除历史文件失败", e);
		}
		return j;
	}
}
