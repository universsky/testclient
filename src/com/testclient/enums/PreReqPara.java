package com.testclient.controller;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import com.testclient.utils.HttpServletRequestUtils;

@Controller
public class RabbitmqController {
private static final Logger logger = Logger.getLogger(RabbitmqController.class);
	
	@RequestMapping(value="/sendrbmq" )
	@ResponseBody
	public void sendrbmq(HttpServletRequest request, HttpServletResponse response){
		
        String host=request.getParameter("host");
		String port=request.getParameter("port");
		String authname=request.getParameter("authname");
		String password=request.getParameter("password");
		String queue=request.getParameter("queue");
		String message=request.getParameter("message");
		String body="";
		try {
			body = HttpServletRequestUtils.getHttpServletRequestBody(request);
			body = body.trim().replace("\n", "");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}
		if(null==host){
			host=HttpServletRequestUtils.getValueFromRequestInput(body,"host");
		}
		if(null==port){
			port=HttpServletRequestUtils.getValueFromRequestInput(body,"port");
		}
		if(null==authname){
			authname=HttpServletRequestUtils.getValueFromRequestInput(body,"authname");
		}
		if(null==password){
			password=HttpServletRequestUtils.getValueFromRequestInput(body,"password");
		}
		if(null==queue){
			queue=HttpServletRequestUtils.getValueFromRequestInput(body,"queue");
		}
		if(null==message){
			message=HttpServletRequestUtils.getValueFromRequestInput(body,"message");
		}
		if(host.isEmpty() || port.isEmpty() || authname.isEmpty() || password.isEmpty() || queue.isEmpty() || message.isEmpty()){
			try {
				response.getWriter().println("request parameter error!");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				logger.error(e.getMessage());
			}
		}else{
			Connection connection=null;
			Channel channel=null;
			try{
				ConnectionFactory factory = new ConnectionFactory();
				factory.setHost(host);
				factory.setPort(Integer.parseInt(port));
				factory.setUsername(authname);
				factory.setPassword(password);
		        connection = factory.newConnection();
		        channel = connection.createChannel();
		    	channel.basicPublish("", queue, null, message.getBytes());
		    	response.getWriter().println(" [x] Sent '" + message + "'");
			}catch(Exception e){
				logger.error(e.getMessage());
			}finally{
				/*关闭连接*/
		        try {
					channel.close();
					connection.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					logger.error(e.getMessage());
				} catch (TimeoutException e) {
					// TODO Auto-generated catch block
					logger.error(e.getMessage());
				}
			}
		}
	}
}
