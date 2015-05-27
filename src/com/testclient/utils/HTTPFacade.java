package com.testclient.utils;

import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.methods.*;

import java.io.*;
import java.net.URL;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.apache.commons.httpclient.auth.AuthScope;
import org.apache.commons.httpclient.contrib.ssl.AuthSSLProtocolSocketFactory;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.commons.httpclient.protocol.Protocol;
import org.apache.commons.httpclient.protocol.ProtocolSocketFactory;
import org.testng.Reporter;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import com.testclient.utils.ExceptionUtil;

public class HTTPFacade {
	protected String url = null;
	protected Map<String, String> paramlist = new HashMap<String, String>();
	protected Map<String, String> headerlist = new HashMap<String, String>();
	protected int status = 0;
	protected byte[] responseBody = null;
	protected String Body = "";
	protected Header[] headers = null;
	protected int fileno = 1;
	protected String queryString = "";
	protected String requestbody = "";
	protected String encode = "utf-8";
	HttpClient client = null;
	protected int requesttimeout = 120000;
	protected int connecttimeout = 20000;
	private boolean DoAuth = false;

	public void setRequesttimeout(int time) {
		this.requesttimeout = time;
	}

	public void setConnecttimeout(int time) {
		this.connecttimeout = time;
	}

	/**
	 * 获得请求返回的code
	 */
	public int getStatus() {
		return this.status;
	}

	public void nextRequest() {
		url = null;
		paramlist = new HashMap<String, String>();
		status = 0;
		responseBody = null;
		Body = "";
		headers = null;
		requestbody = "";
	}

	public void clearDefinedheaders() {
		headerlist = new HashMap<String, String>();
	}

	public HTTPFacade() {
		client = new HttpClient();
	}

	public HTTPFacade(boolean isHttps) {
		if (isHttps) {
			ProtocolSocketFactory fcty = new TheSecureProtocolSocketFactory();
			Protocol.registerProtocol("https", new Protocol("https", fcty, 443));
		}
		client = new HttpClient();
	}

	/*
	 * 用户名密码鉴权
	 */
	public HTTPFacade(String authip, int autport, String creuser, String crepass) {
		client = new HttpClient();
		client.getState().setCredentials(new AuthScope(authip, autport),
				new UsernamePasswordCredentials(creuser, crepass));
		DoAuth = true;
	}

	/**
	 * 设置请求的url
	 */
	public void setUrl(String url) {
		this.url = url;
	}

	/*
	 * 双向证书鉴权
	 */
	public HTTPFacade(String authip, int autport, String creuser,
			String crepass, URL keystore, String keystorepass,
			URL trustkeystore, String trustkeystorepass) {
		client = new HttpClient();
		client.getParams().setAuthenticationPreemptive(true);
		client.getState().setCredentials(new AuthScope(authip, autport),
				new UsernamePasswordCredentials(creuser, crepass));
		Protocol authhttps = new Protocol("https",
				new AuthSSLProtocolSocketFactory(keystore, keystorepass,
						trustkeystore, trustkeystorepass), autport);
		Protocol.registerProtocol("https", authhttps);
		DoAuth = true;

	}

	public void setEncode(String encode) {
		this.encode = encode;
	}

	/**
	 * 添加请求参数的键值对
	 */
	public void addParamValue(String paramname, String value) {
		try {
			if (paramname.length() != paramname.getBytes().length
					&& value.length() != value.getBytes().length) {
				this.queryString += URLEncoder.encode(paramname, this.encode)
						+ "=" + URLEncoder.encode(value, this.encode) + "&";
			}
			if (paramname.length() == paramname.getBytes().length
					&& value.length() != value.getBytes().length) {
				this.queryString += paramname + "="
						+ URLEncoder.encode(value, this.encode) + "&";
			}
			if (paramname.length() != paramname.getBytes().length
					&& value.length() == value.getBytes().length) {
				this.queryString += URLEncoder.encode(paramname, this.encode)
						+ "=" + value + "&";
			}
			if (paramname.length() == paramname.getBytes().length
					&& value.length() == value.getBytes().length) {
				this.queryString += paramname + "=" + value + "&";
			}
		} catch (UnsupportedEncodingException ex) {
			Reporter.log(ex.getMessage(), true);
		}
	}

	public void addHeaderValue(String headername, String headervalue) {
		headerlist.put(headername, headervalue);
	}

