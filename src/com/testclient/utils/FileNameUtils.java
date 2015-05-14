package com.testclient.utils;

import com.testclient.enums.SeperatorDefinition;

public class FileNameUtils {
	public static String getHttpTarget(String foldername){
		return foldername+"/"+"HttpTarget.json";
	}
	public static String getSocketTestAbsPath(String foldername){
		return foldername+"/"+"SocketTarget.json";
	}
	public static String getEnvFilePath(String foldername){
		return foldername+"/"+"TestEvn";
		
	}
	public static String getCheckPointsFilePath(String foldername){
		return foldername+"/"+"checkPoint";
	}
	public static String getResultFile(String starttime, String duration, String res){
		duration=duration!=null?duration:"";
		return starttime+SeperatorDefinition.seperator+duration+SeperatorDefinition.seperator+res.substring(0, 1)+".json";
	}
	public static String getTestRunFile(String name, String starttime, String duration, String status){
		duration=duration!=null?duration:"";
		return name+SeperatorDefinition.seperator+starttime+SeperatorDefinition.seperator+duration+SeperatorDefinition.seperator+status.substring(0, 1);
	}
	public static String getScheduledJobFile(){
		return "scheduler.json";
	}
	public static String getPreConfigFilePath(String path){
		return path+"/"+"preDataConfig";
	}
	public static String getQueryBoundConfigFilePath(String path,String timestamp){
		return path+"/"+".sqlquerybounddata"+timestamp;
	}
	public static String getServiceBoundConfigFilePath(String path,String timestamp){
		return path+"/"+".servicebounddata"+timestamp;
	}
	public static String getDBVerificationConfigFilePath(String path,String timestamp){
		return path+"/"+".dbverificationbounddata"+timestamp;
	}
	public static String getOutputFilePath(String path){
		return path+"/"+"outpara";
	}
//	public static String getHttpPost(HttpTarget target){
//		SimpleDateFormat format=new  SimpleDateFormat("yyyy-MM-dd-HH-mm-ss-ms");
//		format.format(new Date());
//		return target.getHttpTargetPath() + "/"+target.getHttpTargetName()+"/" + format.format(new Date())+"HttpPost.json";
//	}
//	public static String getHttpResponse(HttpTarget target){
//		SimpleDateFormat format=new  SimpleDateFormat("yyyy-MM-dd-HH-mm-ss-ms");
//		format.format(new Date());
//		return target.getHttpTargetPath() + "/"+target.getHttpTargetName()+"/" + format.format(new Date())+"HttpResponse.json";
//	}
}	
