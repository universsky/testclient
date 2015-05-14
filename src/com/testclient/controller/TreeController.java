package com.testclient.controller;

import java.io.File;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;


import net.sf.json.JSONObject;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testclient.enums.SeperatorDefinition;
import com.testclient.enums.Suffix4Deleted;
import com.testclient.httpmodel.Json;
import com.testclient.httpmodel.Node4Queue;
import com.testclient.service.TreeNodeService;
import com.testclient.utils.MyFileUtils;


@Controller
public class TreeController {
	private static final Logger logger = Logger.getLogger(TreeController.class);
	private String _action,_path,_json;
	
	@Autowired
	TreeNodeService treeNodeService;
	
	@RequestMapping(value="/getUserRootName")
	@ResponseBody
	public String getUserRootName() {
		return SecurityContextHolder.getContext().getAuthentication().getName();
	}
	
	@RequestMapping(value="/isAdminUser")
	@ResponseBody
	public boolean isAdminUser() {
		Collection<SimpleGrantedAuthority> authorities = (Collection<SimpleGrantedAuthority>)SecurityContextHolder.getContext().getAuthentication().getAuthorities();
		String role=authorities.toArray()[0].toString();
		return role.toUpperCase().equals("ROLE_ADMIN");
	}
	
	@RequestMapping(value="/copyNodeWithoutHistory", method=RequestMethod.POST )
	@ResponseBody
	public Json copyNodeWithoutHistory(@RequestParam("srcPath")String srcPath, @RequestParam("targetPath")String targetPath) {
		Json j=new Json();
		try{
			MyFileUtils.copyTestWithoutHistory(srcPath, targetPath);
			j.setSuccess(true);
		}
		catch(IOException ioe){
			j.setSuccess(false);
			j.setMsg(ioe.getClass().toString()+": "+ioe.getMessage());
		}
		return j;
	}
	
	@RequestMapping(value="/copyNode", method=RequestMethod.POST )
	@ResponseBody
	public Json copyNode(@RequestParam("srcPath")String srcPath, @RequestParam("targetPath")String targetPath) {
		Json j=new Json();
		try{
			MyFileUtils.copyArtifact(srcPath, targetPath);
			j.setSuccess(true);
		}
		catch(IOException ioe){
			j.setSuccess(false);
			logger.error(ioe.getClass().toString()+": "+ioe.getMessage());
		}
		return j;
	}
	
	@RequestMapping(value="/batchCopyTest", method=RequestMethod.POST )
	@ResponseBody
	public Json batchCopyTest(@RequestParam String testPath, @RequestParam int number) {
		Json j=new Json();
		try{
			MyFileUtils.copyMultipleTestsAtSameDir(testPath, number);
			j.setSuccess(true);
		}
		catch(IOException ioe){
			j.setSuccess(false);
			logger.error(ioe.getClass().toString()+": "+ioe.getMessage());
		}
		return j;
	}
	
	@RequestMapping(value="/addNode", method=RequestMethod.POST )
	@ResponseBody
	public Json addNode(@RequestParam("folderName")String  foldername) {
		Json j=new Json();
		File f=new File(foldername);
		System.out.println(f.getAbsolutePath());
		MyFileUtils.makeDir(foldername);
		j.setSuccess(true);
		return j;
	}
	
	@RequestMapping(value="/delNode", method=RequestMethod.POST )
	@ResponseBody
	public Json delNode(@RequestParam("folderName")String  foldername) {
		Json j=new Json();
		try {
			FileUtils.forceDelete(new File(foldername));
			j.setSuccess(true);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error("delNode 失败", e);
			j.setSuccess(false);
			j.setMsg("删除节点失败");
		}
		return j;
	}
	
	@RequestMapping(value="/logicalDelNode", method=RequestMethod.POST )
	@ResponseBody
	public Json logicalDelNode(@RequestParam("nodePath")String nodePath) {
		Json j=new Json();
		try {
			String renamedPath=nodePath+Suffix4Deleted.deleted;
			boolean isSuccess = treeNodeService.renameDirectory(nodePath, renamedPath);
			j.setSuccess(isSuccess);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error("逻辑删除节点失败", e);
			j.setSuccess(false);
			j.setMsg("逻辑删除节点失败");
		}
		return j;
	}
	