	public String getHeaderValue(String headername) {
		return headerlist.get(headername);
	}

	/**
	 * 添加请求体
	 */
	public void addRequestBody(String reqbody) {
		this.requestbody += reqbody;
	}

	/**
	 * 将querystring 设置到body体中
	 */
	public void setQueryStringAsRequestBody() {
		this.requestbody = this.queryString;
	}

	public String getResponseheader(String headername) {
		for (Header header : headers) {
			if (header.getName().equals(headername)) {
				return header.getValue();
			}
		}
		return "";
	}

	public String getResponseheaders() {
		String headerstr = "";
		for (Header header : headers) {
			headerstr = headerstr + header.getName() + "=" + header.getValue()
					+ ";";
		}
		return headerstr;
	}

	/**
	 * 发get
	 */
	public void get() {
		String paramstring;
		if (!this.url.contains("?")) {
			paramstring = this.url + "?";
		} else {
			paramstring = this.url + "&";
		}
		paramstring += this.queryString;
		if (paramstring.endsWith("&")) {
			paramstring = StringUtils.substringBeforeLast(paramstring, "&");
		}
		GetMethod method = new GetMethod(paramstring);
		if (DoAuth) {
			method.setDoAuthentication(DoAuth);
		}
		method.getParams().setParameter(HttpMethodParams.RETRY_HANDLER,
				new DefaultHttpMethodRetryHandler());
		method.getParams().setParameter(HttpMethodParams.SO_TIMEOUT,
				requesttimeout);
		client.getHttpConnectionManager().getParams()
				.setConnectionTimeout(connecttimeout);
		Iterator iter1 = headerlist.entrySet().iterator();
		while (iter1.hasNext()) {
			Map.Entry entry = (Map.Entry) iter1.next();
			try {
				method.addRequestHeader((String) entry.getKey(),
						(String) entry.getValue());
			} catch (Exception ex) {
				Reporter.log(ex.getMessage(), true);
			}
		}

		try {
			Reporter.log("get method start。url is " + paramstring, true);
			status = client.executeMethod(method);
			if (status != HttpStatus.SC_OK) {
				Reporter.log("Method failed: " + method.getStatusLine(), true);
			}
			// responseBody = method.getResponseBody();
			responseBody = IOUtils
					.toByteArray(method.getResponseBodyAsStream());
			headers = method.getResponseHeaders();

			// Body=responseBody.toString();
			Body = new String(responseBody, encode);
			Reporter.log("response -----:" + Body, true);
		} catch (HttpException e) {
			Reporter.log("Fatal protocol violation: " + e.getMessage(), true);
		} catch (IOException e) {
			Reporter.log("Fatal transport error: " + e.getMessage(), true);
		} finally {
			method.releaseConnection();
		}
	}

	/**
	 * 发post
	 */
	public void post() {
		PostMethod method = new PostMethod(this.url);
		Reporter.log("post method start。url is " + this.url, true);
		doMethod(method);
	}

	/**
	 * 发put。
	 **/
	public void put() {
		PutMethod method = new PutMethod(this.url);
		Reporter.log("put method start。url is " + this.url, true);
		doMethod(method);
	}

	public void delete() {
		DeleteMethod method = new DeleteMethod(this.url);
		Reporter.log("Delete method start。url is " + this.url, true);
		if (DoAuth) {
			method.setDoAuthentication(DoAuth);
		}
		Iterator iter1 = headerlist.entrySet().iterator();
		while (iter1.hasNext()) {
			Map.Entry entry = (Map.Entry) iter1.next();
			try {
				method.addRequestHeader((String) entry.getKey(),
						(String) entry.getValue());
			} catch (Exception ex) {
				Reporter.log(ex.getMessage(), true);
			}
		}
		method.getParams().setParameter(HttpMethodParams.RETRY_HANDLER,
				new DefaultHttpMethodRetryHandler());
		method.getParams().setParameter(HttpMethodParams.SO_TIMEOUT,
				requesttimeout);
		client.getHttpConnectionManager().getParams()
				.setConnectionTimeout(connecttimeout);
		try {
			Reporter.log(
					"body -----:"
							+ this.requestbody.replace("&amp;", "&")
									.replace("&lt;", "<").replace("&gt;", ">")
									.replace("&apos;", "'")
									.replace("&quot;", "\""), true);
			status = client.executeMethod(method);
			if (status != HttpStatus.SC_OK) {
				Reporter.log("Method failed: " + method.getStatusLine(), true);
			}
			responseBody = IOUtils
					.toByteArray(method.getResponseBodyAsStream());
			headers = method.getResponseHeaders();
			Body = new String(responseBody, encode);
			Reporter.log(
					"response-----:"
							+ Body.replace("&amp;", "&").replace("&lt;", "<")
									.replace("&gt;", ">")
									.replace("&apos;", "'")
									.replace("&quot;", "\""), true);
		} catch (HttpException e) {
			Reporter.log(
					"Fatal protocol violation: "
							+ ExceptionUtil.getExceptionMessage(e), true);
		} catch (IOException e) {
			Reporter.log(
					"Fatal transport error: "
							+ ExceptionUtil.getExceptionMessage(e), true);
		} finally {
			method.releaseConnection();
		}
	}

