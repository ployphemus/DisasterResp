# DisasterResponse

## Instructions

!! Please download and install node.js from this link if you don't already have it set up: https://nodejs.org/en !!

1. Clone the repo onto your machine

2. Open the cloned repo in VS Code

3. Open the terminal in VS Code and type this line in:

> npm install<br>

> This line will grab all the saved modules in the package.json and install the modules

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

1. Press it twice to complete.

---

## Endpoints for the API

🆄 - User protected route, must be logged as yourself!
🅰 - Admin protected route, must be logged as an admin!
🆁 - Render page route!
If letters are together, it means either or!

<details>

<summary><h3>Auth Endpoints</h3></summary>

1. GET http://localhost:8000/auth/user-account 🆄🆁

> Response: HTML
> This route is protected, you must be logged in as yourself on your account. This route is to view your account.

2. GET http://localhost:8000/auth/login 🆁

> Response: HTML
> This route is for rendering the login page.

3. GET http://localhost:8000/auth/register 🆁

> Response: HTML
> This route is for rendering the register page.

4. GET http://localhost:8000/auth/forgot-password 🆁

> Response: HTML
> This route is for rendering the forgot password page.

5. POST http://localhost:8000/auth/forgot-password-email

> Response: HTML or JSON
> Body: JSON
> This route is for calling a function related to resetting a password using forgot-password.
>
> >Example: POST http://localhost:8000/auth/forgot-password-email
> > {
> "Email: johndoe@example.com
> > }
>
> Success response: Redirected to login page or json: `{ message: "Password reset email sent" }`
> Failure response: Redirected back to forgot-password page or json: `{ error: "Failed to initiate password reset" }` or json: `{ error: "User not found" }`

6. GET http://localhost:8000/auth/reset-password/:token 🆄🆁

> Response: HTML
> Parameter: token
> This route is for rendering the reset-password page but can only be accessed using token from forgot password email.

7. POST http://localhost:8000/auth/resetting-password 🆄

> Response: HTML or JSON
> Body: JSON
> This route is for calling a function related to resetting the password called from the reset-password route. This route is protected and can't be called unless the token is present.
>
> >Example: POST http://localhost:8000/auth/resetting-password
> > {
> "token: afjgskfgjslkjfgskjdfgsklfdjgfggd435,
> "Password": "goldfisharecool"
> > }
>
> Success response (status 200): Redirected to login page or json: `{ message: "Password reset successful" }`
> Failure response (status 400): Redirected to login page or json: `{ error: "Token and password are required" }`
> Failure response (status 404): Redirected to login page or json: `{ error: "Invalid or expired reset token" }`
> Failure response (status 500): Redirected to login page or json: `{ error: "Failed to reset password" }`

8. POST http://localhost:8000/auth/change-email/:id 🆄

> Response: HTML or JSON
> Parameters: id
> Body: JSON
> This route is for calling a function related to changing a user's email. This route is protected and can't be called/accessed unless the user is logged in and has entered their password.
>
> >Example: POST http://localhost:8000/auth/change-email/1
> > {
> "old_email: "johndoe@example.com",
> "new_email: "johndoe@gmail.com",
> "password": "goldfisharecool"
> > }
>
> Success response (status 200): Redirected to login page or previous page or json: `{ (USER INFO) }`
> Failure response (status 401): json: `{ error: "Incorrect password" }`
> Failure response (status 404): json: `{ error: "User not found" }`
> Failure response (status 500): json: `{ error: "Failed to reset password" }`

9. POST http://localhost:8000/auth/change-password/:id 🆄

> Response: HTML or JSON
> Parameters: id
> Body: JSON
> This route is for calling a function related to changing a user's password. This route is protected and can't be called/accessed unless the user is logged in and has entered their password.
>
> >Example: POST http://localhost:8000/auth/change-password/1
> > {
> "password": "goldfisharecool"
> "new_password": "goldfisharecool123"
> > }
>
> Success response (status 200): Redirected to login page or json: `{ (USER INFO) }`
> Failure response (status 401): json: `{ error: "Incorrect current password" }`
> Failure response (status 404): json: `{ error: "User not found" }`
> Failure response (status 500): json: `{ error: "Failed to update user password" }`

10. POST http://localhost:8000/auth/login

