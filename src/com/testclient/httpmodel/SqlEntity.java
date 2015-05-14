package com.testclient.httpmodel;

public class SqlEntity {
	private String source;
	private String server;
	private String port;
	private String username;
	private String password;
	private String database;
	private String sql;
	public String getSource() {
		return source != null ? source : "";
	}
	public void setSource(String source) {
		this.source = source;
	}
	public String getServer() {
		return server != null ? server : "";
	}
	public void setServer(String server) {
		this.server = server;
	}
	public String getPort() {
		return port != null ? port : "";
	}
	public void setPort(String port) {
		this.port = port;
	}
	public String getUsername() {
		return username != null ? username : "";
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password != null ? password : "";
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getSql() {
		return sql != null ? sql : "";
	}
	public void setSql(String sql) {
		this.sql = sql;
	}
	public String getDatabase() {
		return database != null ? database : "";
	}
	public void setDatabase(String database) {
		this.database = database;
	}
	
	
}
