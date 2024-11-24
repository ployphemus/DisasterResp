<!-- REPO LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ployphemus/DisasterResp">
    <img src="public/logo.png" alt="Logo" width="80" height="80">
  </a>
  <h1 align="center">Shelter Safe</h1>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About Project</a>
      <ul>
        <li><a href="#tech">Tech Stack</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
     <a href="#routes">Routes Information</a>
    </il>
  </ol>
</details>

<!-- About Project -->
<div id="about">
	<h2>About Project</h2>
	<p><b>Why:</b> Disaster response management is a crucial field where timely and accurate decision-making can save lives and mitigate damages. This project aims to address the challenges of effective disaster response by developing a comprehensive system to assist emergency personnel and affected individuals during a disaster. Many existing systems lack centralized coordination or fail to effectively integrate various stakeholders involved in a disaster response. This project seeks to fill this gap by utilizing modern technology to improve preparedness and facilitate efficient disaster response.</p>
	<p><b>What: </b>The goal of the project is to create an effective Disaster Response Management system that serves as a central platform for coordinating, managing, and responding to disaster events. The system will facilitate communication among emergency responders, enable information sharing, and ensure that resources are delivered to the right location at the right time. By enhancing the efficiency of disaster response through effective coordination and decision-making tools, the platform aims to reduce response times and ultimately save lives.</p>
	<p><b>How: </b>The project will be developed collaboratively using version control systems like GitHub, as well as communication tools like Discord, to ensure efficient teamwork among contributors. The focus is on developing a user-friendly platform that effectively manages different components of disaster response by integrating data collection, information dissemination, and coordination features.					</p>
</div>
<div id="tech">
		<h3>Tech Stack</h3>
		<div>
				<div>
					<a href="https://html.spec.whatwg.org/" target="_blank"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" height="100px" width="100px"/></a>
				</div>
				<div>
					<a href="https://www.w3.org/Style/CSS/Overview.en.html" target="_blank"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" height="100px" width="100px"/></a>
				</div>
				<div>
					<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" height="100px" width="100px"/></a>
				</div>
				<div>
					<a href="https://kotlinlang.org/" target="_blank"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg" height="100px" width="100px"/></a>
				</div>
				<div>
					<a href="https://www.sqlite.org/" target="_blank"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg" height="100px" width="100px"/></a>
				</div>
		</div>
</div>

<h2 id="getting-started">Getting Started</h2>
<h3 id="prerequisites">Prerequisites</h3>
<p> Download and install node.js from this link if you don't already have it set up: <a href="https://nodejs.org/en" target="_blank">Node.JS</a></p>

1. Clone the repo onto your machine

2. Open the cloned repo in VS Code

3. Open the terminal in VS Code and type this line in:

> npm install<br>
> This line will grab all the saved modules in the package.json and install the modules

<h3 id="installation">Installation</h3>

4. Once all the modules are installed. Stay in VS Code terminal and type this line in:

> npx nodemon OR npm start<br>
> This line should default to running nodemon on the server.js

5. Open this link in your browser:

> https://localhost:8000

6. Feel free to look around the webapp

> Login as admin to see both user and admin pages:
> email: a@e.com <br>
> pw: pass

7. To shut the server down, click onto the VS Code terminal and press:

> Ctrl+C

8. Press it twice to complete.

---

## Endpoints for the API

