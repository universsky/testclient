package com.testclient.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.sun.xml.internal.bind.v2.runtime.unmarshaller.XsiNilLoader.Array;

public class SqlQueryReturn {
	private ArrayList<String> columnNames=new ArrayList<String>();
	private HashMap<Integer,ArrayList<String>> rows=new HashMap<Integer,ArrayList<String>>();
	private String displayResultText;
	
	public ArrayList<String> getColumnNames() {
		return columnNames;
	}
	public void setColumnNames(ArrayList<String> columnNames) {
		this.columnNames = columnNames;
	}
	public HashMap<Integer,ArrayList<String>> getRows() {
		return rows;
	}
	public void setRows(HashMap<Integer,ArrayList<String>> rows) {
		this.rows = rows;
	}
	public String getDisplayResultText() {
		return displayResultText;
	}
	public void setDisplayResultText(String displayResultText) {
		this.displayResultText = displayResultText;
	}
}
