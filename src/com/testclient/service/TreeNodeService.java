package com.testclient.service;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import com.trilead.ssh2.log.Logger;

import com.testclient.enums.Suffix4Deleted;
import com.testclient.httpmodel.Node4Queue;
import com.testclient.utils.MyFileUtils;

@Service("treeNodeService")
public class TreeNodeService {
	
	public List getTree(String rootName,boolean containsCheckbox){
		List l=null;
		if(!rootName.isEmpty()){
			MyFileUtils.makeDir(rootName);
			File root=new File(rootName);
			try{
				l = getTreeNodeList(root,containsCheckbox);
			}catch(Exception e){
				l = new ArrayList<Map<String, Object>>();
			}
		}
		return l;
	}
	
	
	public List getChildNodes(String nodePath,boolean containsCheckbox){
		List l = new ArrayList<Map<String, Object>>();
		if(!nodePath.isEmpty()){
			File top=new File(nodePath);
			if(top.isDirectory()){
				for(File f : top.listFiles()){
					String fn=f.getName();
					if(fn.endsWith("-dir") || fn.endsWith("-leaf") || fn.endsWith("-t")){
						String folderName=f.getPath().replace("\\", "/");
						Map node = new HashMap();
						node.put("id", folderName.replaceAll("/", ">"));
						node.put("folderName", folderName);
						if(containsCheckbox)
							node.put("checked", false);
						if(fn.endsWith("-dir")){
							//目录逻辑
							String text=StringUtils.substringBeforeLast(fn, "-dir");
							node.put("text", text);
							node.put("leaf", false);
							l.add(node);
						}
						else if(fn.endsWith("-leaf")){
							//http节点逻辑
							String text=StringUtils.substringBeforeLast(fn, "-leaf");
							node.put("text", text);
							node.put("leaf", true);
							l.add(node);
						}
						else if(fn.endsWith("-t")){
							//socket节点逻辑
							String text=StringUtils.substringBeforeLast(fn, "-t");
							node.put("text", text);
							node.put("leaf", true);
							node.put("iconCls","tcpicon");
							l.add(node);
						}
					}
				}
			}
			
			
		}
		return l;
	}
	
	public List getCheckedTree(String rootName,String[] checkedTests) {
		List l = new ArrayList<Map<String, Object>>();
		if(!rootName.isEmpty()){
			MyFileUtils.makeDir(rootName);
			File root=new File(rootName);
			l=getCheckedTreeNodeList(root,checkedTests);
		}
		return l;
	}
	
	public List getCheckedChildNodes(String nodePath,String[] checkedTests) {
		List l = new ArrayList<Map<String, Object>>();
		if(!nodePath.isEmpty()){
			File top=new File(nodePath);
			if(top.isDirectory()){
				for(File f : top.listFiles()){
					String fn=f.getName();
					if(fn.endsWith("-dir") || fn.endsWith("-leaf") || fn.endsWith("-t")){
						String folderName=f.getPath().replace("\\", "/");
						Map node = new HashMap();
						node.put("id", folderName.replaceAll("/", ">"));
						node.put("folderName", folderName);
						if(checkedTests!=null && checkedTests.length>0){
							if(StringUtils.join(checkedTests,"\n").contains(folderName)){
								node.put("checked", true);
							}else
								node.put("checked", false);
						}
						if(fn.endsWith("-dir")){
							//目录逻辑
							String text=StringUtils.substringBeforeLast(fn, "-dir");
							node.put("text", text);
							node.put("leaf", false);
							l.add(node);
						}
						else if(fn.endsWith("-leaf")){
							//http节点逻辑
							String text=StringUtils.substringBeforeLast(fn, "-leaf");
							node.put("text", text);
							node.put("leaf", true);
							l.add(node);
						}
						else if(fn.endsWith("-t")){
							//socket节点逻辑
							String text=StringUtils.substringBeforeLast(fn, "-t");
							node.put("text", text);
							node.put("leaf", true);
							node.put("iconCls","tcpicon");
							l.add(node);
						}
					}
				}
			}
			
			
		}
		return l;
	}

	private List getTreeNodeList(File file,boolean containsCheckbox){
		List list = new ArrayList<Map<String, Object>>();
		if(file.isDirectory()){
			for(File f : file.listFiles()){
				String fn=f.getName();
				if(fn.endsWith("-dir") || fn.endsWith("-leaf") || fn.endsWith("-t")){
					String folderName=f.getPath().replace("\\", "/");
					Map node = new HashMap();
					node.put("id", folderName.replaceAll("/", ">"));
					node.put("folderName", folderName);
					if(containsCheckbox)
						node.put("checked", false);
					if(fn.endsWith("-dir")){
						//目录逻辑
						String text=StringUtils.substringBeforeLast(fn, "-dir");
						node.put("text", text);
						node.put("leaf", false);
						List childnodes=getTreeNodeList(f,containsCheckbox);
						node.put("children", childnodes);
						list.add(node);
					}
					else if(fn.endsWith("-leaf")){
						//http节点逻辑
						String text=StringUtils.substringBeforeLast(fn, "-leaf");
						node.put("text", text);
						node.put("leaf", true);
						list.add(node);
					}
					else if(fn.endsWith("-t")){
						//socket节点逻辑
						String text=StringUtils.substringBeforeLast(fn, "-t");
						node.put("text", text);
						node.put("leaf", true);
						node.put("iconCls","tcpicon");
						list.add(node);
					}
				}
			}
		}
		return list;
	}

