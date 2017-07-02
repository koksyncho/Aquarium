package com.vso.models;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import com.vso.ConnectionDB;

public class CheckUserAndPass {
	private static ConnectionDB sqlConn = new ConnectionDB();
	private static Connection conn = sqlConn.getConn();
	
	public static UserModel checkUserAndPass(UserModel user) {
		String un = user.getUsername();
		String pw = user.getPassword();
		String pass = null;
		try {
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery("SELECT * FROM users WHERE username LIKE '%" + un + "%';");
			while (rs.next()) {
				pass = rs.getString("password");
			}
			stmt.close();
			if (pass != null) {
				if (pass.equals(pw)) {
					user.setValid(true);
					return user;
				}
			}
		} catch (SQLException e) {
			System.out.println("not queried");
			e.printStackTrace();
		}
		user.setValid(false);
		return user;
	}
}