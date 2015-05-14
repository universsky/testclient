package com.testclient.utils;

import java.io.File;
import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

import com.testclient.template.StringTemplateLoader;

import freemarker.template.Configuration;
import freemarker.template.Template;



public class TemplateUtils {
	private static Configuration cfg = new Configuration();
	public static synchronized String getString(String templatestr,Map map) throws Exception{
		if( templatestr==null || templatestr.equals("") ){
			return "";
		}
		if(-1==templatestr.indexOf("${"))
			return templatestr;
		
		Template template;
		int spos=templatestr.indexOf("${auto");
		while(spos!=-1){
			spos=spos+"${auto".length();
			int endpos1=templatestr.indexOf("${", spos);
			int endpos2=templatestr.indexOf(")}", spos);
			while(endpos1!=-1 && endpos1<endpos2){
				int endpos=templatestr.indexOf("}", endpos1+2);
				String parameter=templatestr.substring(endpos1+2, endpos);
				String value=map.get(parameter).toString();
				templatestr=templatestr.replace("${"+parameter+"}", value);
				endpos1=templatestr.indexOf("${", spos);
				endpos2=templatestr.indexOf(")", spos);
			}
			spos=templatestr.indexOf("${auto", spos);
		}
		cfg.setTemplateLoader(new StringTemplateLoader(templatestr));
//		cfg.setDefaultEncoding("UTF-8");
		template = cfg.getTemplate("");
		StringWriter writer = new StringWriter();
		template.process(map, writer);
		return writer.toString(); 
	}
	
	public static void main(String args[]) throws Exception{
		Map m=new HashMap();
		m.put("key1", "asf");
		m.put("auto", new Auto());
		System.out.println(getString("${key1}",m));
	}
}
