package com.testclient.service;

import java.io.File;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.testclient.enums.CheckPointResult;
import com.testclient.enums.HistoryFolderName;
import com.testclient.enums.SeperatorDefinition;
import com.testclient.enums.TestStatus;
import com.testclient.factory.JsonObjectMapperFactory;
import com.testclient.httpmodel.CheckPointItem;
import com.testclient.httpmodel.DataGridJson;
import com.testclient.httpmodel.TestCaseReportItem;
import com.testclient.httpmodel.TestPassedRateItem;
import com.testclient.httpmodel.TestResultItem;
import com.testclient.httpmodel.TestStatusDistributionItem;


@Service("chartService")
public class ChartService {
	@Autowired
	BatchTestService batchTestService;
	
	private static final Logger logger = Logger.getLogger(ChartService.class);
	
	private List<String> getTestHistoryPathsByDate(String dirPath,String date, boolean isCountReadyTest){
		List<String> hispaths = new ArrayList<String>();
		File dir=new File(dirPath);
		if(dir.exists()){
			List<String> infos=new ArrayList<String>();
			batchTestService.returnTestsInfoUnderSpecificDir(dirPath, infos);
			for(String info:infos){
				String path=info.split(SeperatorDefinition.seperator)[0];
				if(new File(path).exists()){
					String recentHistory=getRecentHistory(path+"/"+HistoryFolderName.folderName,date);
					if(recentHistory.isEmpty()){
						if(isCountReadyTest){
							hispaths.add(path+"/"+HistoryFolderName.folderName+"/@@r.json");
						}
					}else
						hispaths.add(path+"/"+HistoryFolderName.folderName+"/"+recentHistory);
				}
			}
		}
		return hispaths;
	}
	
	private String getRecentHistory(String historyDir,String date){
		File hdir=new File(historyDir);
		if(hdir.exists()){
			String[] list = hdir.list();
			if(list.length>0){
				List<String> l=new ArrayList<String>();
				for(String history : list){
					if(history.startsWith(date+" ")){
						l.add(history);
					}
				}
				if(l.size()>0){
					return Collections.max(l);
				}
			}
		}
		return "";
	}
	
	private String getTestName(String fullname){
		String name="";
		if(fullname.endsWith("-leaf")){
			name=fullname.substring(0, fullname.length()-5);
		}else if(fullname.endsWith("-t")){
			name=fullname.substring(0, fullname.length()-2);
		}
		return name;
	}
	
	public DataGridJson getGridStoreByDate(String dirPath,String date){
		DataGridJson j = new DataGridJson();
		List<TestCaseReportItem> row=new ArrayList<TestCaseReportItem>();
		try {
			List<String> paths=getTestHistoryPathsByDate(dirPath,date,true);
			int sumcases=0,sumpcase=0,sumfcase=0;
			DecimalFormat df = new DecimalFormat("#.00");
			for(String path : paths){
				TestCaseReportItem item=new TestCaseReportItem();
				int totalcase=0,passedcase=0,failedcase=0;
				String rate="0.00%";
				String result;
				String[] arr = path.split("/");
				String jfile=arr[arr.length-1];
				String test=arr[arr.length-3];
				test=getTestName(test);
				arr=jfile.split(SeperatorDefinition.seperator);
				result=arr[arr.length-1].replace(".json", "");
				if(TestStatus.ready.startsWith(result) || TestStatus.exception.startsWith(result)){
					item.setTotal("");
					item.setPassed("");
					item.setFailed("");
					item.setRate("");
				}else{
					if(TestStatus.pass.startsWith(result) || TestStatus.fail.startsWith(result)){
						ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
						TestResultItem tri = mapper.readValue(new File(path), TestResultItem.class);
						for(CheckPointItem checkpoint : tri.getCheckPoint()){
							totalcase++;
							
							if(checkpoint.getResult().equalsIgnoreCase(CheckPointResult.pass)){
								passedcase++;
							}
						}
						if(totalcase!=0){
							failedcase=totalcase-passedcase;
							rate=df.format((double)passedcase/totalcase*100.00)+"%";
						}
					}
					item.setTotal(totalcase+"");
					item.setPassed(passedcase+"");
					item.setFailed(failedcase+"");
					item.setRate(rate.indexOf(".")!=0 ? rate : "0"+rate);
					sumcases+=totalcase;
					sumpcase+=passedcase;
					sumfcase+=failedcase;
				}
				item.setTest(test);
				item.setResult(result);
				row.add(item);
			}
			TestCaseReportItem tcri=new TestCaseReportItem();
			tcri.setTest("数据汇总");
			tcri.setResult("");
			tcri.setRate(sumcases==0?"0.00%":df.format((double)sumpcase/sumcases*100.00)+"%");
			tcri.setTotal(sumcases+"");
			tcri.setPassed(sumpcase+"");
			tcri.setFailed(sumfcase+"");
			row.add(0,tcri);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error(e.getClass()+e.getMessage());
		}
		j.setRows(row);
		j.setTotal(row.size());
		return j;
	}
	
