package com.testclient.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.testclient.factory.JsonObjectMapperFactory;
import com.testclient.httpmodel.Json;
import com.testclient.httpmodel.ServerItem;
import com.testclient.model.Parameter;
import com.testclient.model.SocketTarget;
import com.testclient.service.SocketTestConfigService;


@Controller
public class SocketTestConfigController {
	private static final Logger logger = Logger.getLogger(SocketTestConfigController.class);
	
	@Autowired
	SocketTestConfigService socketTestConfigService;
	
	@RequestMapping(value="/saveSocketTestConfig", method=RequestMethod.POST )
	@ResponseBody
	public Json saveSocketTestConfig(HttpServletRequest request, HttpServletResponse response) {
		Json j=new Json();
		try {
			SocketTarget target=new SocketTarget();
			ServerItem serverItem=new ServerItem();
			String server=request.getParameter("server").contains("{")?"":request.getParameter("server");
			String name=request.getParameter("name")!=null?request.getParameter("name"):server;
			String ip=request.getParameter("ip")!=null?request.getParameter("ip"):"";
			String port=request.getParameter("port")!=null?request.getParameter("port"):"";
			String protocol=request.getParameter("protocol")!=null?request.getParameter("protocol"):"";
			serverItem.setName(name);
			serverItem.setIp(ip);
			serverItem.setPort(port);
			serverItem.setProtocol(protocol);
			
			String folderName=request.getParameter("folderName")!=null?request.getParameter("folderName"):"";
			String serviceDescription=request.getParameter("serviceDescription")!=null?request.getParameter("serviceDescription"):"";
			String code=request.getParameter("service")!=null?request.getParameter("service"):"";
			if(code.contains(" - ")){
				code=StringUtils.substringBefore(code, " - ");
			}
			String head=request.getParameter("headers")!=null?request.getParameter("headers"):"";
			String body=request.getParameter("body")!=null?request.getParameter("body"):"";
			String datagramVersion=request.getParameter("dataversion")!=null?request.getParameter("dataversion"):"";
			String indented=request.getParameter("indented")!=null?request.getParameter("indented"):"";
			String parameters=request.getParameter("parameters")!=null?request.getParameter("parameters"):"";
			Map<String,Parameter> pm=new HashMap<String,Parameter>();
			String[] parameterarray=parameters.replace("\r", "").replace("\n", "").split(";");
			for(String para:parameterarray){
				if(para!=null && !para.trim().equals("")){
					ObjectMapper mapper = JsonObjectMapperFactory.getObjectMapper();
					Parameter p=new Parameter();
					p = mapper.readValue(para, Parameter.class);
					pm.put(p.getName(), p);
				}
			}
			target.setServer(serverItem);
			target.setCode(code);
			target.setHead(head);
			target.setBody(body);
			target.setServiceDescription(serviceDescription);
			target.setDatagramVersion(Integer.parseInt(datagramVersion));
			target.setIndented(indented.equalsIgnoreCase("on")?true:false);
			target.setParameters(pm);
			return socketTestConfigService.saveSocketTarget(target,folderName);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			j.setSuccess(false);
			j.setMsg(e.getMessage());
			return j;
		}
	}
	
	@RequestMapping(value="/getSocketTestConfig")
	@ResponseBody
	public Json getSocketTestConfig(@RequestParam String folderName) {
		return socketTestConfigService.getSocketTarget(folderName);
	}
	
	@RequestMapping(value="/convertDatagram", method=RequestMethod.POST )
	@ResponseBody
	public Json convertDatagram(@RequestParam String datagram,@RequestParam int datagramVersion,@RequestParam boolean includeHead) {
		return socketTestConfigService.convertDatagram(datagram,datagramVersion,includeHead);
	}
}