> Response: HTML or JSON
> Body: JSON
> This route is logging into an account.
>
> >Example: POST http://localhost:8000/auth/login
> > {
> "Email": "johndoe@gmail.com"
> "Password": "goldfisharecool123"
> > }
>
> Success response (status 200): Redirected to home page or json: `{
success: true,
status: "success",
code: "authorized",
}`
> Failure response (status 401): Redirected to login page or json: `{ success: false, status: "error", code: "unauthorized" }`
> Failure response (status 500): json: `{ success: false, status: "error", code: "server_error" }`

11. GET http://localhost:8000/auth/logout

> Response: HTML or JSON
> This route is logging out of an account.
> Success response (status 200): Redirected to login page or json: `{ status: "success", code: "logged out" }`
> Failure response (status 401): json: `{ status: "error", code: "unauthorized" }`
> Failure response (status 500): json: `{ status: "error", code: "server error", message: err.message }`

12. POST http://localhost:8000/auth/logout

> Response: HTML or JSON
> This route is logging out of an account.
> Success response (status 200): Redirected to login page or json: `{ status: "success", code: "logged out" }`
> Failure response (status 401): json: `{ status: "error", code: "unauthorized" }`
> Failure response (status 500): json: `{ status: "error", code: "server error", message: err.message }`

</details>

<details>

<summary><h3>User Endpoints</h3></summary>

1. GET http://localhost:8000/users/all 🅰🆁

> Response: HTML or JSON
> This route is protected, you must be logged in as an admin. This route is for admins to view all accounts.
> Success response (status 200): Page renders with all accounts or json: `{ (users) }`
> Failure response (status 500): json: `{ error: "Failed to fetch users" }`

2. GET http://localhost:8000/users/admin/dashboard 🅰🆁

> Response: HTML
> This route is protected, you must be logged in as an admin. This route is for admins to view their dashboard.
> Success response (status 200): Dashboard page renders
> Failure response (status 500): json: `{ error: "Failed to render admin dash" }`

3. GET http://localhost:8000/users/admin/shelters 🅰🆁

> Response: HTML or JSON
> This route is protected, you must be logged in as an admin. This route is for admins to view all shelters with admin functions.
> Success response (status 200): Admin shelter page renders or json: `{ shelters }`
> Failure response (status 500): json: `{ error: "Failed to render admin shelters" }`

4. GET http://localhost:8000/users/admin/alerts 🅰🆁

> Response: HTML or JSON
> This route is protected, you must be logged in as an admin. This route is for admins to view all alerts with admin functionality.
> Success response (status 200): Admin alert page renders
> Failure response (status 500): json: `{ error: "Failed to render admin alert" }`

5. GET http://localhost:8000/users/resources 🆁

> Response: HTML or JSON
> This route is view the resources page.
> Success response (status 200): Resource page renders or json: `{ PAGE }`
> Failure response (status 500): json: `{ error: "Failed to render user resource" }`

6. GET http://localhost:8000/users/:id 🆄🅰

> Response: JSON
> Parameters: id
> This route is protected, you must be logged in as the requested account or an admin. This route is used to retrieve the user's information.
> Success response (status 200): json: `{ user }`
> Failure response (status 500): json: `{ error: "Failed to fetch user" }`

7. GET http://localhost:8000/users/location/:id 🆄🅰

> Response: JSON
> Parameters: id
> This route is protected, you must be logged in as the requested account or an admin. This route is used to retrieve the user's location.
> Success response (status 200): json: `{ location }`
> Failure response (status 500): json: `{ error: "Failed to fetch user location" }`

8. POST http://localhost:8000/users/create

> Response: JSON
> Body: JSON
> This route is for creating a new user, although the account won't have the password encrypted. Therefore, they won't be able to login into that created account since the web app doesn't accept plain text passwords. This route is mostly used to create accounts for other people that can have their password reset if the user clicks forgot password.
>
> >Example: POST http://localhost:8000/users/create
> > {
> "First_Name: "John",
> "Last_Name: "Doe",
> "Password": "wateriswet",
> "Latitude": 34.6543,
> "Longitude": -76.3425,
> "Email": "johndoe@hotmail.com"
> > }
>
> Note: First_Name, Last_Name, Latitude, and Longitude can be empty or null.
> Success response (status 200): json: `{ user }`
> Failure response (status 500): json: `{ error: "Failed to create user" }`

