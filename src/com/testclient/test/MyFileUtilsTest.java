package com.testclient.test;

import java.io.*;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import org.junit.Test;

import com.testclient.utils.MyFileUtils;

import junit.framework.TestCase;

public class MyFileUtilsTest extends TestCase {
	
	@Test
	public void copyArtifactTest()
	{
		String oldf="root/商户测试-dir/test-dir/1-leaf";
		String newf="root/商户测试-dir";
		try
		{
			MyFileUtils.copyArtifact(oldf, newf);
		}
		catch(IOException ioe)
		{
			
		}
	}
	
	
	@Test
	public void test()
	{
		String filestr = "[solo_123_p, so_2_f, king_3_e]";
		String tname="king_";
		int begin=filestr.indexOf(tname);
		String file=filestr.substring(begin);
		int end=file.indexOf(',');
		if(end!=-1)
			file=file.substring(0,end);
		else
			file=file.substring(0,file.length()-1);
		System.out.println(file);
		
	}
	
}