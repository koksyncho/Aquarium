package com.vso.controllers;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.vso.models.CheckUserAndPass;
import com.vso.models.CreateNewUser;
import com.vso.models.UserModel;

/**
 * Servlet implementation class CreateNewUserServlet
 */
@WebServlet("/CreateNewUserServlet")
public class CreateNewUserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CreateNewUserServlet() {
        super();
        // TODO Auto-generated constructor stub
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
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		UserModel user = new UserModel();
		user.setUsername(request.getParameter("username"));
		user.setPassword(request.getParameter("password"));
		user = CreateNewUser.createNewUser(user);

		if (user.isValid()) {
			RequestDispatcher redirect = request.getRequestDispatcher("index.jsp");
			redirect.forward(request, response);
		} else {
			RequestDispatcher view = request.getRequestDispatcher("/WEB-INF/JSPs/createNewUser.jsp");
			view.forward(request, response);
		}
	}

}