package com.example.cleansmart.api

import com.example.cleansmart.models.*
import retrofit2.Response
import retrofit2.http.*

interface ApiInterface {
    // Auth endpoints
    @Headers("Content-Type: application/json")
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @Headers("Content-Type: application/json")
    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<RegisterResponse>

    // TaskGroup endpoints
    @Headers("Content-Type: application/json")
    @GET("taskGroups")
    suspend fun getTaskGroups(): Response<GetTaskGroupsResponse>

    @Headers("Content-Type: application/json")
    @POST("taskGroups")
    suspend fun saveTaskGroup(@Body request: SaveTaskGroupRequest): Response<SaveTaskGroupResponse>

    // Test endpoints - Use these for testing without authentication
    @Headers("Content-Type: application/json")
    @POST("taskGroups/test")
    suspend fun testSaveTaskGroup(@Body request: SaveTaskGroupRequest): Response<SaveTaskGroupResponse>

    @FormUrlEncoded
    @POST("taskGroups/simple-test")
    suspend fun simpleTestSaveTaskGroup(@Field("areaName") areaName: String, @Field("tasks") tasks: List<String>?): Response<SaveTaskGroupResponse>
} 