package com.example.cleansmart.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.cleansmart.models.TaskGroup
import com.example.cleansmart.repository.TaskGroupRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import java.util.Date
import javax.inject.Inject

@HiltViewModel
class TaskGroupViewModel @Inject constructor(
    private val repository: TaskGroupRepository
) : ViewModel() {
    
    private val _taskGroups = MutableLiveData<List<TaskGroup>>()
    val taskGroups: LiveData<List<TaskGroup>> = _taskGroups
    
    private val _saveResult = MutableLiveData<Boolean>()
    val saveResult: LiveData<Boolean> = _saveResult
    
    fun getTaskGroups() {
        viewModelScope.launch {
            val response = repository.getTaskGroups()
            if (response?.isSuccessful == true) {
                _taskGroups.postValue(response.body()?.taskGroups ?: emptyList())
            } else {
                Log.e("TaskGroupViewModel", "Error getting task groups: ${response?.message()}")
            }
        }
    }
    
    fun saveTaskGroup(taskGroup: TaskGroup) {
        viewModelScope.launch {
            Log.d("TaskGroupViewModel", "Saving task group with image size: ${taskGroup.imageBase64?.length ?: 0} bytes")
            val response = repository.saveTaskGroup(taskGroup)
            _saveResult.postValue(response?.isSuccessful == true)
            if (response?.isSuccessful == true) {
                Log.d("TaskGroupViewModel", "Successfully saved task group: ${response.body()}")
            } else {
                Log.e("TaskGroupViewModel", "Error saving task group: ${response?.errorBody()?.string()}")
            }
        }
    }
    
    // Use this function for testing without authentication
    fun testSaveTaskGroup(areaName: String, imageBase64: String? = null, tasks: List<String> = emptyList()) {
        viewModelScope.launch {
            // Create a sample task group for testing
            val taskGroup = TaskGroup(
                userId = "dummy-user-id",  // This will be overridden by the server 
                areaName = areaName,
                imageBase64 = imageBase64,
                tasks = tasks,
                progress = 0,
                dateCreated = Date().time
            )
            
            Log.d("TaskGroupViewModel", "Test saving task group with image size: ${taskGroup.imageBase64?.length ?: 0} bytes")
            
            // Use the test endpoint
            val response = repository.testSaveTaskGroup(taskGroup)
            _saveResult.postValue(response?.isSuccessful == true)
            
            Log.d("TaskGroupViewModel", "Test save response: ${response?.code()}")
            if (response?.isSuccessful == true) {
                Log.d("TaskGroupViewModel", "Successfully saved task group: ${response.body()}")
            } else {
                Log.e("TaskGroupViewModel", "Error saving task group: ${response?.errorBody()?.string()}")
            }
        }
    }
    
    // Use this function for the simplified test endpoint
    fun simpleTestSaveTaskGroup(areaName: String, tasks: List<String>? = null) {
        viewModelScope.launch {
            val response = repository.simpleTestSaveTaskGroup(areaName, tasks)
            _saveResult.postValue(response?.isSuccessful == true)
            
            Log.d("TaskGroupViewModel", "Simple test save response: ${response?.code()}")
            if (response?.isSuccessful == true) {
                Log.d("TaskGroupViewModel", "Successfully saved simple task group: ${response.body()}")
            } else {
                Log.e("TaskGroupViewModel", "Error saving simple task group: ${response?.errorBody()?.string()}")
            }
        }
    }
} 