

# API Architecture Documentation
## Endpoints
### 1. `/register` (POST)
Description: Registers a new user by saving their email and hashed password to
the database.
Request Body:
 - `email` (string): User's email address
 - `password` (string): User's password
Response:
 - `message` (string): Success message or error message if user already exists
### 2. `/sendotp` (POST)
Description: Sends an OTP (one-time password) to the user's email address for
two-factor authentication during login.
Request Body:
 - `email` (string): User's email address
Response:
 - `message` (string): Success message or error message if user not found
### 3. `/login` (POST)
Description: Logs in a user by verifying their email, password, and OTP.
Generates a JWT token upon successful login.
Request Body:
 - `email` (string): User's email address
 - `password` (string): User's password
 - `otp` (string): One-time password received via email
Response:
 - `result` (object): User data
 - `token` (string): JWT token
 - `loginSession` (object): Details of the login session
 - `loginLogoutActivity` (object): Details of the login/logout activity
### 4. `/sessions/:sessionId/logout` (PUT)
Description: Updates the logout date of a session.
Request Parameters:
 - `sessionId` (string): ID of the session to update
Response:
 - `message` (string): Success message or error message if session not found
### 5. `/sessions` (GET)
Description: Retrieves active sessions for the current user.
Request Headers:
 - `Authorization` (string): JWT token
Response:
 - `sessions` (array): List of active sessions
### 6. `/useractivity` (GET)
Description: Retrieves login/logout activities for the current user.
Request Headers:
 - `Authorization` (string): JWT token
Response:
 - `sessions` (array): List of login/logout activities
### 7. `/sessions/:sessionId` (DELETE)
Description: Deletes a session.
Request Parameters:
 - `sessionId` (string): ID of the session to delete
Response:
 - `message` (string): Success message or error message if session not found
## Security
Password Hashing: User passwords are hashed using bcrypt.js before storing
them in the database, enhancing security.
JWT Authentication: JSON Web Tokens (JWT) are used for authentication,
ensuring secure communication between the client and server.
Two-Factor Authentication (OTP): OTPs are sent via email for two-factor
authentication during the login process, adding an extra layer of security.
Email Notifications: Users will get notification for every new login.
## Error Handling
Status Codes: The API returns appropriate HTTP status codes for success and
error responses, providing clear indications of the request status.
Error Messages: Error messages are returned in the response body for clientside error handling and debugging.
