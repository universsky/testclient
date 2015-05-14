package com.testclient.utils;

import java.io.*;

import org.apache.commons.io.FileUtils;

import com.testclient.enums.BatchTestingFolderName;
import com.testclient.enums.HistoryFolderName;



/**
 * @author liang.chen
 *
 */
public class MyFileUtils {
	public static void makeDir(String path){
		File file=new File(path);
		if(!file.exists()){
			file.mkdirs();
		}
	}
	
	public static void copyArtifact(String oldPath, String newPath) throws IOException{
		if(!oldPath.equalsIgnoreCase(newPath) && !newPath.endsWith("-leaf") && !newPath.endsWith("-t")){
			File src=new File(oldPath);
			File dest=new File(newPath);
			copyFolder(src,dest,"");
		}
	}
	
	public static void copyTestWithoutHistory(String oldPath, String newPath) throws IOException{
		if(!oldPath.equalsIgnoreCase(newPath) && !newPath.endsWith("-leaf") && !newPath.endsWith("-t")){
			File src=new File(oldPath);
			File dest=new File(newPath);
			copyFolderWithoutHistory(src,dest,"");
		}
	}

	public static void deleteDirectory(String path) {  
		//如果path不以文件分隔符结尾，自动添加文件分隔符  
//		if (!path.endsWith(File.separator)) {  
//			path = path + File.separator;  
//		}  
		File dirFile = new File(path);  
		if (!dirFile.exists() && !dirFile.isDirectory()) {  
			return;
		}  
		//删除文件夹下的所有文件(包括子目录)  
		String[] files = dirFile.list();  
		for (String filename : files) {  
			//删除子文件  
			File f=new File(dirFile,filename);
			if (f.exists() && f.isFile()) { 
				f.delete();  
			} //删除子目录  
			else {  
				deleteDirectory(path+"/"+filename);  
			}
		}
		//删除当前目录  
		dirFile.delete();
	}  
	
	public static boolean renameDirectory(File fromDir, File toDir) {
		if (fromDir.exists() && fromDir.isDirectory()) {
			if (fromDir.renameTo(toDir))
				return true;
			else
				return false;
		}else
			return false;
	}
	
	private static void copyFolder(File src, File dest, String index) throws IOException {
	    if (src.isDirectory()) {
	    	String srcfilename =src.getName();
	    	if(new File(dest,srcfilename).exists()){
	    		srcfilename = renameBeforeCreate(srcfilename,index);
			}
	    	File newdir = new File(dest,srcfilename);
	    	newdir.mkdirs();
	        String files[] = src.list();
	        for (String file : files) {
	            File srcfile = new File(src, file); 
	            // 递归复制  
	            copyFolder(srcfile, newdir,index);
	        }
	    } else {
	    	FileUtils.copyFileToDirectory(src, dest);
	    }
	}
	
	private static void copyFolderWithoutHistory(File src, File dest, String index) throws IOException {
	    if (src.isDirectory()) {
	    	String srcfilename =src.getName();
	    	if(new File(dest,srcfilename).exists()){
	    		srcfilename = renameBeforeCreate(srcfilename,index);
			}
	    	File newdir = new File(dest,srcfilename);
	    	newdir.mkdirs();
	        String files[] = src.list();
	        for (String file : files) {
	        	if(file.equalsIgnoreCase(BatchTestingFolderName.folderName) ||
	        	   file.equalsIgnoreCase(HistoryFolderName.folderName))
	        		continue;
	        	File srcfile = new File(src, file); 
	            // 递归复制  
	            copyFolderWithoutHistory(srcfile, newdir,index);
	        }
	    } else {
	    	FileUtils.copyFileToDirectory(src, dest);
	    }
	}
	
	public static void copyMultipleTestsAtSameDir(String testPath,int number) throws IOException{
		File srcTest=new File(testPath);
		File destDir=srcTest.getParentFile();
		for(int i=1;i<=number;i++){
			copyFolderWithoutHistory(srcTest,destDir,String.valueOf(i));
		}
	}
	
	private static String renameBeforeCreate(String fileName, String index){
		if (fileName.endsWith("-dir")){
			fileName=fileName.substring(0, fileName.length()-4);
			fileName=fileName + " Copy"+index+"-dir";
		} else if(fileName.endsWith("-leaf")){
			fileName=fileName.substring(0, fileName.length()-5);
			fileName=fileName + " Copy"+index+"-leaf";
		} else if(fileName.endsWith("-t")){
			fileName=fileName.substring(0, fileName.length()-2);
			fileName=fileName + " Copy"+index+"-t";
		}
		return fileName;
	}
	
}