9. POST http://localhost:8000/users/createNewUser

> Response: HTML or JSON
> Body: JSON
> This route is for creating a new user which has password encryption.
>
> >Example: POST http://localhost:8000/users/createNewUser
> > {
> "First_Name: "Jane",
> "Last_Name: "Doe",
> "Password": "theskyisblue",
> "Latitude": 34.6543,
> "Longitude": -76.3425,
> "Email": "janedoe@example.com"
> > }
>
> Note: First_Name, Last_Name, Latitude, and Longitude can be empty or null.
> Success response (status 200): Redirected to login page or previous page or json: `{ user }`
> Failure response (status 500): json: `{ error: "Failed to create user" }`

10. PUT http://localhost:8000/users/update/:id 🆄🅰🆁

> Response: JSON
> Body: JSON
> Parameters: id
> This route is protected, you must be logged in as the requested account or an admin. This route is used to update the user's information.
>
> >Example: PUT http://localhost:8000/users/update/2
> > {
> "First_Name: "Jane",
> "Last_Name: "Doe",
> "Password": "theskyisblue",
> "Latitude": 34.6543432,
> "Longitude": -76.34254325,
> "Email": "janedoe@gmail.com"
> > }
>
> Note: First_Name, Last_Name, Latitude, and Longitude can be empty or null. This route doesn't encrypt passwords so the user can become locked out of their account.
> Success response (status 200): json: `{ user }`
> Failure response (status 500): json: `{ error: "Failed to update user" }`

11. PUT http://localhost:8000/users/updateLocation/:id 🆄🅰🆁

> Response: JSON
> Body: JSON
> Parameters: id
> This route is protected, you must be logged in as the requested account or an admin. This route is used to update the user's location.
>
> >Example: PUT http://localhost:8000/users/updateLocation/2
> > {
> "Latitude": 38.6543432,
> "Longitude": -73.34254325
> > }
>
> Note: First_Name, Last_Name, Latitude, and Longitude can be empty or null. This route doesn't encrypt passwords so the user can become locked out of their account.
> Success response (status 200): json: `{ user }`
> Failure response (status 500): json: `{ error: "Failed to update user" }`
12. DELETE http://localhost:8000/users/delete/:id 🆄🅰

> Response: JSON
> Parameters: id
> This route is protected, you must be logged in as the requested account or an admin. This route is used to delete a user's account.
>
> >Example: DELETE http://localhost:8000/users/delete/2
>
> Success response (status 200): json: `{ user }`
> Failure response (status 500): json: `{ error:  "Failed to delete user" }`
13. GET http://localhost:8000/users/delete/:id 🆄🅰

> Response: JSON
> Parameters: id
> This route is protected, you must be logged in as the requested account or an admin. This route is used to delete a user's account.
>
> >Example: GET http://localhost:8000/users/delete/2
>
> Success response (status 200): json: `{ user }`
> Failure response (status 500): json: `{ error:  "Failed to delete user" }`
14. POST http://localhost:8000/users/deleteuser/:id 🆄🆁

> Response: JSON
> Parameters: id
> Body: JSON
> This route is protected, you must be logged in as the requested account. This route is used to delete a user's account.
>
> >Example: POST http://localhost:8000/users/deleteuser/2
> > {
> "password": "theskyisblue"
> > }
>
> Success response (status 200): Redirected to register page or json: `{ message:  "Account successfully deleted" }`
> Failure response (status 401): Redirected to login page or json: `{ error:  "Incorrect password" }`
> Failure response (status 404): Redirected to login page or json: `{ error:  "User not found" }`
> Failure response (status 500): Redirected to login page or json: `{ error:  "Failed to delete account" }`
15. GET http://localhost:8000/users/email/:email 🆄🅰

> Response: JSON
> Parameters: email
> Body: JSON
> This route is protected, you must be logged in as the requested account. This route is used to get a user's email.
>
> >Example: GET http://localhost:8000/users/email/johndoe@example.com
> 
> Success response (status 200): json: `{ user }`
> Failure response (status 500): json: `{ error:  "Failed to fetch user" }`
16. GET http://localhost:8000/users/userType/:id 🆄🅰