| Badge                                                                                                 | Definition                                         |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| ![Static Badge](https://img.shields.io/badge/User-Rendering?label=User%20Rendering&color=%231fcae5)   | User protected route, must be logged as yourself!  |
| ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31) | Admin protected route, must be logged as an admin! |
| ![Static Badge](https://img.shields.io/badge/Page-Rendering?label=Page%20Rendering&color=%23ffbf00)   | Page rendering route!                              |

If letters are together, it means either or!

<details>

<summary><h3>Auth Endpoints</h3></summary>

1. GET http://localhost:8000/auth/user-account ![Static Badge](https://img.shields.io/badge/User-Rendering?label=User%20Rendering&color=%231fcae5) ![Static Badge](https://img.shields.io/badge/Page-Rendering?label=Page%20Rendering&color=%23ffbf00)

> Response: HTML<br>
> This route is protected, you must be logged in as yourself on your account. This route is to view your account.

2. GET http://localhost:8000/auth/login ![Static Badge](https://img.shields.io/badge/Page-Rendering?label=Page%20Rendering&color=%23ffbf00)

> Response: HTML<br>
> This route is for rendering the login page.

3. GET http://localhost:8000/auth/register ![Static Badge](https://img.shields.io/badge/Page-Rendering?label=Page%20Rendering&color=%23ffbf00)

> Response: HTML<br>
> This route is for rendering the register page.

4. GET http://localhost:8000/auth/forgot-password ![Static Badge](https://img.shields.io/badge/Page-Rendering?label=Page%20Rendering&color=%23ffbf00)

> Response: HTML<br>
> This route is for rendering the forgot password page.

5. POST http://localhost:8000/auth/forgot-password-email

> Response: HTML or JSON<br>
> Body: JSON<br>
> This route is for calling a function related to resetting a password using forgot-password.

```json
Example: POST http://localhost:8000/auth/forgot-password-email
{
"Email": "johndoe@example.com"
}
```

> Success response: Redirected to login page or json: `{ message: "Password reset email sent" }` <br>
> Failure response: Redirected back to forgot-password page or json: `{ error: "Failed to initiate password reset" }` or json: `{ error: "User not found" }`

6. GET http://localhost:8000/auth/reset-password/:token ![Static Badge](https://img.shields.io/badge/User-Rendering?label=User%20Rendering&color=%231fcae5) ![Static Badge](https://img.shields.io/badge/Page-Rendering?label=Page%20Rendering&color=%23ffbf00)

> Response: HTML<br>
> Parameter: token<br>
> This route is for rendering the reset-password page but can only be accessed using token from forgot password email.

7. POST http://localhost:8000/auth/resetting-password ![Static Badge](https://img.shields.io/badge/Page-Rendering?label=Page%20Rendering&color=%23ffbf00)

> Response: HTML or JSON<br>
> Body: JSON<br>
> This route is for calling a function related to resetting the password called from the reset-password route. This route is protected and can't be called unless the token is present.

```json
Example: POST http://localhost:8000/auth/resetting-password
{
"token": "afjgskfgjslkjfgskjdfgsklfdjgfggd435",
"Password": "goldfisharecool"
}
```

> Success response (status 200): Redirected to login page or json: `{ message: "Password reset successful" }`<br>
> Failure response (status 400): Redirected to login page or json: `{ error: "Token and password are required" }`<br>
> Failure response (status 404): Redirected to login page or json: `{ error: "Invalid or expired reset token" }`<br>
> Failure response (status 500): Redirected to login page or json: `{ error: "Failed to reset password" }`

8. POST http://localhost:8000/auth/change-email/:id ![Static Badge](https://img.shields.io/badge/Page-Rendering?label=Page%20Rendering&color=%23ffbf00)

> Response: HTML or JSON<br>
> Parameters: id<br>
> Body: JSON<br>
> This route is for calling a function related to changing a user's email. This route is protected and can't be called/accessed unless the user is logged in and has entered their password.

```json
Example: POST http://localhost:8000/auth/change-email/1
{
"old_email": "johndoe@example.com",
"new_email": "johndoe@gmail.com",
"password": "goldfisharecool"
}
```

> Success response (status 200): Redirected to login page or previous page or json: `{ (USER INFO) }`<br>
> Failure response (status 401): json: `{ error: "Incorrect password" }`<br>
> Failure response (status 404): json: `{ error: "User not found" }`<br>
> Failure response (status 500): json: `{ error: "Failed to reset password" }`

9. POST http://localhost:8000/auth/change-password/:id ![Static Badge](https://img.shields.io/badge/Page-Rendering?label=Page%20Rendering&color=%23ffbf00)

> Response: HTML or JSON<br>
> Parameters: id<br>
> Body: JSON<br>
> This route is for calling a function related to changing a user's password. This route is protected and can't be called/accessed unless the user is logged in and has entered their password.

```json
Example: POST http://localhost:8000/auth/change-password/1
{
"password": "goldfisharecool",
"new_password": "goldfisharecool123"
}
```

> Success response (status 200): Redirected to login page or json: `{ (USER INFO) }` <br>
> Failure response (status 401): json: `{ error: "Incorrect current password" }`<br>
> Failure response (status 404): json: `{ error: "User not found" }`<br>
> Failure response (status 500): json: `{ error: "Failed to update user password" }`

10. POST http://localhost:8000/auth/login

> Response: HTML or JSON<br>
> Body: JSON<br>
> This route is logging into an account.

```json
Example: POST http://localhost:8000/auth/login
{
"Email": "johndoe@gmail.com",
"Password": "goldfisharecool123"
}
```

> Success response (status 200): Redirected to home page or json: `{
success: true,
status: "success",
code: "authorized",
}`<br>
> Failure response (status 401): Redirected to login page or json: `{ success: false, status: "error", code: "unauthorized" }`<br>
> Failure response (status 500): json: `{ success: false, status: "error", code: "server_error" }`

11. GET http://localhost:8000/auth/logout

> Response: HTML or JSON<br>
> This route is logging out of an account.<br>
> Success response (status 200): Redirected to login page or json: `{ status: "success", code: "logged out" }`<br>
> Failure response (status 401): json: `{ status: "error", code: "unauthorized" }`<br>
> Failure response (status 500): json: `{ status: "error", code: "server error", message: err.message }`

12. POST http://localhost:8000/auth/logout

> Response: HTML or JSON<br>
> This route is logging out of an account.<br>
> Success response (status 200): Redirected to login page or json: `{ status: "success", code: "logged out" }`<br>
> Failure response (status 401): json: `{ status: "error", code: "unauthorized" }`<br>
> Failure response (status 500): json: `{ status: "error", code: "server error", message: err.message }`

</details>

<details>

<summary><h3>User Endpoints</h3></summary>

1. GET http://localhost:8000/users/all ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31) ![Static Badge](https://img.shields.io/badge/Page-Rendering?label=Page%20Rendering&color=%23ffbf00)

> Response: HTML or JSON<br>
> This route is protected, you must be logged in as an admin. This route is for admins to view all accounts.<br>
> Success response (status 200): Page renders with all accounts or json: `{ (users) }`<br>
> Failure response (status 500): json: `{ error: "Failed to fetch users" }`

2. GET http://localhost:8000/users/admin/dashboard ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31) ![Static Badge](https://img.shields.io/badge/Page-Rendering?label=Page%20Rendering&color=%23ffbf00)

> Response: HTML<br>
> This route is protected, you must be logged in as an admin. This route is for admins to view their dashboard.<br>
> Success response (status 200): Dashboard page renders<br>
> Failure response (status 500): json: `{ error: "Failed to render admin dash" }`

3. GET http://localhost:8000/users/admin/shelters ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31) ![Static Badge](https://img.shields.io/badge/Page-Rendering?label=Page%20Rendering&color=%23ffbf00)

> Response: HTML or JSON<br>
> This route is protected, you must be logged in as an admin. This route is for admins to view all shelters with admin functions.<br>
> Success response (status 200): Admin shelter page renders or json: `{ shelters }`<br>
> Failure response (status 500): json: `{ error: "Failed to render admin shelters" }`

4. GET http://localhost:8000/users/admin/alerts ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31) ![Static Badge](https://img.shields.io/badge/Page-Rendering?label=Page%20Rendering&color=%23ffbf00)

> Response: HTML or JSON<br>
> This route is protected, you must be logged in as an admin. This route is for admins to view all alerts with admin functionality.<br>
> Success response (status 200): Admin alert page renders<br>
> Failure response (status 500): json: `{ error: "Failed to render admin alert" }`

5. GET http://localhost:8000/users/resources ![Static Badge](https://img.shields.io/badge/Page-Rendering?label=Page%20Rendering&color=%23ffbf00)

> Response: HTML or JSON<br>
> This route is view the resources page.<br>
> Success response (status 200): Resource page renders or json: `{ PAGE }`<br>
> Failure response (status 500): json: `{ error: "Failed to render user resource" }`

6. GET http://localhost:8000/users/:id ![Static Badge](https://img.shields.io/badge/User-Rendering?label=User%20Rendering&color=%231fcae5) ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Parameters: id<br>
> This route is protected, you must be logged in as the requested account or an admin. This route is used to retrieve the user's information.<br>
> Success response (status 200): json: `{ user }`<br>
> Failure response (status 500): json: `{ error: "Failed to fetch user" }`

7. GET http://localhost:8000/users/location/:id ![Static Badge](https://img.shields.io/badge/User-Rendering?label=User%20Rendering&color=%231fcae5) ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Parameters: id<br>
> This route is protected, you must be logged in as the requested account or an admin. This route is used to retrieve the user's location.<br>
> Success response (status 200): json: `{ location }`<br>
> Failure response (status 500): json: `{ error: "Failed to fetch user location" }`

8. POST http://localhost:8000/users/create

> Response: JSON <br>
> Body: JSON<br>
> This route is for creating a new user, although the account won't have the password encrypted. Therefore, they won't be able to login into that created account since the web app doesn't accept plain text passwords. This route is mostly used to create accounts for other people that can have their password reset if the user clicks forgot password.

```json
Example: POST http://localhost:8000/users/create
{
"First_Name": "John",
"Last_Name": "Doe",
"Password": "wateriswet",
"Latitude": 34.6543,
"Longitude": -76.3425,
"Email": "johndoe@hotmail.com"
}
```

> Note: First_Name, Last_Name, Latitude, and Longitude can be empty or null.<br>
> Success response (status 200): json: `{ user }`<br>
> Failure response (status 500): json: `{ error: "Failed to create user" }`

9. POST http://localhost:8000/users/createNewUser

> Response: HTML or JSON<br>
> Body: JSON<br>
> This route is for creating a new user which has password encryption.

```json
Example: POST http://localhost:8000/users/createNewUser
{
"First_Name": "Jane",
"Last_Name": "Doe",
"Password": "theskyisblue",
"Latitude": 34.6543,
"Longitude": -76.3425,
"Email": "janedoe@example.com"
}
```

> Note: First_Name, Last_Name, Latitude, and Longitude can be empty or null.<br>
> Success response (status 200): Redirected to login page or previous page or json: `{ user }`<br>
> Failure response (status 500): json: `{ error: "Failed to create user" }`

10. PUT http://localhost:8000/users/update/:id ![Static Badge](https://img.shields.io/badge/User-Rendering?label=User%20Rendering&color=%231fcae5) ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31) ![Static Badge](https://img.shields.io/badge/Page-Rendering?label=Page%20Rendering&color=%23ffbf00)

> Response: JSON<br>
> Body: JSON<br>
> Parameters: id<br>
> This route is protected, you must be logged in as the requested account or an admin. This route is used to update the user's information.

```json
Example: PUT http://localhost:8000/users/update/2
{
"First_Name": "Jane",
"Last_Name": "Doe",
"Password": "theskyisblue",
"Latitude": 34.6543432,
"Longitude": -76.34254325,
"Email": "janedoe@gmail.com"
}
```

> Note: First_Name, Last_Name, Latitude, and Longitude can be empty or null. This route doesn't encrypt passwords so the user can become locked out of their account.<br>
> Success response (status 200): json: `{ user }`<br>
> Failure response (status 500): json: `{ error: "Failed to update user" }`

11. PUT http://localhost:8000/users/updateLocation/:id ![Static Badge](https://img.shields.io/badge/User-Rendering?label=User%20Rendering&color=%231fcae5) ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31) ![Static Badge](https://img.shields.io/badge/Page-Rendering?label=Page%20Rendering&color=%23ffbf00)

> Response: JSON<br>
> Body: JSON<br>
> Parameters: id<br>
> This route is protected, you must be logged in as the requested account or an admin. This route is used to update the user's location.

```json
Example: PUT http://localhost:8000/users/updateLocation/2
{
"Latitude": 38.6543432,
"Longitude": -73.34254325
}
```

> Note: First_Name, Last_Name, Latitude, and Longitude can be empty or null. This route doesn't encrypt passwords so the user can become locked out of their account.<br>
> Success response (status 200): json: `{ user }`<br>
> Failure response (status 500): json: `{ error: "Failed to update user" }`

12. DELETE http://localhost:8000/users/delete/:id ![Static Badge](https://img.shields.io/badge/User-Rendering?label=User%20Rendering&color=%231fcae5) ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Parameters: id<br>
> This route is protected, you must be logged in as the requested account or an admin. This route is used to delete a user's account.

```json
Example: DELETE http://localhost:8000/users/delete/2
```

> Success response (status 200): json: `{ user }`<br>
> Failure response (status 500): json: `{ error:  "Failed to delete user" }`

13. GET http://localhost:8000/users/delete/:id ![Static Badge](https://img.shields.io/badge/User-Rendering?label=User%20Rendering&color=%231fcae5) ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Parameters: id<br>
> This route is protected, you must be logged in as the requested account or an admin. This route is used to delete a user's account.

```json
Example: DELETE http://localhost:8000/users/delete/2
```

> Success response (status 200): json: `{ user }`<br>
> Failure response (status 500): json: `{ error:  "Failed to delete user" }`

14. POST http://localhost:8000/users/deleteuser/:id ![Static Badge](https://img.shields.io/badge/User-Rendering?label=User%20Rendering&color=%231fcae5) ![Static Badge](https://img.shields.io/badge/Page-Rendering?label=Page%20Rendering&color=%23ffbf00)

> Response: JSON<br>
> Parameters: id<br>
> Body: JSON<br>
> This route is protected, you must be logged in as the requested account. This route is used to delete a user's account.

```json
Example: POST http://localhost:8000/users/deleteuser/2
{
"password": "theskyisblue"
}
```

> Success response (status 200): Redirected to register page or json: `{ message:  "Account successfully deleted" }`<br>
> Failure response (status 401): Redirected to login page or json: `{ error:  "Incorrect password" }`<br>
> Failure response (status 404): Redirected to login page or json: `{ error:  "User not found" }`<br>
> Failure response (status 500): Redirected to login page or json: `{ error:  "Failed to delete account" }`

15. GET http://localhost:8000/users/email/:email ![Static Badge](https://img.shields.io/badge/User-Rendering?label=User%20Rendering&color=%231fcae5) ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Parameters: email<br>
> Body: JSON<br>
> This route is protected, you must be logged in as the requested account. This route is used to get a user's email.

```json
Example: GET http://localhost:8000/users/email/johndoe@example.com
```

> Success response (status 200): json: `{ user }`<br>
> Failure response (status 500): json: `{ error:  "Failed to fetch user" }`

16. GET http://localhost:8000/users/userType/:id ![Static Badge](https://img.shields.io/badge/User-Rendering?label=User%20Rendering&color=%231fcae5) ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Parameters: id<br>
> Body: JSON<br>
> This route is protected, you must be logged in as the requested account. This route is used to get the user type.

```json
Example: GET http://localhost:8000/users/userType/1
```

> Success response (status 200): json: `{ user }`<br>
> Failure response (status 500): json: `{ error:  "Failed to fetch user type" }`

</details>

<details>

<summary><h3>Shelter Endpoints</h3></summary>

1. GET http://localhost:8000/shelters/all

> Response: JSON<br>
> This route is used to view all shelters.

```json
Example: GET http://localhost:8000/shelters/all
```

> Success response (status 200): json: `{ shelter }`<br>
> Failure response (status 500): json: `{ error:  "Failed to fetch Shelters" }`

2. GET http://localhost:8000/shelters/allSheltersAndDisasterZones ![Static Badge](https://img.shields.io/badge/Page-Rendering?label=Page%20Rendering&color=%23ffbf00)

> Response: HTML or JSON<br>
> Body: JSON<br>
> This route is used to view all shelters with its corresponding disaster zone.

```json
Example: GET http://localhost:8000/shelters/allSheltersAndDisasterZones
```

> Success response (status 200): Renders user shelters page or json: `{ shelters }`<br>
> Failure response (status 500): json: `{ error:  "Failed to fetch Shelters" }`

3. GET http://localhost:8000/shelters/getlocation/:id

> Response: JSON<br>
> Parameters: id<br>
> This route is used to retrieve a shelter's location.

```json
Example: GET http://localhost:8000/shelters/getlocation/1
```

> Success response (status 200): json: `{ shelter }`<br>
> Failure response (status 500): json: `{ error:  "Failed to fetch Shelter" }`

4. GET http://localhost:8000/shelters/getlocationandaddress/:id

> Response: JSON<br>
> Parameters: id<br>
> This route is used to retrieve a shelter's location and address.

```json
Example: GET http://localhost:8000/shelters/getlocationandaddress/1
```

> Success response (status 200): json: `{ shelter }`<br>
> Failure response (status 500): json: `{ error:  "Failed to fetch Shelter" }`

5. GET http://localhost:8000/shelters/:id

> Response: JSON<br>
> Parameters: id<br>
> This route is used to retrieve a shelter's information.

```json
Example: GET http://localhost:8000/shelters/1
```

> Success response (status 200): json: `{ shelter }`<br>
> Failure response (status 500): json: `{ error:  "Failed to fetch Shelter" }`

6. POST http://localhost:8000/shelters/createShelter ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Body: JSON<br>
> This route is protected, you must be logged in as an admin. This route is used to create a shelter.

```json
Example: POST http://localhost:8000/shelters/createShelter
{
"Name": "UNC-Greensboro",
"Latitude": 36.06890789191789,
"Longitude": -79.81034244273471,
"Shelter_address": "1400 Spring Garden St, Greensboro, NC 27412",
"Maximum_Capacity": 3000,
"Current_Capacity": 12,
"disasterzone_id": 1
}
```

> Note: Any part can be null except for disasterzone_id.<br>
> Success response (status 200): json: `{ shelter }`<br>
> Failure response (status 500): json: `{ error:  "Failed to create Shelter" }`

7. PUT http://localhost:8000/shelters/updateShelterCapByID/:id

> Response: JSON<br>
> Parameters: id<br>
> Body: JSON<br>
> This route used to update the shelter capacity.

```json
Example: PUT http://localhost:8000/shelters/updateShelterCapByID/1
{
"Current_Capacity": 343
}
```

> Success response (status 200): json: `{ shelter }`<br>
> Failure response (status 500): json: `{ error:  "Failed to update Shelter" }`

8. PUT http://localhost:8000/shelters/updateShelterByID/:id ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Parameters: id<br>
> Body: JSON<br>
> This route is protected, you must be logged in as an admin. This route is used to update the shelter.

```json
Example: PUT http://localhost:8000/shelters/updateShelterByID/1
{
"Name": "UNC-Greensboro",
"Latitude": 36.06890719,
"Longitude": -79.8103471,
"Shelter_address": "1400 Spring Garden St, Greensboro, NC 27412",
"Maximum_Capacity": 3050,
"Current_Capacity": 599,
"disasterzone_id": 1
}
```

> Note: Any part can be null except for disasterzone_id.<br>
> Success response (status 200): json: `{ shelter }`<br>
> Failure response (status 500): json: `{ error:  "Failed to update Shelter" }`

9. DELETE http://localhost:8000/shelters/deleteShelterByID/:id ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Parameters: id<br>
> Body: JSON<br>
> This route is protected, you must be logged in as an admin. This route is used to delete the shelter.

```json
Example: PUT http://localhost:8000/shelters/deleteShelterByID/1
```

> Success response (status 200): json: `{ shelter }`<br>
> Failure response (status 500): json: `{ error:  "Failed to delete Shelter" }`

</details>

<details>

<summary><h3>Disaster Endpoints</h3></summary>

1. GET http://localhost:8000/disasters/wildfires/:date ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON or CSV<br>
> Parameters: id<br>
> Body: JSON<br>
> This route is protected, you must be logged in as an admin. This route is used to get the wildfire data for a date.

```json
Example: GET http://localhost:8000/disasters/wildfires/2024-11-20
```

> Success response (status 200): CSV<br>
> Failure response (status 400): json: `{ error:  "Invalid date format. Use YYYY-MM-DD" }` or json: `{ error:  "Cannot request future dates" }`<br>
> Failure response (status 500): json: `{ error:  error.message }`

2. GET http://localhost:8000/disasters/wildfires/recent/week ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Parameters: id<br>
> Body: JSON<br>
> This route is protected, you must be logged in as an admin. This route is used to get the wildfire data for a date.

```json
Example: GET http://localhost:8000/disasters/wildfires/recent/week
```

> Success response (status 200): json: `{ allData }`<br>
> Failure response (status 500): json: `{ error:  error.message }`

</details>

<details>

<summary><h3>Disaster Zone Endpoints</h3></summary>

1. GET http://localhost:8000/disasterzone/all

> Response: JSON<br>
> This route is used to view all disaster zones.

```json
Example: GET http://localhost:8000/disasterzone/all
```

> Success response (status 200): json: `{ disasterzones }`<br>
> Failure response (status 500): json: `{ error:  "Failed to fetch disasterzones" }`

2. GET http://localhost:8000/disasterzone/:id

> Response: JSON<br>
> This route is used to retrieve information about a disaster zone.

```json
Example: GET http://localhost:8000/disasterzone/1
```

> Success response (status 200): json: `{ disasterzone }`<br>
> Failure response (status 500): json: `{ error:  "Failed to fetch disasterzone" }`

3. POST http://localhost:8000/disasterzone/create ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Body: JSON<br>
> This route is protected, you must be logged in as an admin. This route is used to create a disaster zone.

```json
Example: POST http://localhost:8000/disasterzone/create
{
"Name": "UNC-Greensboro",
"Latitude": 36.06890719,
"Longitude": -79.8103471,
"Radius": 10,
"HexColor": "ffffff"
}
```

> Note: Any part can be null.<br>
> Success response (status 200): json: `{ response }`<br>
> Failure response (status 400): json: `{ success:  false, error:  "Missing required fields" }`<br>
> Failure response (status 500): json: `{ success:  false, error:  err.message  ||  "Failed to create disaster zone" }`

4. PUT http://localhost:8000/disasterzone/update/:id ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Parameters: id<br>
> Body: JSON<br>
> This route is protected, you must be logged in as an admin. This route is used to update the disaster zone.

```json
Example: PUT http://localhost:8000/disasterzone/update/1
{
"Name": "UNC-Greensboro",
"Latitude": 36.06890719,
"Longitude": -79.8103471,
"Radius": 15,
"HexColor": "fff00"
}
```

> Note: Any part can be null.<br>
> Success response (status 200): json: `{ disasterzone }`<br>
> Failure response (status 500): json: `{ error:  "Failed to update disasterzone" }`

5. DELETE http://localhost:8000/disasterzone/delete/:id ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Parameters: id<br>
> Body: JSON<br>
> This route is protected, you must be logged in as an admin. This route is used to delete the disaster zone.

```json
Example: DELETE http://localhost:8000/disasterzone/delete/1
```

> Success response (status 200): json: `{ disasterzone }`<br>
> Failure response (status 500): json: `{ error:  "Failed to delete disasterzone" }`

</details>

<details>

<summary><h3>Notifications Endpoints</h3></summary>

1. GET http://localhost:8000/notifications/all

> Response: JSON<br>
> Body: JSON<br>
> This route is used to get all notifications.

```json
Example: GET http://localhost:8000/notifications/all
```

> Success response (status 200): json: `{ notifications }`<br>
> Failure response (status 500): json: `{ error:  "Failed to fetch notifications" }`

2. GET http://localhost:8000/notifications/all/users

> Response: JSON<br>
> Body: JSON<br>
> This route is used to get all notification users.

```json
Example: GET http://localhost:8000/notifications/all/users
```

> Success response (status 200): json: `{ notificationUsers }`<br>
> Failure response (status 500): json: `{ error:  "Failed to fetch notification users" }`

3. GET http://localhost:8000/notifications/all/AdminId/:id

> Response: JSON<br>
> Parameters: id<br>
> Body: JSON<br>
> This route is used to get all notification created by an admin.

```json
Example: GET http://localhost:8000/notifications/all/AdminId/1
```

> Success response (status 200): json: `{ notifications }`<br>
> Failure response (status 500): json: `{ error:  "Failed to fetch notifications by admin ID" }`

4. GET http://localhost:8000/notifications/all/AdminId/

> Response: JSON<br>
> Body: JSON<br>
> This route is used to get all notification created by an admin.

```json
Example: GET http://localhost:8000/notifications/all/AdminId/
{
"id": 1
}
```

> Success response (status 200): json: `{ notifications }`<br>
> Failure response (status 500): json: `{ error:  "Failed to fetch notifications by admin ID" }`

5. GET http://localhost:8000/notifications/all/NotifId-w-users/:id

> Response: JSON<br>
> Parameters: id<br>
> Body: JSON<br>
> This route is used to get all notification with user info from the notification id.

```json
Example: GET http://localhost:8000/notifications/all/NotifId-w-users/1
```

> Success response (status 200): json: `{ notifications }`<br>
> Failure response (status 500): json: `{ error:  "Failed to fetch notifications by notification ID" }`

6. GET http://localhost:8000/notifications/all/NotifId-w-users/

> Response: JSON<br>
> Body: JSON<br>
> This route is used to get all notification with user info from the notification id.

```json
Example: GET http://localhost:8000/notifications/all/NotifId-w-users/
{
"id": 1
}
```

> Success response (status 200): json: `{ notifications }`<br>
> Failure response (status 500): json: `{ error:  "Failed to fetch notifications by notification ID" }`

7.  GET http://localhost:8000/notifications/all/NotifId-info/:id

> Response: JSON<br>
> Parameters: id<br>
> Body: JSON<br>
> This route is used to get all notification with user info and disaster zone info from the notification id.

```json
Example: GET http://localhost:8000/notifications/all/NotifId-info/1
```

> Success response (status 200): json: `{ notifications }`<br>
> Failure response (status 500): json: `{ error: "Failed to fetch notifications by notification ID with users and disasterzone" }`

8. GET http://localhost:8000/notifications/all/NotifId-info/

> Response: JSON<br>
> Body: JSON<br>
> This route is used to get all notification with user info and disaster zone info from the notification id.

```json
Example: GET http://localhost:8000/notifications/all/NotifId-w-users/
{
"id": 1
}
```

> Success response (status 200): json: `{ notifications }`<br>
> Failure response (status 500): json: `{ error: "Failed to fetch notifications by notification ID with users and disasterzone" }`

9. GET http://localhost:8000/notifications/all/DisasterId/:id

> Response: JSON<br>
> Parameters: id<br>
> Body: JSON<br>
> This route is used to get all notifications by using disaster zone id.

```json
> > Example: GET http://localhost:8000/notifications/all/DisasterId/1
```

> Success response (status 200): json: `{ notifications }`<br>
> Failure response (status 500): json: `{ error:  "Failed to fetch notifications by disaster ID" }`

10. GET http://localhost:8000/notifications/all/DisasterId/

> Response: JSON<br>
> Body: JSON<br>
> This route is used to get all notifications by using disaster zone id.

```json
Example: GET http://localhost:8000/notifications/all/DisasterId/
{
"id": 1
}
```

> Success response (status 200): json: `{ notifications }`<br>
> Failure response (status 500): json: `{ error:  "Failed to fetch notifications by disaster ID" }`

11. GET http://localhost:8000/notifications/all/DisasterId-info/:id

> Response: JSON<br>
> Parameters: id<br>
> Body: JSON<br>
> This route is used to get all notifications and user info by using disaster zone id.

```json
Example: GET http://localhost:8000/notifications/all/DisasterId-info/1
```

> Success response (status 200): json: `{ notifications }`<br>
> Failure response (status 500): json: `{ error: "Failed to fetch notifications by disaster ID with users and disasterzone" }`

12. GET http://localhost:8000/notifications/all/DisasterId-info/

> Response: JSON<br>
> Body: JSON<br>
> This route is used to get all notifications and user info by using disaster zone id.

```json
Example: GET http://localhost:8000/notifications/all/DisasterId-info/
{
"id": 1
}
```

> Success response (status 200): json: `{ notifications }`<br>
> Failure response (status 500): json: `{ error: "Failed to fetch notifications by disaster ID with users and disasterzone" }`

13. POST http://localhost:8000/notifications/create-notif ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Body: JSON<br>
> This route is protected, you must be logged in as an admin. This route is used to create a notification.

```json
Example: POST http://localhost:8000/notifications/create-notif
{
"Message": "THIS IS A TEST",
"AdminId": 1,
"DisasterzoneId": 1
}
```

> Success response (status 200): json: `{ notification }`<br>
> Failure response (status 500): json: `{ error:  "Failed to create notification" }`

14. POST http://localhost:8000/notifications/create-notif-broadcast ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Body: JSON<br>
> This route is protected, you must be logged in as an admin. This route is used to create a notification.

```json
Example: POST http://localhost:8000/notifications/create-notif-broadcast
{
"Message": "THIS IS A TEST",
"AdminId": 1,
"DisasterzoneId": 1
}
```

> Success response (status 200): json: `{ notification }`<br>
> Failure response (status 500): json: `{ error:  "Failed to create notification" }`

15. POST http://localhost:8000/notifications/create-notif-user ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Body: JSON<br>
> This route is protected, you must be logged in as an admin. This route is used to create a notification user.

```json
Example: POST http://localhost:8000/notifications/create-notif-user
{
"UserId": 1,
"NotificationId": 1
}
```

> Success response (status 200): json: `{ notificationUser }`<br>
> Failure response (status 500): json: `{ error:  "Failed to create notification user" }`

16. PUT http://localhost:8000/notifications/update-notif/:id ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Body: JSON<br>
> This route is protected, you must be logged in as an admin. This route is used to update a notification.

```json
Example: PUT http://localhost:8000/notifications/update-notif/1
{
"Message": "THIS IS TESTING TEST!",
"AdminId": 1
}
```

> Success response (status 200): json: `{ notification }`<br>
> Failure response (status 500): json: `{ error:  "Failed to update notification" }`

17. POST http://localhost:8000/notifications/update-notif/ ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Body: JSON<br>
> This route is protected, you must be logged in as an admin. This route is used to update a notification.

```json
Example: POST http://localhost:8000/notifications/update-notif/
{
"notificationId": 1,
"Message": "THIS IS TESTING TEST!",
"AdminId": 1
}
```

> Success response (status 200): json: `{ notification }`<br>
> Failure response (status 500): json: `{ error:  "Failed to update notification" }`

18. DELETE http://localhost:8000/notifications/delete-notif/:id ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Body: JSON<br>
> This route is protected, you must be logged in as an admin. This route is used to delete a notification.

```json
Example: DELETE http://localhost:8000/notifications/delete-notif/1
```

> Success response (status 200): json: `{ notification }`<br>
> Failure response (status 500): json: `{ error:  "Failed to delete notification" }`

19. DELETE http://localhost:8000/notifications/delete-notif/:id ![Static Badge](https://img.shields.io/badge/Admin-Rendering?label=Admin%20Rendering&color=%23e51f31)

> Response: JSON<br>
> Body: JSON<br>
> This route is protected, you must be logged in as an admin. This route is used to delete a notification.

```json
Example: GET http://localhost:8000/notifications/delete-notif/1
```

> Success response (status 200): json: `{ notification }`<br>
> Failure response (status 500): json: `{ error:  "Failed to delete notification" }`

</details>
