<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<link rel="stylesheet" href="css/userEntrance.css" type="text/css">
		<title> User Entry </title>
	</head>

	<body>
	<div id="outer">
	  <div id="middle">
	    <div id="inner">
		
		<form method="post" action="checkforvalidlogin">
			<table>

			<th>
				<td colspan='2' id="title-text">
					Login
				</td>
			<th>

			<tr>
				<td>
					Username:
				</td>

				<td>
					<input type="text" name="username" id="username" required>
				</td>
			</tr>

			<tr>
				<td>
					Password:
				</td>

				<td>
					<input type="text" name="password" id="password" required>
				</td>
			</tr>

			<tr>
				<td colspan="2">
					<input type="submit" class="button" value="Log in" />
				</td>
			</tr>

			</table>
		</form>
		
		</div>
	  </div>
	</div>
	</body>
</html>
