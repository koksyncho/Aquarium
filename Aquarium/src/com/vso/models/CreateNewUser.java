
package com.vso.models;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import com.vso.ConnectionDB;

public class CreateNewUser {
	private static ConnectionDB sqlConn = new ConnectionDB();
	private static Connection conn = sqlConn.getConn();

	public static UserModel createNewUser(UserModel user) {
		String un = user.getUsername();
		String pw = user.getPassword();
		String pass = null;
		try {
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery("SELECT * FROM users WHERE username LIKE '%" + un + "%';");
			Boolean exist = rs.next();
			stmt.close();
			if (!exist) {
				System.out.println(exist);
				UserModel newUser = createUserInDB(user);
				return newUser;
			}
		} catch (SQLException e) {
			System.out.println("not queried");
			e.printStackTrace();
		}
		user.setValid(false);
		return user;
	}

	private static UserModel createUserInDB(UserModel user) {
		try {
			user.setValid(true);
			Statement stmt = conn.createStatement();
			String sql = "INSERT INTO users (username, password) VALUES('" +
						user.getUsername() + "', '" + user.getPassword() + "');";
			stmt.executeUpdate(sql);
			stmt.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return user;
		
	}
}