	public DataGridJson getTestStatusDistributionByDate(String dirPath,String date){
		DataGridJson j = new DataGridJson();
		List<TestStatusDistributionItem> row=new ArrayList<TestStatusDistributionItem>();
		List<String> hislist=getTestHistoryPathsByDate(dirPath,date,true);
		int passed=0,failed=0,invalid=0,ready=0,exception=0;
		String ptest="",ftest="",itest="",rtest="",etest="";
		for(String filepath : hislist){
			String[] arr = filepath.split("/");
			String jfile=arr[arr.length-1];
			String test=arr[arr.length-3];
			test=getTestName(test);
			arr=jfile.split(SeperatorDefinition.seperator);
			String result=arr[arr.length-1].replace(".json", "");
			if(TestStatus.fail.startsWith(result)){
				failed++;
				ftest+=test+SeperatorDefinition.seperator;
			}else if(TestStatus.pass.startsWith(result)){
				passed++;
				ptest+=test+SeperatorDefinition.seperator;
			}else if(TestStatus.ready.startsWith(result)){
				ready++;
				rtest+=test+SeperatorDefinition.seperator;
			}else if(TestStatus.invalid.startsWith(result)){
				invalid++;
				itest+=test+SeperatorDefinition.seperator;
			}else if(TestStatus.exception.startsWith(result)){
				exception++;
				etest+=test+SeperatorDefinition.seperator;
			}
		}
		TestStatusDistributionItem item=new TestStatusDistributionItem();
		item=new TestStatusDistributionItem();
		item.setStatus(TestStatus.pass);
		item.setNumber(passed+"");
		item.setTest(ptest.isEmpty()?"":ptest.substring(0, ptest.length()-1));
		row.add(item);
		item=new TestStatusDistributionItem();
		item.setStatus("no run");
		item.setNumber(ready+"");
		item.setTest(rtest.isEmpty()?"":rtest.substring(0, rtest.length()-1));
		row.add(item);
		item=new TestStatusDistributionItem();
		item.setStatus(TestStatus.fail);
		item.setNumber(failed+"");
		item.setTest(ftest.isEmpty()?"":ftest.substring(0, ftest.length()-1));
		row.add(item);
		item=new TestStatusDistributionItem();
		item.setStatus(TestStatus.exception);
		item.setNumber(exception+"");
		item.setTest(etest.isEmpty()?"":etest.substring(0, etest.length()-1));
		row.add(item);
		item=new TestStatusDistributionItem();
		item.setStatus(TestStatus.invalid);
		item.setNumber(invalid+"");
		item.setTest(itest.isEmpty()?"":itest.substring(0, itest.length()-1));
		row.add(item);
		
		j.setRows(row);
		j.setTotal(row.size());
		return j;
	}
	
	public DataGridJson getTestPassedRateInAWeek(String dirPath){
		DataGridJson j = new DataGridJson();
		List<TestPassedRateItem> row=new ArrayList<TestPassedRateItem>();
		for(int i=6;i>=0;i--){
			TestPassedRateItem item =new TestPassedRateItem();
			Calendar cal = Calendar.getInstance();
			cal.add(Calendar.DATE, -i);
			String date=new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
			item.setDate(date);
			List<String> hislist=getTestHistoryPathsByDate(dirPath,date,false);
			int total=hislist.size();int passed=0;
			for(String filepath : hislist){
				String[] arr = filepath.split("/");
				String jfile=arr[arr.length-1];
				arr=jfile.split(SeperatorDefinition.seperator);
				String result=arr[arr.length-1].replace(".json", "");
				if(TestStatus.pass.startsWith(result)){
					passed++;
				}
			}
			double t=total;
			if(total!=0){
				DecimalFormat df = new DecimalFormat("#.00");
				String str=df.format(passed/t*100.00);
				item.setRate(Double.valueOf(str).doubleValue());
			}else
				item.setRate(0.00);
			row.add(item);
		}
		j.setRows(row);
		j.setTotal(row.size());
		return j;
	}
	
}