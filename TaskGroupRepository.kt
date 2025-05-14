package com.example.cleansmart.repository

import com.example.cleansmart.api.ApiInterface
import com.example.cleansmart.models.SaveTaskGroupRequest
import com.example.cleansmart.models.TaskGroup
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import retrofit2.Response
import javax.inject.Inject

class TaskGroupRepository @Inject constructor(
    private val apiInterface: ApiInterface
) {
    suspend fun getTaskGroups() = withContext(Dispatchers.IO) {
        try {
            apiInterface.getTaskGroups()
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    suspend fun saveTaskGroup(taskGroup: TaskGroup) = withContext(Dispatchers.IO) {
        try {
            val request = SaveTaskGroupRequest(taskGroup)
            apiInterface.saveTaskGroup(request)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    // Use this function for testing without authentication
    suspend fun testSaveTaskGroup(taskGroup: TaskGroup) = withContext(Dispatchers.IO) {
        try {
            val request = SaveTaskGroupRequest(taskGroup)
            apiInterface.testSaveTaskGroup(request)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    // Use this function for the simplified test endpoint
    suspend fun simpleTestSaveTaskGroup(areaName: String, tasks: List<String>? = null) = withContext(Dispatchers.IO) {
        try {
            apiInterface.simpleTestSaveTaskGroup(areaName, tasks)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
} 