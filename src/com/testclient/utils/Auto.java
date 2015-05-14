package com.testclient.utils;

import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Random;
import java.util.UUID;

import org.apache.commons.lang.RandomStringUtils;

import shelper.iffixture.HTTPFacade;

public class Auto {
	public String addition(long num1, long num2){
		return String.valueOf(num1+num2);
	}
	
	public String subtraction(long num1, long num2){
		return String.valueOf(num1-num2);
	}
	
	public String multiplication(long num1, long num2){
		return String.valueOf(num1*num2);
	}
	
	public String division(long num1, long num2){
		if(num2==0)
			return "";
		else
			return String.valueOf(num1/num2);
	}
	
	public String getH5Auth(String username){
		return AuthUtils.getH5AuthField(username);
	}
	
	public String getRandomNumber(int length){
		String number=String.valueOf(System.currentTimeMillis());
		if(length<=0 || length > number.length())
			return String.valueOf(System.currentTimeMillis());
		else
			return String.valueOf(System.currentTimeMillis()).substring(0, length);
	}
	/**
	 * 生成指定长度数字字符串
	 * @return
	 */
	public String getFixLengthNumber(int count){
		return RandomStringUtils.random(count, false, true);
	}
	
	/**
	 * 生成指定长度字母字符串
	 * @return
	 */
	public String getFixLengthLetter(int count){
		return RandomStringUtils.random(count, true, false);
	}
	
	/**
	 * 生成指定长度字母数字混合字符串
	 * @return
	 */
	public String getFixLengthString(int count){
		return RandomStringUtils.random(count, true, true);
	}
	
	
	private Random random = null;

	private Random getRandomInstance() {
		if (random == null) {
			random = new Random(new Date().getTime());
		}
		return random;
	}

	/**
	 * 生成一个中文
	 * @return
	 */
	public String getChinese() {
		String str = null;
		int highPos, lowPos;
		Random random = getRandomInstance();
		highPos = (176 + Math.abs(random.nextInt(39)));
		lowPos = 161 + Math.abs(random.nextInt(93));
		byte[] b = new byte[2];
		b[0] = (new Integer(highPos)).byteValue();
		b[1] = (new Integer(lowPos)).byteValue();
		try {
			str = new String(b, "GB2312");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return str;
	}

	/**
	 * 生成指定长度的中文
	 * @param length
	 * @return
	 */
	public String getFixedLengthChinese(int length) {
		String str = "";
		for (int i = length; i > 0; i--) {
			str = str + getChinese();
		}
		return str;
	}

	/**
	 * 生成一定长度范围的中文
	 * @param start
	 * @param end
	 * @return
	 */
	public String getRandomLengthChiness(int start, int end) {
		String str = "";
		int length = new Random().nextInt(end + 1);
		if (length < start) {
			str = getRandomLengthChiness(start, end);
		} else {
			for (int i = 0; i < length; i++) {
				str = str + getChinese();
			}
		}
		return str;
	}
	
	/***
	 * 获取几天后的日期字符串
	 * @param daysNumber  天数日期
	 * @return
	 */
	public String getComingDate(int daysNumber){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DAY_OF_YEAR, daysNumber);
		java.util.Date date = calendar.getTime();
		String departDate = sdf.format(date);	
		return departDate;
	}
	
	/***
	 * 获取几天后的日期字符串
	 * @param daysNumber  天数日期
	 * @return
	 */
	public String getComingDate(int daysNumber,String format){
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DAY_OF_YEAR, daysNumber);
		java.util.Date date = calendar.getTime();
		String departDate = sdf.format(date);	
		return departDate;
	}
	
	public static void main(String args[]){
		System.out.println(new Auto().getComingDate(1,"HH:mm:ss"));
	}
	
}
