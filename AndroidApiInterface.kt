package com.example.cleansmart.network

import com.example.cleansmart.models.*
import retrofit2.Response
import retrofit2.http.*

/**
 * Retrofit API interface for CleanSmart app
 * This interface defines all network requests for the application
 */
interface ApiService {
    companion object {
        const val BASE_URL = "http://10.0.2.2:5000/api/" // For Android emulator pointing to localhost
        // Use this for real device testing, replace with your actual server IP
        // const val BASE_URL = "http://192.168.x.x:5000/api/"
        
        fun create(): ApiService {
            return NetworkClient.apiService
        }
    }

    // Auth endpoints
    @Headers("Content-Type: application/json")
    @POST("auth/signup")
    suspend fun signup(@Body request: SignupRequest): Response<AuthResponse>

    @Headers("Content-Type: application/json")
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @Headers("Content-Type: application/json")
    @POST("auth/logout")
    suspend fun logout(): Response<LogoutResponse>

    @Headers("Content-Type: application/json")
    @POST("auth/forgot-password")
    suspend fun forgotPassword(@Body request: ForgotPasswordRequest): Response<MessageResponse>

    @Headers("Content-Type: application/json")
    @POST("auth/reset-password")
    suspend fun resetPassword(@Body request: ResetPasswordRequest): Response<MessageResponse>

    @Headers("Content-Type: application/json")
    @POST("auth/change-password")
    suspend fun changePassword(@Body request: ChangePasswordRequest): Response<MessageResponse>

    // TaskGroup endpoints
    @Headers("Content-Type: application/json")
    @GET("taskGroups")
    suspend fun getTaskGroups(): Response<GetTaskGroupsResponse>

    @Headers("Content-Type: application/json")
    @POST("taskGroups")
    suspend fun saveTaskGroup(@Body request: SaveTaskGroupRequest): Response<SaveTaskGroupResponse>

    @Headers("Content-Type: application/json")
    @PUT("taskGroups/{taskGroupId}")
    suspend fun updateTaskGroupProgress(
        @Path("taskGroupId") taskGroupId: String,
        @Body updateRequest: UpdateProgressRequest
    ): Response<SaveTaskGroupResponse>

    // Task endpoints
    @Headers("Content-Type: application/json")
    @GET("tasks")
    suspend fun getTasks(): Response<List<Task>>

    @Headers("Content-Type: application/json")
    @POST("tasks")
    suspend fun createTask(@Body task: Task): Response<Task>

    @Headers("Content-Type: application/json")
    @PUT("tasks/{taskId}")
    suspend fun updateTask(
        @Path("taskId") taskId: String,
        @Body task: Task
    ): Response<Task>

    @Headers("Content-Type: application/json")
    @DELETE("tasks/{taskId}")
    suspend fun deleteTask(@Path("taskId") taskId: String): Response<DeleteResponse>

    @Headers("Content-Type: application/json")
    @POST("tasks/generate")
    suspend fun generateTasks(@Body request: GenerateTasksRequest): Response<GenerateTasksResponse>

    // Test endpoints - Use these for testing without authentication
    @Headers("Content-Type: application/json")
    @POST("taskGroups/test")
    suspend fun testSaveTaskGroup(@Body request: SaveTaskGroupRequest): Response<SaveTaskGroupResponse>

    @FormUrlEncoded
    @POST("taskGroups/simple-test")
    suspend fun simpleTestSaveTaskGroup(
        @Field("areaName") areaName: String,
        @Field("tasks") tasks: List<String>?
    ): Response<SaveTaskGroupResponse>
}

// Additional model classes needed for API interface
data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val success: Boolean,
    val token: String?,
    val user: User?,
    val message: String?
)

data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String
)

data class RegisterResponse(
    val success: Boolean,
    val token: String?,
    val user: User?,
    val message: String?
)

data class User(
    val id: String,
    val name: String,
    val email: String,
    val isAdmin: Boolean = false
)

data class UpdateProgressRequest(
    val progress: Int
)

data class DeleteResponse(
    val success: Boolean,
    val message: String?
)

data class Task(
    val id: String? = null,
    val title: String,
    val description: String? = null,
    val area: String,
    val priority: String = "MEDIUM",
    val isCompleted: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)

data class GenerateTasksRequest(
    val area: String,
    val imageBase64: String? = null
)

data class GenerateTasksResponse(
    val success: Boolean,
    val message: String?,
    val tasks: List<Task>?
) 