> Response: JSON
> Parameters: id
> Body: JSON
> This route is protected, you must be logged in as the requested account. This route is used to get the user type.
>
> >Example: GET http://localhost:8000/users/userType/1
> 
> Success response (status 200): json: `{ user }`
> Failure response (status 500): json: `{ error:  "Failed to fetch user type" }`
</details>

<details>

<summary><h3>Shelter Endpoints</h3></summary>

1. GET http://localhost:8000/shelters/all 

> Response: JSON
> This route is used to view all shelters.
>
> >Example: GET http://localhost:8000/shelters/all 
> 
> Success response (status 200): json: `{ shelter }`
> Failure response (status 500): json: `{ error:  "Failed to fetch Shelters" }`
2. GET http://localhost:8000/shelters/allSheltersAndDisasterZones 🆁

> Response: HTML or JSON
> Body: JSON
> This route is used to view all shelters with its corresponding disaster zone.
>
> >Example: GET http://localhost:8000/shelters/allSheltersAndDisasterZones
>
> Success response (status 200): Renders user shelters page or json: `{ shelters }`
> Failure response (status 500): json: `{ error:  "Failed to fetch Shelters" }`
3. GET http://localhost:8000/shelters/getlocation/:id

> Response: JSON
> Parameters: id
> This route is used to retrieve a shelter's location.
>
> >Example: GET http://localhost:8000/shelters/getlocation/1 
> 
> Success response (status 200): json: `{ shelter }`
> Failure response (status 500): json: `{ error:  "Failed to fetch Shelter" }`
4. GET http://localhost:8000/shelters/getlocationandaddress/:id

> Response: JSON
> Parameters: id
> This route is used to retrieve a shelter's location and address. 
>
> >Example: GET http://localhost:8000/shelters/getlocationandaddress/1 
> 
> Success response (status 200): json: `{ shelter }`
> Failure response (status 500): json: `{ error:  "Failed to fetch Shelter" }`
5. GET http://localhost:8000/shelters/:id

> Response: JSON
> Parameters: id
> This route is used to retrieve a shelter's information. 
>
> >Example: GET http://localhost:8000/shelters/1 
> 
> Success response (status 200): json: `{ shelter }`
> Failure response (status 500): json: `{ error:  "Failed to fetch Shelter" }`
6. POST http://localhost:8000/shelters/createShelter 🅰

> Response: JSON
> Body: JSON
> This route is protected, you must be logged in as an admin. This route is used to create a shelter. 
>
> >Example: POST http://localhost:8000/shelters/createShelter 
> > {
> "Name": "UNC-Greensboro",
> "Latitude": 36.06890789191789, 
> "Longitude": -79.81034244273471,
> "Shelter_address": "1400 Spring Garden St, Greensboro, NC 27412",
> "Maximum_Capacity": 3000,
> "Current_Capacity": 12,
> "disasterzone_id": 1
> > }
>
> Note: Any part can be null except for disasterzone_id.
> Success response (status 200): json: `{ shelter }`
> Failure response (status 500): json: `{ error:  "Failed to create Shelter" }`
7. PUT http://localhost:8000/shelters/updateShelterCapByID/:id

> Response: JSON
> Parameters: id
> Body: JSON
> This route used to update the shelter capacity. 
>
> >Example: PUT http://localhost:8000/shelters/updateShelterCapByID/1
> > {
> "Current_Capacity": 343
> > }
>
> Success response (status 200): json: `{ shelter }`
> Failure response (status 500): json: `{ error:  "Failed to update Shelter" }`
8. PUT http://localhost:8000/shelters/updateShelterByID/:id 🅰

> Response: JSON
> Parameters: id
> Body: JSON
> This route is protected, you must be logged in as an admin. This route is used to update the shelter. 
>
> >Example: PUT http://localhost:8000/shelters/updateShelterByID/1
> > {
> "Name": "UNC-Greensboro",
> "Latitude": 36.06890719, 
> "Longitude": -79.8103471,
> "Shelter_address": "1400 Spring Garden St, Greensboro, NC 27412",
> "Maximum_Capacity": 3050,
> "Current_Capacity": 599,
> "disasterzone_id": 1
> > }
>
> Note: Any part can be null except for disasterzone_id.
> Success response (status 200): json: `{ shelter }`
> Failure response (status 500): json: `{ error:  "Failed to update Shelter" }`
9. DELETE http://localhost:8000/shelters/deleteShelterByID/:id 🅰