	@RequestMapping(value="/modifyNode", method=RequestMethod.POST )
	@ResponseBody
	public Json modifyNode(@RequestParam("folderName")String  foldername,@RequestParam("oldFolderName")String  oldFoldername) {
		System.out.println("modifyNode");
		System.out.println(oldFoldername);
		Json j=new Json();
		MyFileUtils.makeDir(oldFoldername);
		File path=new File(oldFoldername);
		path.renameTo(new File(foldername));
		j.setSuccess(true);
		return j;
		
	}

	@RequestMapping(value="/gettree")
	@ResponseBody
	public List getTree(@RequestParam String rootName) {
		List list = treeNodeService.getTree(rootName,false);
		return list;
	}
	
	@RequestMapping(value="/getSelectingTree")
	@ResponseBody
	public List getSelectingTree(@RequestParam String rootName) {
		return treeNodeService.getTree(rootName,true);
	}
	
	@RequestMapping(value="/getSelectedTree")
	@ResponseBody
	public List getSelectedTree(@RequestParam String rootName,@RequestParam String[] testset) {
		return treeNodeService.getCheckedTree(rootName,testset);
	}
	
	@RequestMapping(value="/getFolderTree", method=RequestMethod.GET )
	@ResponseBody
	public List getFolderTree(@RequestParam String rootName){
		return treeNodeService.getFolderTree(rootName);
	}
	
	@RequestMapping(value="/getNodeIdByText", method=RequestMethod.POST )
	@ResponseBody
	public String getNodeIdByText(@RequestParam String rootName,@RequestParam String text,@RequestParam boolean isTest){
		List<String> nodes=treeNodeService.getNodes(rootName,">");
		for(String node : nodes){
			String[] arr=node.split(">");
			String name=arr[arr.length-1].toLowerCase();
			if(name.contains(text.toLowerCase())){
				if(isTest){
					return (name.endsWith("-leaf") || name.endsWith("-t")) ? node : "";
				}else
					return name.endsWith("-dir") ? node : "";
			}
		}
		return "";
	}
	
	@RequestMapping(value="/isDuplicatedNode")
	@ResponseBody
	public boolean isDuplicatedNode(@RequestParam String folderName,@RequestParam String name){
		boolean isduplicated=true;
		if(folderName.endsWith("-dir")){
			File f=new File(folderName);
			for(String fname : f.list()){
				if(fname.equalsIgnoreCase(name)){
					return true;
				}
			}
			isduplicated=false;
		}
		return isduplicated;
	}
	
//	@RequestMapping(value="/subscribleQueue")
//	@ResponseBody
//	public void subscribleQueue(@RequestParam String action,@RequestParam String path){
//		_action=action;
//		_path=path;
//		ApplicationContext context = new ClassPathXmlApplicationContext("spring-jms.xml");
//		// 获得JMS 模板，这里都差不多一样
//		JmsTemplate jmsTemplate = (JmsTemplate) context.getBean("jmsTemplate");
//		// 获得发送消息的目的地
//		Destination destination = (Destination) context.getBean("topicDestination");
//		// 发送消息
//		jmsTemplate.send(destination, new MessageCreator() {
//			public Message createMessage(Session session) throws JMSException {
//				Node4Queue node=new Node4Queue();
//				node.setAction(_action);
//				if(_path.endsWith("/")){
//					_path=_path.substring(0, _path.length()-1);
//				}
//				String name=StringUtils.substringAfterLast(_path, "/");
//				boolean istest=_path.endsWith("-dir") ? false : true;
//				name=StringUtils.substringBeforeLast(name, "-");
//				node.setPath(_path);
//				node.setIsTest(istest);
//				node.setName(name);
//				String json=JSONObject.fromObject(node).toString();
//				return session.createObjectMessage(json);
//			}
//		});
//		
//	}
//	
//	@RequestMapping(value="/pushAllNodesIntoQueue")
//	@ResponseBody
//	public void pushAllNodesIntoQueue(){
//		List<Node4Queue> nodes=treeNodeService.getTreeNodes("root");
//		ApplicationContext context = new ClassPathXmlApplicationContext("spring-jms.xml");
//		// 获得JMS 模板，这里都差不多一样
//		JmsTemplate jmsTemplate = (JmsTemplate) context.getBean("jmsTemplate");
//		// 获得发送消息的目的地
//		Destination destination = (Destination) context.getBean("topicDestination");
//		// 发送消息
//		for(Node4Queue node : nodes){
//			_json=JSONObject.fromObject(node).toString();
//			jmsTemplate.send(destination, new MessageCreator() {
//				public Message createMessage(Session session) throws JMSException {
//					return session.createObjectMessage(_json);
//				}
//			});
//		}
//		
//		
//	}
	
}