	private List getCheckedTreeNodeList(File file,String[] checkedTests){
		List list = new ArrayList<Map<String, Object>>();
		if(file.isDirectory()){
			for(File f : file.listFiles()){
				String fn=f.getName();
				if(fn.endsWith("-dir") || fn.endsWith("-leaf") || fn.endsWith("-t")){
					Map node = new HashMap();
					String folderName=f.getPath().replace("\\", "/");
					node.put("id", folderName.replaceAll("/", ">"));
					node.put("folderName", folderName);
					node.put("checked", false);
					if(checkedTests!=null && checkedTests.length>0){
						if(StringUtils.join(checkedTests,"\n").contains(folderName)){
							node.put("expanded", true);
						}else
							node.put("expanded", false);
					}
					if(fn.endsWith("-dir")){
						//目录逻辑
						String text=StringUtils.substringBeforeLast(fn, "-dir");
						node.put("text", text);
						node.put("leaf", false);
						List childnodes=getCheckedTreeNodeList(f,checkedTests);
						node.put("children", childnodes);
						list.add(node);
						continue;
					}
					else if(fn.endsWith("-leaf")){
						//http节点逻辑
						String text=StringUtils.substringBeforeLast(fn, "-leaf");
						node.put("text", text);
					}
					else if(fn.endsWith("-t")){
						//socket节点逻辑
						String text=StringUtils.substringBeforeLast(fn, "-t");
						node.put("text", text);
						node.put("iconCls","tcpicon");
					}
					node.put("leaf", true);
					if(StringUtils.join(checkedTests,"\n").contains(folderName)){
						boolean isSelected=Arrays.asList(checkedTests).contains(folderName)?true:false;
						node.put("checked", isSelected);
					}
					list.add(node);
				}
			}
		}
		return list;
	}
	
	public List<String> getNodes(String rootName,String folderSeperator) {
		List<String> l = new ArrayList<String>();
		MyFileUtils.makeDir(rootName);
		File root=new File(rootName);
		return getNodesLocation(root,folderSeperator);
	}
	
	private List<String> getNodesLocation(File file,String folderSeperator){
		List list = new ArrayList<String>();
		if(file.isDirectory()){
			for(File f : file.listFiles()){
				String fn=f.getName();
				if(fn.endsWith("-leaf") || fn.endsWith("-t") || fn.endsWith("-dir")){
					String path=f.getPath().replace("\\", folderSeperator);
					list.add(path);
					if(fn.endsWith("-dir")){
						List children=getNodesLocation(f,folderSeperator);
						if(children.size()>0)
							list.addAll(children);
					}
				}
			}
		}
		return list;
	}
	
	public List getFolderTree(String rootName) {
		List l = new ArrayList();
		if(rootName!=null && !rootName.isEmpty()){
			MyFileUtils.makeDir(rootName);
			File root=new File(rootName);
			l = getDirNodes(root,rootName);
		}
		return l;
	}
	
	public List getDirNodes(File file,String rootName){
		List l = new ArrayList();
		if(file.isDirectory()){
			for(File f : file.listFiles()){
				String fn=f.getName();
				if(fn.endsWith("-dir")){
					Map<String,Object> node = new HashMap<String,Object>();
					String folderName=rootName+"/"+fn;
					String text=StringUtils.substringBeforeLast(fn, "-dir");
					node.put("text", text);
					node.put("path", folderName);
					node.put("leaf", false);
					List childnodes=getDirNodes(f,folderName);
					node.put("children", childnodes);
					l.add(node);
				}
			}
		}
		return l;
	}
	
	public boolean renameDirectory(String fromDir, String toDir) {
		File from = new File(fromDir);
		if (from.exists() && from.isDirectory()) {
			File to = new File(toDir);				
			//Rename
			if(to.exists() && to.isDirectory()){
				to = new File(toDir+Suffix4Deleted.deleted);
			}
			if (from.renameTo(to))
				return true;
			else
				return false;
		}else
			return false;
	}
	
	
	public ArrayList<Node4Queue> getTreeNodes(String rootName){
		ArrayList<Node4Queue> nodes=new ArrayList<Node4Queue>();
		if(!rootName.isEmpty()){
			MyFileUtils.makeDir(rootName);
			File root=new File(rootName);
			try{
				collectTreeNode(root,nodes);
			}catch(Exception e){
			}
		}
		return nodes;
	}
	
	private void collectTreeNode(File file,ArrayList<Node4Queue> list){
		if(file.isDirectory()){
			for(File f : file.listFiles()){
				String fn=f.getName();
				if(fn.endsWith("-dir") || fn.endsWith("-leaf") || fn.endsWith("-t")){
					String folderName=f.getPath().replace("\\", "/");
					Node4Queue node = new Node4Queue();
					node.setAction("q");
					node.setPath(folderName);
					if(fn.endsWith("-dir")){
						//目录逻辑
						String text=StringUtils.substringBeforeLast(fn, "-dir");
						node.setName(text);
						node.setIsTest(false);
						list.add(node);
						collectTreeNode(f,list);
					}
					else if(fn.endsWith("-leaf")){
						//http节点逻辑
						String text=StringUtils.substringBeforeLast(fn, "-leaf");
						node.setName(text);
						node.setIsTest(true);
						list.add(node);
					}
					else if(fn.endsWith("-t")){
						//socket节点逻辑
						String text=StringUtils.substringBeforeLast(fn, "-t");
						node.setName(text);
						node.setIsTest(true);
						list.add(node);
					}
				}
			}
		}
	}
	
}