> Response: JSON
> Parameters: id
> Body: JSON
> This route is protected, you must be logged in as an admin. This route is used to delete the shelter. 
>
> >Example: PUT http://localhost:8000/shelters/deleteShelterByID/1
>
> Success response (status 200): json: `{ shelter }`
> Failure response (status 500): json: `{ error:  "Failed to delete Shelter" }`
</details>

<details>

<summary><h3>Disaster Endpoints</h3></summary>

1. GET http://localhost:8000/disasters/wildfires/:date 🅰

> Response: JSON or CSV
> Parameters: id
> Body: JSON
> This route is protected, you must be logged in as an admin. This route is used to get the wildfire data for a date. 
>
> >Example: GET http://localhost:8000/disasters/wildfires/2024-11-20
>
> Success response (status 200): CSV
> Failure response (status 400): json: `{ error:  "Invalid date format. Use YYYY-MM-DD" }` or json: `{ error:  "Cannot request future dates" }`
> Failure response (status 500): json: `{ error:  error.message }`
2. GET http://localhost:8000/disasters/wildfires/recent/week 🅰

> Response: JSON
> Parameters: id
> Body: JSON
> This route is protected, you must be logged in as an admin. This route is used to get the wildfire data for a date. 
>
> >Example: GET http://localhost:8000/disasters/wildfires/recent/week
>
> Success response (status 200):  json: `{ allData }` 
> Failure response (status 500): json: `{ error:  error.message }`

</details>

<details>

<summary><h3>Disaster Zone Endpoints</h3></summary>

1. GET http://localhost:8000/disasterzone/all 

> Response: JSON
> This route is used to view all disaster zones.
>
> >Example: GET http://localhost:8000/disasterzone/all 
> 
> Success response (status 200): json: `{ disasterzones }`
> Failure response (status 500): json: `{ error:  "Failed to fetch disasterzones" }`
2. GET http://localhost:8000/disasterzone/:id

> Response: JSON
> This route is used to retrieve information about a disaster zone.
>
> >Example: GET http://localhost:8000/disasterzone/1 
> 
> Success response (status 200): json: `{ disasterzone }`
> Failure response (status 500): json: `{ error:  "Failed to fetch disasterzone" }`
3. POST http://localhost:8000/disasterzone/create 🅰

> Response: JSON
> Body: JSON
> This route is protected, you must be logged in as an admin. This route is used to create a disaster zone. 
>
> >Example: POST http://localhost:8000/disasterzone/create
> > {
> "Name": "UNC-Greensboro",
> "Latitude": 36.06890719, 
> "Longitude": -79.8103471,
> "Radius": 10,
> "HexColor": ffffff
> > }
>
> Note: Any part can be null.
> Success response (status 200): json: `{ response }`
> Failure response (status 400): json: `{ success:  false, error:  "Missing required fields" }`
> Failure response (status 500): json: `{ success:  false, error:  err.message  ||  "Failed to create disaster zone" }`
4. PUT http://localhost:8000/disasterzone/update/:id 🅰

> Response: JSON
> Parameters: id
> Body: JSON
> This route is protected, you must be logged in as an admin. This route is used to update the disaster zone. 
>
> >Example: PUT http://localhost:8000/disasterzone/update/1
> > {
> "Name": "UNC-Greensboro",
> "Latitude": 36.06890719, 
> "Longitude": -79.8103471,
> "Radius": 15,
> "HexColor": fff00
> > }
>
> Note: Any part can be null.
> Success response (status 200): json: `{ disasterzone }`
> Failure response (status 500): json: `{ error:  "Failed to update disasterzone" }`
5. DELETE http://localhost:8000/disasterzone/delete/:id 🅰

> Response: JSON
> Parameters: id
> Body: JSON
> This route is protected, you must be logged in as an admin. This route is used to delete the disaster zone. 
>
> >Example: DELETE http://localhost:8000/disasterzone/delete/1
>
> Success response (status 200): json: `{ disasterzone }`
> Failure response (status 500): json: `{ error:  "Failed to delete disasterzone" }`

