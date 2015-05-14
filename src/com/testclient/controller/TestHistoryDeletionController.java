package com.testclient.controller;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testclient.enums.BatchTestingFolderName;
import com.testclient.enums.HistoryFolderName;
import com.testclient.httpmodel.DataGridJson;
import com.testclient.service.TreeNodeService;


@Controller
public class TestHistoryDeletionController {
	private static final Logger logger = Logger.getLogger(TestHistoryDeletionController.class);
	@Autowired
	TreeNodeService treeNodeService;
	
	@RequestMapping(value="/deleteHistoryFiles")
	@ResponseBody
	public void deleteHistoryFilesByDate(@RequestParam String rootName,@RequestParam String expiredDate) throws Exception {
		List<String> nodes=treeNodeService.getNodes(rootName,"/");
		for(String node : nodes){
			if(node.toLowerCase().endsWith("-dir")){
				deleteBatchTestHistoryFilesByPath(node+"/"+BatchTestingFolderName.folderName,expiredDate);
			}else if(node.toLowerCase().endsWith("-leaf") || node.toLowerCase().endsWith("-t")){
				deleteSingleTestHistoryFilesByPath(node+"/"+HistoryFolderName.folderName,expiredDate);
			}
		}
	}
	
	private void deleteSingleTestHistoryFilesByPath(String path,String date){
		try{
			File f = new File(path);
			if(f.exists()){
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.CHINA);
		        String files[] = f.list();
		        for (String file : files) {
		        	String datestr=file.substring(0, 10);
		        	Date actual = sdf.parse(datestr);
		        	Date expected = sdf.parse(date);
		        	if(actual.before(expected)){
		        		f=new File(path,file);
		        		if(f.isFile() && f.exists()){     
		                    f.delete();
		        		}	
		        	}
	            }
			}
		} catch (Exception e) {
			logger.error("删除历史文件失败", e);
		}
	}
	
	private void deleteBatchTestHistoryFilesByPath(String path,String date){
		try{
			File dir = new File(path);
			date=date.replaceAll("-", "");
			if(dir.exists()){
				String folders[] = dir.list();
				if(folders.length!=0){
					SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd", Locale.CHINA);
			        for (String folder : folders) {
			        	String datestr=folder.substring(0, 8);
			        	Date actual = sdf.parse(datestr);
			        	Date expected = sdf.parse(date);
			        	if(actual.before(expected)){
			        		dir=new File(path,folder);
			        		for(String file : dir.list()){
			        			File f=new File(dir,file);
			        			f.delete();
			        		}
			        		dir.delete();	
			        	}
		            }
				}
			}
		} catch (Exception e) {
			logger.error("删除批量历史文件失败", e);
		}
	}
}
