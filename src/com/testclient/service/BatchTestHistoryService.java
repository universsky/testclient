package com.testclient.service;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Service;

import com.testclient.enums.BatchTestingFolderName;
import com.testclient.enums.SeperatorDefinition;
import com.testclient.enums.TimeFormatDefiniation;
import com.testclient.factory.JsonObjectMapperFactory;
import com.testclient.httpmodel.BatchRunItem;
import com.testclient.httpmodel.BatchTestItem;
import com.testclient.httpmodel.DataGridJson;
import com.testclient.httpmodel.Json;
import com.testclient.httpmodel.TestResultItem;


@Service("batchTestHistoryService")
public class BatchTestHistoryService {
	private static final Logger logger = Logger.getLogger(TestHistoryService.class);
	
	public DataGridJson getBatchHistories(String dirpath){
		DataGridJson dgj=new DataGridJson();
		List<BatchRunItem> row=new ArrayList<BatchRunItem>();
		File dir=new File(dirpath+"/"+BatchTestingFolderName.folderName);
		if(dir.exists()){
			SimpleDateFormat formatDateFrom = new SimpleDateFormat(TimeFormatDefiniation.timeFolderFormat);
			SimpleDateFormat formatDateTo = new SimpleDateFormat(TimeFormatDefiniation.format.replace(" SSS", ""));
			for(String timedir : dir.list()){
				BatchRunItem bri = new BatchRunItem();
				String time="";
				try {
					time = formatDateTo.format(formatDateFrom.parse(timedir));
				} catch (ParseException e) {
					logger.error(e.getMessage());
				}
				bri.setPath(dirpath+"/BatchTesting/"+timedir);
				bri.setTime(time);
				row.add(bri);
			}
		}
		dgj.setRows(row);
		dgj.setTotal(row.size());
		return dgj;
	}
	
	public Json deleteBatchHistory(String batchrunpath){
		Json j =new Json();
		try{			
			File dir = new File(batchrunpath);
			if(dir.exists()){
		        String files[] = dir.list();
		        for (String testinfo : files) {
		        	File f=new File(dir,testinfo);
		        	if(f.exists() && f.isFile()){
		        		String content = FileUtils.readFileToString(f);
						String historypath=content.split(SeperatorDefinition.testInfoSeperator)[0];
						String historyfile=content.split(SeperatorDefinition.testInfoSeperator)[1];
						File historyf=new File(historypath);
						historyf=new File(historyf,historyfile);
		        		if(historyf.isFile() && historyf.exists()){     
		        			historyf.delete();
		        		}
		        		f.delete();
		        	}
	            }
		        dir.delete();
		        if(!j.isSuccess())
                	j.setSuccess(true);
			}
		} catch (Exception e) {
			j.setSuccess(false);
			logger.error("删除TestResultItem失败", e);
		}
		return j;
	}
	
	public DataGridJson getTestRunInfo(String dirpath){
		DataGridJson dgj=new DataGridJson();
		List<BatchTestItem> row=new ArrayList<BatchTestItem>();
		File dir = new File(dirpath);
		if(dir.exists()){
			String seperator=SeperatorDefinition.seperator;
			for (String runinfo : dir.list()){
				BatchTestItem bti=new BatchTestItem();
				bti.setPath(dirpath+"/"+runinfo);
	            bti.setName(runinfo.split(seperator)[0]);
	            bti.setTime(runinfo.split(seperator)[1]);
	            bti.setDuration(runinfo.split(seperator)[2]);
	            bti.setStatus(runinfo.split(seperator)[3]);
	            row.add(bti);
			}
		}
		dgj.setRows(row);
		dgj.setTotal(row.size());
		return dgj;
	}
	
	public Json getTestResultDetailInfo(String testitempath){
		Json j =new Json();
		try{
			TestResultItem tri=new TestResultItem();
			File f=new File(testitempath);
			if(f.exists() && f.isFile()){
				String content = FileUtils.readFileToString(f);
				String historypath=content.split(SeperatorDefinition.testInfoSeperator)[0];
				String historyfile=content.split(SeperatorDefinition.testInfoSeperator)[1];
				String testPath=historypath.substring(0, historypath.length()-8);
				if(new File(testPath).exists()){
					f=new File(historypath);
					if(f.exists()){
						f=new File(f,historyfile);
						if(f.exists() && f.isFile()){
							ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
			        		tri = mapper.readValue(f, TestResultItem.class);
			        		j.setObj(tri);
			        		j.setSuccess(true);
						}else{
							j.setMsg("文件"+content.replace(SeperatorDefinition.testInfoSeperator, "/")+"不存在或被删除");
							j.setSuccess(false);
						}
					}else{
						j.setMsg("文件夹"+historypath+"不存在或被删除");
						j.setSuccess(false);
					}
				}else{
					j.setMsg("测试"+testPath+"不存在或被删除");
					j.setSuccess(false);
				}
			}
		} catch (IOException e) {
			j.setSuccess(false);
			logger.error("获取TestResultItem失败", e);
		}
		return j;		
	}
	
}
