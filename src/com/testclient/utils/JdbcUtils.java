package com.testclient.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.Map.Entry;

import com.testclient.enums.DataSourceType;
import com.testclient.model.SqlQueryReturn;


public class JdbcUtils {
	private String source;
	private String server;
	private String port;
	private String username;
	private String password;
	private String database;
	private String dbUrl="";
	
	public JdbcUtils(String _source,String _server,String _port,String _username,String _password,String _database){
		this.source=_source;
		this.server=_server;
		this.port=_port;
		this.username=_username;
		this.password=_password;
		this.database=_database;
		if(source.equalsIgnoreCase(DataSourceType.sqlServer)){
			this.dbUrl="jdbc:sqlserver://"+server+":"+port+";DataBaseName="+_database+";";
			if(username.isEmpty() && password.isEmpty()){
				this.dbUrl+="integratedSecurity = true;";
			}
		}else if(source.equalsIgnoreCase(DataSourceType.mySql)){
			this.dbUrl="jdbc:mysql://"+server+":"+port+"/"+database+"?useUnicode=true&characterEncoding=UTF-8";
		}
	}
	
	private void classForName(String sourceType){
		try {
			if(sourceType.equalsIgnoreCase(DataSourceType.sqlServer))
				Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
			else if(source.equalsIgnoreCase(DataSourceType.mySql))
				Class.forName("com.mysql.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public boolean testDBConnection(){
		boolean isPass=false;
		Connection con=null;
		try {
			classForName(source);
			con=DriverManager.getConnection(dbUrl,username,password);
			isPass= true;
		}
		catch (Exception e) {
			e.printStackTrace();
		}finally{
			try {
				if(con!=null)
					con.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return isPass;
	}
	
	public SqlQueryReturn getReturnedColumnsAndRows(String sql){
		SqlQueryReturn returned=new SqlQueryReturn();
		ArrayList<String> columns=new ArrayList<String>();
		HashMap<Integer,ArrayList<String>> rows=new HashMap<Integer,ArrayList<String>>();
		Connection con=null;
		Statement stmt=null;
		ResultSet rs=null;
		try{
			classForName(source);
			con=DriverManager.getConnection(dbUrl,username,password);
			stmt=con.createStatement();
			rs=stmt.executeQuery(sql);
			ResultSetMetaData meta= rs.getMetaData();
			int count = meta.getColumnCount();
			for(int i = 1;i<=count; i++){
				String name=meta.getColumnLabel(i);
				columns.add(name);
			}
			while(rs.next()){
				ArrayList<String> record=new ArrayList<String>();
				for(String column : columns){
					record.add(rs.getString(column));
				}
				rows.put(rs.getRow(), record);
			}
			String str="";
			String[] arr = new String[1];      
			for(String column:columns.toArray(arr)){
				str+=column+"|";
			}
			str=str.substring(0, str.length()-1)+"\r\n";
			for(Entry<Integer,ArrayList<String>> entry:rows.entrySet()){
				for(String cell:entry.getValue()){
					str+=cell+"|";
				}
				str=str.substring(0, str.length()-1)+"\r\n";
			}
			returned.setColumnNames(columns);
			returned.setRows(rows);	
			returned.setDisplayResultText(str);
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			try {
				if(rs!=null)
					rs.close();
				if(stmt!=null)
					stmt.close();
				if(con!=null)
					con.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return returned;
	}
	
	public String getValueByColumnAndRowIndex(SqlQueryReturn sqr,String columnLabel,String rowIndex){
		String value="";
		if(sqr!=null){
			ArrayList<String> columns = sqr.getColumnNames();
			ArrayList<String> row=sqr.getRows().get(Integer.parseInt(rowIndex));
			if(row!=null){
				for(int i=0;i<columns.size();i++){
					if(columns.get(i).equalsIgnoreCase(columnLabel)){
						value = row.get(i);
						break;
					}
				}
			}
		}
		return value;
	}
	
	public String getValueByColumnAndRowIndex(String sql,String columnLabel,String rowIndex){
		String value="";
		Connection con=null;
		Statement stmt=null;
		ResultSet rs=null;
		try{
			classForName(source);
			con=DriverManager.getConnection(dbUrl,username,password);
			stmt=con.createStatement();
			rs=stmt.executeQuery(sql);
			int i=1;
			int index=Integer.parseInt(rowIndex);
			while(rs.next()){
				if(index==i){
					value=rs.getString(columnLabel);
				}
				i++;
			}
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			try {
				if(rs!=null)
					rs.close();
				if(stmt!=null)
					stmt.close();
				if(con!=null)
					con.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return value;
	}
	
//	public int executeSqlAction(String sql){
//		int rowcount=-1;
//		Connection con=null;
//		Statement stmt=null;
//		try { 
//			classForName(source);
//			con=DriverManager.getConnection(dbUrl,username,password);
//			for(String str : sql.split(";")){
//				stmt = con.createStatement();
//				stmt.execute(str);
//			}
//		}catch (SQLException e) { 
//	    	try {
//				con.rollback();
//			} catch (SQLException e1) {
//				// TODO Auto-generated catch block
//				e1.printStackTrace();
//			}
//	    	rowcount=0; 
//	    }finally{ 
//	    	try { 
//	    		if(stmt != null) 
//	    			stmt.close(); 
//	    		if(con!=null && !con.isClosed())
//	    			con.close(); 
//	    	}catch (SQLException e) { 
//	     	  e.printStackTrace(); 
//	    	}
//	    }
//		return rowcount;
//	}
	
	public int executeSqlAction(String sql){
		int rowcount=-1;
		Connection con=null;
		PreparedStatement pstmt=null;
		try { 
			classForName(source);
			con=DriverManager.getConnection(dbUrl,username,password);
		    con.setAutoCommit(false);
            con.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
			for(String str : sql.split(";")){
				pstmt = con.prepareStatement(str); 
				rowcount=pstmt.executeUpdate();
			}
			con.commit();
			con.setAutoCommit(true);
		}catch (SQLException e) { 
	    	try {
				con.rollback();
			} catch (SQLException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
	    	rowcount=0; 
	    }finally{ 
	    	try { 
	    		if(pstmt != null) 
	    			pstmt.close(); 
	    		if(con!=null && !con.isClosed())
	    			con.close(); 
	    	}catch (SQLException e) { 
	     	  e.printStackTrace(); 
	    	}
	    }
		return rowcount;
	}
}
