package com.testclient.httpmodel;

public class QueryBoundDataItem {
	private String id;
	private String name;
	private String reference;
	private String rowIndex;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name!=null?name:"";
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getReference() {
		return reference!=null?reference:"";
	}
	public void setReference(String reference) {
		this.reference = reference;
	}
	public String getRowIndex() {
		return rowIndex!=null?rowIndex:"";
	}
	public void setRowIndex(String rowIndex) {
		this.rowIndex = rowIndex;
	}
	
}
