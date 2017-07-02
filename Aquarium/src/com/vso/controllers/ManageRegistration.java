package com.vso.controllers;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.vso.models.*;
import com.vso.*;

/**
 * Servlet implementation class ManageRegistration
 */
@WebServlet(urlPatterns = "/ManageRegistration")
public class ManageRegistration extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection conn;
	static String dbName = "onlinePlatform";
	static String password = "";

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ManageRegistration() {
		setupDBConnection();
	}

	public void setupDBConnection() {

		try {
			String uri = "jdbc:mysql://localhost:8080/" + dbName + "?autoReconnect=true&relaxAutoCommit=true";
			Properties loginDB = setLoginForDB();
			Class.forName("com.mysql.jdbc.Driver");
			conn = DriverManager.getConnection(uri, loginDB);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public Properties setLoginForDB() {
		Properties loginData = new Properties();
		loginData.setProperty("user", "root");
		loginData.setProperty("password", password);
		return loginData;
	}
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */

	
	public boolean checkIfTheUsernameIsUnique(String username) {
		boolean isTheUsernameUnique = true;
		
		try {
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery("SELECT * FROM users");

			while (rs.next()) {
				String usernameInDB = rs.getString("username");

				if (usernameInDB.equals(username)) {
					isTheUsernameUnique = false;
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return isTheUsernameUnique;
	}

	public void insertRow(String username, String email, String password) {
		if (checkIfTheUsernameIsUnique(username)) {
			System.out.println(username + ", you registered successfully!");
		
			try {
				Statement stmt = conn.createStatement();
				String sql = "INSERT INTO users (username, email, password) VALUES('" + username + "', '" + email
						+ "', '" + password + "');";
				stmt.executeUpdate(sql);
				stmt.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
			
		} else {
			System.out.println("The username is currently in use by someone else.");
		}
		
	}

	
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// PrintWriter out = response.getWriter();
		String userName = request.getParameter("username");
		String email = request.getParameter("email");
		String password = request.getParameter("password");
		boolean wasTheRegistrationSuccessful = checkIfTheUsernameIsUnique(userName); 
		insertRow(userName, email, password);
		request.setAttribute("RegistrationResult", wasTheRegistrationSuccessful);
		RequestDispatcher view = request.getRequestDispatcher("WEB-INF/JSPs/RegistrationResults.jsp");
		view.forward(request, response);
	}

}