	/**
	 * 发post.query String 跟在url上
	 */
	public void postWithQueryStrInUrl() {
		String paramstring;
		if (!this.url.contains("?")) {
			paramstring = this.url + "?";
		} else {
			paramstring = this.url + "&";
		}
		paramstring += this.queryString;
		if (paramstring.endsWith("&")) {
			paramstring = StringUtils.substringBeforeLast(paramstring, "&");
		}
		PostMethod method = new PostMethod(paramstring);
		Reporter.log("post method start。url is " + paramstring, true);
		doMethod(method);
	}

	/**
	 * 发put。query String 跟在url上
	 **/
	public void putWithQueryStrInUrl() {
		String paramstring;
		if (!this.url.contains("?")) {
			paramstring = this.url + "?";
		} else {
			paramstring = this.url + "&";
		}
		paramstring += this.queryString;
		PutMethod method = new PutMethod(paramstring);
		Reporter.log("put method start。url is " + paramstring, true);
		doMethod(method);
	}

	public void deleteWithQueryStrInUrl() {
		DefaultHttpClient httpClient = new DefaultHttpClient();
		HttpDeleteEntityEnclosingRequest request = new HttpDeleteEntityEnclosingRequest(
				this.url);
		Iterator iter1 = headerlist.entrySet().iterator();
		while (iter1.hasNext()) {
			Map.Entry entry = (Map.Entry) iter1.next();
			try {
				request.addHeader((String) entry.getKey(),
						(String) entry.getValue());
			} catch (Exception ex) {
				Reporter.log(ex.getMessage(), true);
			}
		}
		try {
			String ct = "";
			if (this.getHeaderValue("contentType") != null) {
				ct = this.getHeaderValue("contentType");
			}
			StringEntity se = new StringEntity(this.requestbody, ct);
			request.setEntity(se);
		} catch (UnsupportedEncodingException ex) {
			Reporter.log(ex.getMessage(), true);
		}
		try {
			Reporter.log(
					"body -----:"
							+ this.requestbody.replace("&amp;", "&")
									.replace("&lt;", "<").replace("&gt;", ">")
									.replace("&apos;", "'")
									.replace("&quot;", "\""), true);
			HttpResponse response = httpClient.execute(request);
			status = response.getStatusLine().getStatusCode();
			if (status != HttpStatus.SC_OK) {
				Reporter.log("Method failed: " + response.getStatusLine(), true);
				Body="Method failed: " + response.getStatusLine();
			}
			Body += EntityUtils.toString(response.getEntity(), encode);
			List<Header> hs = new ArrayList<Header>();
			int count=0;
			for (org.apache.http.Header h : response.getAllHeaders()) {
				Header head = new Header();
				head.setName(h.getName());
				head.setValue(h.getValue());
				hs.add(head);
				count++;
			}
			headers = hs.toArray(new Header[count]);
			Reporter.log(
					"response-----:"
							+ Body.replace("&amp;", "&").replace("&lt;", "<")
									.replace("&gt;", ">")
									.replace("&apos;", "'")
									.replace("&quot;", "\""), true);
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private void doMethod(EntityEnclosingMethod method) {
		if (DoAuth) {
			method.setDoAuthentication(DoAuth);
		}
		Iterator iter1 = headerlist.entrySet().iterator();
		while (iter1.hasNext()) {
			Map.Entry entry = (Map.Entry) iter1.next();
			try {
				method.addRequestHeader((String) entry.getKey(),
						(String) entry.getValue());
			} catch (Exception ex) {
				Reporter.log(ex.getMessage(), true);
			}
		}
		method.getParams().setParameter(HttpMethodParams.RETRY_HANDLER,
				new DefaultHttpMethodRetryHandler());
		method.getParams().setParameter(HttpMethodParams.SO_TIMEOUT,
				requesttimeout);
		client.getHttpConnectionManager().getParams()
				.setConnectionTimeout(connecttimeout);

		// method.setRequestBody(this.requestbody);
		// 用StringRequestEntity代替setRequestBody
		try {
			String ct = "";
			if (this.getHeaderValue("contentType") != null) {
				ct = this.getHeaderValue("contentType");
			}
			StringRequestEntity a1 = new StringRequestEntity(this.requestbody,
					ct, this.encode);
			method.setRequestEntity(a1);
		} catch (UnsupportedEncodingException ex) {
			Reporter.log(ex.getMessage(), true);
		}
		try {
			Reporter.log(
					"body -----:"
							+ this.requestbody.replace("&amp;", "&")
									.replace("&lt;", "<").replace("&gt;", ">")
									.replace("&apos;", "'")
									.replace("&quot;", "\""), true);
			status = client.executeMethod(method);
			if (status != HttpStatus.SC_OK) {
				Reporter.log("Method failed: " + method.getStatusLine(), true);
				Body="Method failed: " + method.getStatusLine();
			}
			// responseBody = method.getResponseBody();
			responseBody = IOUtils
					.toByteArray(method.getResponseBodyAsStream());
			headers = method.getResponseHeaders();
			// Body=responseBody.toString();
			Body += new String(responseBody, encode);
			Reporter.log(
					"response-----:"
							+ Body.replace("&amp;", "&").replace("&lt;", "<")
									.replace("&gt;", ">")
									.replace("&apos;", "'")
									.replace("&quot;", "\""), true);
		} catch (HttpException e) {
			Reporter.log(
					"Fatal protocol violation: "
							+ ExceptionUtil.getExceptionMessage(e), true);
		} catch (IOException e) {
			Reporter.log(
					"Fatal transport error: "
							+ ExceptionUtil.getExceptionMessage(e), true);
		} finally {
			method.releaseConnection();
		}
	}

	public boolean saveResponse2File(String filename)
			throws FileNotFoundException {
		Date dateNow = new Date();
		String[] filepath = filename.split("\\\\");
		String filep = "";
		for (int i = 0; i < filepath.length - 1; i++) {
			filep += filepath[i] + "\\";
		}
		File path = new File(filep);
		if (!path.isDirectory()) {
			path.mkdir();
		}
		SimpleDateFormat dateFormat = new SimpleDateFormat(
				"yyyy年MM月dd日HH时mm分ss秒");
		String dateNowStr = dateFormat.format(dateNow);
		FileOutputStream fis = new FileOutputStream(filename + dateNowStr
				+ fileno + ".html", true);
		fileno++;
		try {
			fis.write(responseBody);
		} catch (Exception ex) {
			Reporter.log(ex.getMessage(), true);
			return false;
		}
		try {
			fis.close();
		} catch (IOException ex) {
			Reporter.log(ex.getMessage(), true);
			return false;
		}
		// System.out.println(Body);
		return true;
	}

	/**
	 * 检查reponse中是否包含指定文件中的内容。
	 */
	public boolean findFileStringinResponse(String filename) {
		BufferedInputStream bufferedInputStream = null;
		try {
			File file = new File(filename);
			if (filename == null || filename.equals("")) {
				throw new NullPointerException("无效的文件路径");
			}
			long len = file.length();
			byte[] bytes = new byte[(int) len];
			bufferedInputStream = new BufferedInputStream(new FileInputStream(
					file));
			int r = bufferedInputStream.read(bytes);
			if (r != len) {
				throw new IOException("读取文件不正确");
			}
			bufferedInputStream.close();
			String content = new String(bytes, encode);

			if (content.equals("MYHTTPCLIENT_ZERORESPONSE")) {
				boolean kongresult = (this.responseBody.length == 0);
				Reporter.log("检查：reponse为空----" + kongresult, true);
				return this.responseBody.length == 0;
			} else {

				byte[] des;
				try {

					des = bytes;
					for (int a = 0; a < (responseBody.length - des.length + 1); a++) {
						boolean result = true;
						for (int b = 0; b < des.length; b++) {
							if (responseBody[a + b] != des[b]) {
								result = false;
								break;
							}
						}
						if (result) {
							Reporter.log("检查：reponse包含" + filename
									+ "中的内容----true", true);
							return true;
						}
					}
				} catch (Exception ex) {
					Reporter.log(ex.getMessage(), true);
				}
				Reporter.log("检查：reponse包含" + filename + "中的内容----false", true);
				return false;
			}
		} catch (FileNotFoundException ex) {
			Reporter.log(ex.getMessage(), true);
			Reporter.log("检查：reponse包含" + filename + "中的内容----false", true);
			return false;
		} catch (IOException ex) {
			Reporter.log(ex.getMessage(), true);
			Reporter.log("检查：reponse包含" + filename + "中的内容----false", true);
			return false;
		} finally {
			try {
				bufferedInputStream.close();
			} catch (IOException ex) {
				Reporter.log("检查：reponse包含" + filename + "中的内容----false", true);
				return false;
			}
		}

	}

	/**
	 * 检查reponse是否同指定的文件中所包含的正则表达式匹配
	 */
	public boolean FileMatchResponse(String filename) {
		BufferedInputStream bufferedInputStream = null;
		try {
			File file = new File(filename);
			if (filename == null || filename.equals("")) {
				throw new NullPointerException("无效的文件路径");
			}
			long len = file.length();
			byte[] bytes = new byte[(int) len];
			bufferedInputStream = new BufferedInputStream(new FileInputStream(
					file));
			int r = bufferedInputStream.read(bytes);
			if (r != len) {
				throw new IOException("读取文件不正确");
			}
			bufferedInputStream.close();
			String content = new String(bytes, encode);

			if (content.equals("MYHTTPCLIENT_ZERORESPONSE")) {
				return this.responseBody.length == 0;
			} else {
				String responseaim = new String(responseBody, encode);
				boolean matchresult = responseaim.matches(content);
				Reporter.log("检查：reponse匹配" + filename + "中的正则表达----"
						+ matchresult, true);
				return matchresult;
			}
		} catch (FileNotFoundException ex) {
			Reporter.log(ex.getMessage(), true);
			Reporter.log("检查：reponse匹配" + filename + "中的正则表达----false", true);
			return false;
		} catch (IOException ex) {
			Reporter.log(ex.getMessage(), true);
			Reporter.log("检查：reponse匹配" + filename + "中的正则表达----false", true);
			return false;
		} finally {
			try {
				bufferedInputStream.close();
			} catch (IOException ex) {
				Reporter.log("检查：reponse匹配" + filename + "中的正则表达----false",
						true);
				return false;
			}
		}

	}

	/**
	 * 检查reponse是否同参数的正则表达式匹配
	 */
	public boolean ResponseMatch(String content) {
		if (content.equals("MYHTTPCLIENT_ZERORESPONSE")) {
			boolean kongresult = (this.responseBody.length == 0);
			Reporter.log("检查：reponse为空----" + kongresult, true);
			return kongresult;
		} else {
			try {
				String responseaim = new String(responseBody, encode);
				boolean result = responseaim.matches(content);
				Reporter.log("检查：ResponseMatch:" + content + "----" + result,
						true);
				return result;
			} catch (Exception ex) {
				Reporter.log(ex.getMessage(), true);
				return false;
			}
		}
	}

	/**
	 * 检查reponse是否包含参数的字符串
	 */
	public boolean findStringinResponse(String content) {
		if (content.equals("MYHTTPCLIENT_ZERORESPONSE")) {
			return this.responseBody.length == 0;
		} else {

			byte[] des;
			try {
				des = content.getBytes(encode);
				for (int a = 0; a < (responseBody.length - des.length + 1); a++) {
					boolean result = true;
					for (int b = 0; b < des.length; b++) {
						if (responseBody[a + b] != des[b]) {
							result = false;
							break;
						}
					}
					if (result) {
						Reporter.log("检查：response中查找字符串:" + content
								+ "----true", true);
						return true;
					}
				}
			} catch (UnsupportedEncodingException ex) {
				Reporter.log(ex.getMessage(), true);
			}
			Reporter.log("检查：response中查找字符串:" + content + "----false", true);
			return false;
		}
	}

	/**
	 * 检查reponse是否包含参数的字符串。字符串会将xml转义字符进行转义
	 * 
	 * @param content
	 * @return
	 */
	public boolean findXmlStringInRespnonse(String content) {
		// content=content.replace("&", "&amp;").replace("<",
		// "&lt;").replace(">", "&gt;").replace("'", "&apos;").replace("\"",
		// "&quot;");
		content = content.replace("<", "&lt;").replace(">", "&gt;");
		return findStringinResponse(content);
	}

	/**
	 * 返回参数在reponse中出现的次数
	 */
	public int findNumberofStringinResponse(String content) {
		if (content != null && !content.equals("")) {
			int count = 0;
			byte[] des;
			try {
				des = content.getBytes(encode);
				for (int a = 0; a < (responseBody.length - des.length + 1); a++) {
					boolean result = true;
					for (int b = 0; b < des.length; b++) {
						if (responseBody[a + b] != des[b]) {
							result = false;
							break;
						}
					}
					if (result) {
						count++;
					}
				}
			} catch (UnsupportedEncodingException ex) {
				Reporter.log(ex.getMessage(), true);
			}
			Reporter.log("统计：reponse出现： " + content + " 的次数为" + count, true);
			return count;
		} else {
			Reporter.log("统计：reponse出现： " + content + " 的次数为0", true);
			return 0;
		}
	}

	public String saveXmlParamLeftstrRightstr(String leftstr, String rightstr) {
		// leftstr=leftstr.replace("&", "&amp;").replace("<",
		// "&lt;").replace(">", "&gt;").replace("'", "&apos;").replace("\"",
		// "&quot;");
		leftstr = leftstr.replace("<", "&lt;").replace(">", "&gt;");
		// rightstr=rightstr.replace("&", "&amp;").replace("<",
		// "&lt;").replace(">", "&gt;").replace("'", "&apos;").replace("\"",
		// "&quot;");
		rightstr = rightstr.replace("<", "&lt;").replace(">", "&gt;");
		String result = saveParamLeftstrRightstr(leftstr, rightstr);
		// result=result.replace( "&amp;","&").replace( "&lt;","<").replace(
		// "&gt;",">").replace("&apos;","'").replace("&quot;","\"");
		result = result.replace("&amp;", "&").replace("&lt;", "<")
				.replace("&gt;", ">").replace("&apos;", "'")
				.replace("&quot;", "\"");
		return result;
	}

	/**
	 * 通过左右边界抓出目标字符串返回
	 */
	public String saveParamLeftstrRightstr(String leftstr, String rightstr) {
		byte[] left;
		byte[] right;
		byte[] content = null;
		int start;
		int end;
		try {
			left = leftstr.getBytes(encode);
			right = rightstr.getBytes(encode);
			for (int a = 0; a < (responseBody.length - left.length
					- right.length + 1); a++) {
				boolean result = true;
				for (int b = 0; b < left.length; b++) {
					if (responseBody[a + b] != left[b]) {
						result = false;
						break;
					}
				}

				if (result) {
					// 注意
					start = a + left.length;
					for (int a1 = start; a1 < (responseBody.length
							- right.length + 1); a1++) {
						boolean result2 = true;
						for (int b1 = 0; b1 < right.length; b1++) {
							if (responseBody[a1 + b1] != right[b1]) {
								result2 = false;
								break;
							}
						}
						if (result2) {
							end = a1 - 1;
							if (start > end) {
								// System.out.println("start is "+start);
								// System.out.println("end is "+end);
								// System.out.println("start>end");
								Reporter.log("关联：在reponse中通过左边界：" + leftstr
										+ "。右边界：" + rightstr + "关联到的内容为空", true);
								return "";
							} else {
								content = new byte[end - start + 1];
								int j = 0;
								for (int a2 = start; a2 <= end; a2++) {
									content[j] = responseBody[a2];
									j++;
								}
								// System.out.println("content");
								String collstr = new String(content, encode);
								Reporter.log("关联：在reponse中通过左边界：" + leftstr
										+ "。右边界：" + rightstr + "关联到的内容为:"
										+ collstr, true);
								return collstr;
							}
						}
					}
				}
			}
		} catch (UnsupportedEncodingException ex) {
			Reporter.log(ex.getMessage(), true);
		}
		return "";
	}

	public String getResponseBody() {
		return this.Body;
	}
}
