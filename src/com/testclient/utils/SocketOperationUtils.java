package com.testclient.utils;

import org.apache.commons.lang.StringUtils;

import net.sf.json.JSONObject;
import ccom.testclient.model.ConvertRequest;
import ccom.testclient.model.ConvertResponse;
import ccom.testclient.model.InvokeRequest;
import ccom.testclient.model.InvokeResponse;

public class SocketOperationUtils {
	private String url="";
	
	public SocketOperationUtils(String url){
		if(!url.endsWith("/"))
			url+="/";
		this.url=url;
	}
	
	public InvokeResponse invokeService(InvokeRequest request){
		InvokeResponse res=new InvokeResponse();
		try{
			HTTPFacade hf=new HTTPFacade(false);
			hf.setRequesttimeout(600*1000);
			hf.setUrl(url+"InvokeService");
			JSONObject json = JSONObject.fromObject(request);
			String requstbody=json.toString();
			String head=request.getHead();
			if(head.indexOf("\"ServiceCode\"")==-1){
				head=StringUtils.substringBeforeLast(head, "}");
				head+=",\"ServiceCode\":\""+request.getCode()+"\"}";
			}
			String updhead="\""+head.replace("\"","\\"+"\"")+"\"";
			String updbody="\""+request.getBody().replace("\\","\\"+"\\").replace("\"","\\"+"\"")+"\"";
			requstbody=requstbody.replace(json.getString("head"), updhead);
			requstbody=requstbody.replace(json.getString("body"), updbody);
			hf.addHeaderValue("Content-Type", "application/json; charset=UTF-8");
			requstbody=requstbody.replace("\n", "").replace("\r", "");
			hf.addRequestBody(requstbody);
			hf.postWithQueryStrInUrl();
			String responsebody=hf.getResponseBody();
			int responsestatus=hf.getStatus();
			String responseheader="";
			if(!responsebody.isEmpty()){
				responseheader=hf.getResponseheaders();
			}
			if(!responsebody.isEmpty()){
				res = (InvokeResponse)JSONObject.toBean(JSONObject.fromObject(responsebody), InvokeResponse.class);
			}else{
				res.setBody("no response,check WCF service accessibility.(http://172.16.146.52:8574/TestCore)");
				res.setTimespan("0");
				res.setError("no response");
			}
		}catch(Exception e){
			res.setBody(e.getClass()+" "+e.getMessage());
			res.setTimespan((res.getTimespan()!=null && res.getTimespan().isEmpty() ? res.getTimespan() : "0"));
			res.setError(e.getMessage());
		}
		return res;
	}
	
	public ConvertResponse convertDatagram(ConvertRequest request){
		ConvertResponse res=new ConvertResponse();
		try{
			HTTPFacade hf=new HTTPFacade(false);
			hf.setRequesttimeout(600*1000);
			hf.setUrl(url+"ConvertDatagram");
			JSONObject json = JSONObject.fromObject(request);
			String requstbody=json.toString().replace("\n", "").replace("\r", "");
			hf.addHeaderValue("Content-Type", "application/json; charset=UTF-8");
			hf.addRequestBody(requstbody);
			hf.postWithQueryStrInUrl();
			String responsebody=hf.getResponseBody();
			int responsestatus=hf.getStatus();
			String responseheader="";
			if(!responsebody.isEmpty()){
				responseheader=hf.getResponseheaders();
			}
			res = (ConvertResponse)JSONObject.toBean(JSONObject.fromObject(responsebody), ConvertResponse.class);
		}catch(Exception e){
		}
		return res;
	}
	
//	public static void main(String[] args){
//		url="http://localhost:37712/TestCore/InvokeService";
//		//url="http://10.2.254.201:8099/TestOperationService.svc/InvokeService";
//		InvokeRequest request=new InvokeRequest();
//		ServerItem server=new ServerItem();
//		server.setName("");
//		server.setIp("10.2.254.201");
//		server.setPort("8008");
//		server.setProtocol("TCP");
//		request.setCode("31000101");
//		request.setDatagramVersion(5);
//		request.setIndented(true);
//		String head="{\"ClientToken\":\"020000000000\",\"Encoding\":0,\"Language\":\"01\",\"MessageNumber\":\"1421215053722\",\"UserId\":\"M00591325\",\"SystemCode\":\"12\",\"ClientVersion\":603,\"ClientId\":\"12042233200001577834\",\"SourceId\":\"8890\",\"ExSourceID\":\"\",\"ServiceCode\":\"31000101\"}";
//		String body="{\"BusinessEType\":101,\"OrderIDExtend\":1001,\"OrderAmount\":345,\"OrderID\":1001,\"SubUseEType\":0,\"ServiceVersion\":603,\"SearchBitMap\":0,\"PayRestrict\":{\"CardNumSegmentList\":[],\"BlackPaymentWayIDList\":[],\"PayTypeList\":0,\"SubTypeList\":0,\"WhitePaymentWayIDList\":[]},\"RequestID\":\"1234567890\",\"OrderDesc\":\"这是主标题这是主标题这是主标题这是主标题\",\"UserSourceType\":0,\"SubPayType\":0,\"UseEType\":1,\"Currency\":null,\"Platform\":1,\"ForStatistics\":\"\"}";
//		request.setHead(head);
//		request.setBody(body);
//		request.setServer(server);
//		InvokeResponse res=invokeService(request);
//		System.out.println(res.getBody());
//	}
}
