package com.testclient.httpmodel;

public class SqlVerificationDataItem {
	private String id;
	private String column;
	private String rowIndex;
	private String comparedType;
	private String expectedValue;
	public String getId() {
		return id != null ? id : "";
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getColumn() {
		return column != null ? column : "";
	}
	public void setColumn(String column) {
		this.column = column;
	}
	public String getRowIndex() {
		return rowIndex != null ? rowIndex : "";
	}
	public void setRowIndex(String rowIndex) {
		this.rowIndex = rowIndex;
	}
	public String getComparedType() {
		return comparedType != null ? comparedType : "";
	}
	public void setComparedType(String comparedType) {
		this.comparedType = comparedType;
	}
	public String getExpectedValue() {
		return expectedValue != null ? expectedValue : "";
	}
	public void setExpectedValue(String expectedValue) {
		this.expectedValue = expectedValue;
	}
	
	
}
