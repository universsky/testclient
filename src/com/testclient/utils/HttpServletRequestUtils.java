package com.testclient.utils;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;

public class HttpServletRequestUtils {
	public static String getHttpServletRequestBody(HttpServletRequest request)
			throws IOException {
		String submitMehtod = request.getMethod();
		String queryString = null;
		String charEncoding = request.getCharacterEncoding();// charset
		if (submitMehtod.equals("GET")) {// GET
			queryString = request.getQueryString();
			if (queryString == null) {
				return "";
			}
			if (StringUtils.isEmpty(charEncoding)) {
				charEncoding = "UTF-8";
			}
			return new String(queryString.getBytes(charEncoding));
		} else {// POST
			return new String(getRequestPostBytes(request), charEncoding);
		}
	}

	/***
	 * Get request query string, form method : post
	 * 
	 * @param request
	 * @return byte[]
	 * @throws IOException
	 */
	private static byte[] getRequestPostBytes(HttpServletRequest request)
			throws IOException {
		int contentLength = request.getContentLength();
		if (contentLength < 0) {
			return null;
		}
		byte buffer[] = new byte[contentLength];
		for (int i = 0; i < contentLength;) {

			int readlen = request.getInputStream().read(buffer, i,
					contentLength - i);
			if (readlen == -1) {
				break;
			}
			i += readlen;
		}
		return buffer;
	}

	public static String getValueFromRequest(HttpServletRequest request,
			String text, String key) {
		String val = request.getParameter(key);
		if (null == val)
			val = getValueFromRequestInput(text, key);
		return val;
	}

	public static String getValueFromRequestInput(String text, String key) {
		if (text.indexOf("&lt;") > -1
				&& text.indexOf("&gt;") > text.indexOf("&lt;")) {
			text = text.replaceAll("&lt;", "<").replaceAll("&gt;", ">")
					.replaceAll("&apos;", "'").replaceAll("&quot;", "\"")
					.replaceAll("&amp;", "&");
		}
		if (text.indexOf("<") > -1 && text.indexOf(">") > text.indexOf("<")) {
			int pos = text.toLowerCase().indexOf(key.toLowerCase());
			if (pos != -1) {
				text = text.substring(pos + key.length() + 1);
				if (text.startsWith("\"")) {
					return StringUtils.substringBetween(text, "\"");
				} else {
					return StringUtils.substringBefore(text, "<");
				}
			}
		} else if ((text.startsWith("{") && text.endsWith("}"))) {
			text=text.replace("\\","\\"+"\\");
			JSONObject json= new JSONObject(text);
			return json.get(key).toString();
//			int pos = text.toLowerCase().indexOf(
//					"\"" + key.toLowerCase() + "\"");
//			if (pos != -1) {
//				pos += ("\"" + key + "\"").length() + 1;
//				text = text.substring(pos);
//				if (text.startsWith("\"")) {
//					return StringUtils.substringBetween(text, "\"");
//				} else {
//					String v = StringUtils.substringBefore(text, ",");
//					if (v == text)
//						v = StringUtils.substringBefore(text, "}");
//					return v.replace("\"","");
//				}
//			}
		} else {
			for (String kv : text.split("&")) {
				if (kv.startsWith(key)) {
					return kv.replace(key + "=", "");
				}
			}
		}
		return "";
	}
}
