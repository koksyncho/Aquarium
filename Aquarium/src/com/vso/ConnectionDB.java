package com.vso;

import java.sql.DriverManager;
import java.util.Properties;
import java.sql.Connection;

public class ConnectionDB {
	private static Connection conn;

	public Connection getConn() {
		if (conn == null) {
			setUpDbConnection();
		}
		return conn;
	}

	private void setUpDbConnection() {
		try {
			String uri = "jdbc:mysql://localhost:8080/aquarium_db";
			Properties prop = setLoginForDB();
			Class.forName("com.mysql.jdbc.Driver");
			conn = DriverManager.getConnection(uri, prop);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private Properties setLoginForDB() {
		Properties props = new Properties();
		props.setProperty("user", "root");
		props.setProperty("password", "");
		return props;
	}
}