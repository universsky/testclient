package com.testclient.model;

public class ConvertRequest {
	private String datagram="";

    private int datagramVersion;

    private boolean includeHead;

	public String getDatagram() {
		return datagram;
	}

	public void setDatagram(String datagram) {
		this.datagram = datagram;
	}

	public int getDatagramVersion() {
		return datagramVersion;
	}

	public void setDatagramVersion(int datagramVersion) {
		this.datagramVersion = datagramVersion;
	}

	public boolean isIncludeHead() {
		return includeHead;
	}

	public void setIncludeHead(boolean includeHead) {
		this.includeHead = includeHead;
	}
}
