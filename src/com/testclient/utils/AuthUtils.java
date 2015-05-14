package com.testclient.utils;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

public class AuthUtils {
	private static final Logger logger = Logger.getLogger(AuthUtils.class);
	
	public static String getH5AuthField(String username){
		String key="";
		try{
			Runtime runtime = Runtime.getRuntime();
			Process p = runtime.exec("cmd /k AuthTool.exe gen "+username+" 3000");
			InputStream is = p.getInputStream();
			OutputStream os = p.getOutputStream();
			os.close();
			String result = IOUtils.toString(is,"gbk");
			key=StringUtils.substringBetween(result, "ticket: ", "\r\n");
		}catch(Exception e){
			key="请正确安装AuthTool.exe(联系系统管理员)";
		}
		return key;
	}
	
	public static void main(String args[]) throws Exception{
		BufferedReader br=new BufferedReader(new InputStreamReader(System.in));
		String input = br.readLine();
		System.out.println("Auth加密：" + getH5AuthField(input));
	}
}