</details>

<details>

<summary><h3>Notifications Endpoints</h3></summary>

1. GET http://localhost:8000/notifications/all

> Response: JSON
> Body: JSON
> This route is used to get all notifications. 
>
> >Example: GET http://localhost:8000/notifications/all
>
> Success response (status 200): json: `{ notifications }`
> Failure response (status 500): json: `{ error:  "Failed to fetch notifications" }`
2. GET http://localhost:8000/notifications/all/users

> Response: JSON
> Body: JSON
> This route is used to get all notification users. 
>
> >Example: GET http://localhost:8000/notifications/all/users
>
> Success response (status 200): json: `{ notificationUsers }`
> Failure response (status 500): json: `{ error:  "Failed to fetch notification users" }`
3. GET http://localhost:8000/notifications/all/AdminId/:id

> Response: JSON
> Parameters: id
> Body: JSON
> This route is used to get all notification created by an admin. 
>
> >Example: GET http://localhost:8000/notifications/all/AdminId/1
>
> Success response (status 200): json: `{ notifications }`
> Failure response (status 500): json: `{ error:  "Failed to fetch notifications by admin ID" }`
4. GET http://localhost:8000/notifications/all/AdminId/

> Response: JSON
> Body: JSON
> This route is used to get all notification created by an admin. 
>
> >Example: GET http://localhost:8000/notifications/all/AdminId/
> > {
> "id": 1
> > }
>
> Success response (status 200): json: `{ notifications }`
> Failure response (status 500): json: `{ error:  "Failed to fetch notifications by admin ID" }`

5. GET http://localhost:8000/notifications/all/NotifId-w-users/:id

> Response: JSON
> Parameters: id
> Body: JSON
> This route is used to get all notification with user info from the notification id. 
>
> >Example: GET http://localhost:8000/notifications/all/NotifId-w-users/1
>
> Success response (status 200): json: `{ notifications }`
> Failure response (status 500): json: `{ error:  "Failed to fetch notifications by notification ID" }`
6. GET http://localhost:8000/notifications/all/NotifId-w-users/

> Response: JSON
> Body: JSON
> This route is used to get all notification with user info from the notification id. 
>
> >Example: GET http://localhost:8000/notifications/all/NotifId-w-users/
> > {
> "id": 1
> > }
>
> Success response (status 200): json: `{ notifications }`
> Failure response (status 500): json: `{ error:  "Failed to fetch notifications by notification ID" }`
7. GET http://localhost:8000/notifications/all/NotifId-info/:id

> Response: JSON
> Parameters: id
> Body: JSON
> This route is used to get all notification with user info and disaster zone info from the notification id. 
>
> >Example: GET http://localhost:8000/notifications/all/NotifId-info/1
>
> Success response (status 200): json: `{ notifications }`
> Failure response (status 500): json: `{ error: "Failed to fetch notifications by notification ID with users and disasterzone" }`
8. GET http://localhost:8000/notifications/all/NotifId-info/

> Response: JSON
> Body: JSON
> This route is used to get all notification with user info and disaster zone info from the notification id. 
>
> >Example: GET http://localhost:8000/notifications/all/NotifId-w-users/
> > {
> "id": 1
> > }
>
> Success response (status 200): json: `{ notifications }`
> Failure response (status 500): json: `{ error: "Failed to fetch notifications by notification ID with users and disasterzone" }`
9. GET http://localhost:8000/notifications/all/DisasterId/:id

> Response: JSON
> Parameters: id
> Body: JSON
> This route is used to get all notifications by using disaster zone id. 
>
> >Example: GET http://localhost:8000/notifications/all/DisasterId/1
>
> Success response (status 200): json: `{ notifications }`
> Failure response (status 500): json: `{ error:  "Failed to fetch notifications by disaster ID" }`
10. GET http://localhost:8000/notifications/all/DisasterId/

> Response: JSON
> Body: JSON
> This route is used to get all notifications by using disaster zone id. 
>
> >Example: GET http://localhost:8000/notifications/all/DisasterId/
> > {
> "id": 1
> > }
>
> Success response (status 200): json: `{ notifications }`
> Failure response (status 500): json: `{ error:  "Failed to fetch notifications by disaster ID" }`
11. GET http://localhost:8000/notifications/all/DisasterId-info/:id

