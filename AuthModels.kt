package com.example.cleansmart.models

/**
 * Request class for user signup
 */
data class SignupRequest(
    val fullName: String,
    val email: String,
    val password: String
)

/**
 * Request class for user login
 */
data class LoginRequest(
    val email: String,
    val password: String
)

/**
 * Response class for authentication operations (login and signup)
 */
data class AuthResponse(
    val success: Boolean,
    val user: User? = null,
    val message: String? = null
)

/**
 * Response class for logout
 */
data class LogoutResponse(
    val success: Boolean,
    val message: String? = null
)

/**
 * Request class for forgot password
 */
data class ForgotPasswordRequest(
    val email: String
)

/**
 * Request class for resetting password with a token
 */
data class ResetPasswordRequest(
    val token: String,
    val newPassword: String
)

/**
 * Request class for changing password (when logged in)
 */
data class ChangePasswordRequest(
    val currentPassword: String,
    val newPassword: String
)

/**
 * Simple response with a message
 */
data class MessageResponse(
    val success: Boolean,
    val message: String
)

/**
 * User model
 */
data class User(
    val id: String,
    val fullName: String,
    val email: String
) 