> Response: JSON
> Parameters: id
> Body: JSON
> This route is used to get all notifications and user info by using disaster zone id. 
>
> >Example: GET http://localhost:8000/notifications/all/DisasterId-info/1
>
> Success response (status 200): json: `{ notifications }`
> Failure response (status 500): json: `{ error: "Failed to fetch notifications by disaster ID with users and disasterzone" }`
12. GET http://localhost:8000/notifications/all/DisasterId-info/

> Response: JSON
> Body: JSON
> This route is used to get all notifications and user info by using disaster zone id. 
>
> >Example: GET http://localhost:8000/notifications/all/DisasterId-info/
> > {
> "id": 1
> > }
>
> Success response (status 200): json: `{ notifications }`
> Failure response (status 500): json: `{ error: "Failed to fetch notifications by disaster ID with users and disasterzone" }`
13. POST http://localhost:8000/notifications/create-notif 🅰

> Response: JSON
> Body: JSON
> This route is protected, you must be logged in as an admin. This route is used to create a notification.
>
> >Example: POST http://localhost:8000/notifications/create-notif
> > {
> "Message": "THIS IS A TEST",
> "AdminId": 1,
> "DisasterzoneId": 1
> > }
>
> Success response (status 200): json: `{ notification }`
> Failure response (status 500): json: `{ error:  "Failed to create notification" }`
14. POST http://localhost:8000/notifications/create-notif-broadcast 🅰

> Response: JSON
> Body: JSON
> This route is protected, you must be logged in as an admin. This route is used to create a notification.
>
> >Example: POST http://localhost:8000/notifications/create-notif-broadcast
> > {
> "Message": "THIS IS A TEST",
> "AdminId": 1,
> "DisasterzoneId": 1
> > }
>
> Success response (status 200): json: `{ notification }`
> Failure response (status 500): json: `{ error:  "Failed to create notification" }`
15. POST http://localhost:8000/notifications/create-notif-user 🅰

> Response: JSON
> Body: JSON
> This route is protected, you must be logged in as an admin. This route is used to create a notification user.
>
> >Example: POST http://localhost:8000/notifications/create-notif-user
> > {
> "UserId": 1,
> "NotificationId": 1
> > }
>
> Success response (status 200): json: `{ notificationUser }`
> Failure response (status 500): json: `{ error:  "Failed to create notification user" }`
16. PUT http://localhost:8000/notifications/update-notif/:id 🅰

> Response: JSON
> Body: JSON
> This route is protected, you must be logged in as an admin. This route is used to update a notification.
>
> >Example: PUT http://localhost:8000/notifications/update-notif/1
> > {
> "Message": "THIS IS TESTING TEST!",
> "AdminId": 1
> > }
>
> Success response (status 200): json: `{ notification }`
> Failure response (status 500): json: `{ error:  "Failed to update notification" }`
17. POST http://localhost:8000/notifications/update-notif/ 🅰

> Response: JSON
> Body: JSON
> This route is protected, you must be logged in as an admin. This route is used to update a notification.
>
> >Example: POST http://localhost:8000/notifications/update-notif/
> > {
> "notificationId": 1,
> "Message": "THIS IS TESTING TEST!",
> "AdminId": 1
> > }
>
> Success response (status 200): json: `{ notification }`
> Failure response (status 500): json: `{ error:  "Failed to update notification" }`
18. DELETE http://localhost:8000/notifications/delete-notif/:id 🅰

> Response: JSON
> Body: JSON
> This route is protected, you must be logged in as an admin. This route is used to delete a notification.
>
> >Example: DELETE http://localhost:8000/notifications/delete-notif/1
>
> Success response (status 200): json: `{ notification }`
> Failure response (status 500): json: `{ error:  "Failed to delete notification" }`
> 
19. DELETE http://localhost:8000/notifications/delete-notif/:id 🅰

> Response: JSON
> Body: JSON
> This route is protected, you must be logged in as an admin. This route is used to delete a notification.
>
> >Example: GET http://localhost:8000/notifications/delete-notif/1
>
> Success response (status 200): json: `{ notification }`
> Failure response (status 500): json: `{ error:  "Failed to delete notification" }`
> 


</details>