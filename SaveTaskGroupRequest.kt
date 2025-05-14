package com.example.cleansmart.models

data class SaveTaskGroupRequest(
    val taskGroup: TaskGroup
)

data class TaskGroup(
    val userId: String? = null,
    val areaName: String,
    val imageBase64: String? = null,
    val tasks: List<String> = emptyList(),
    val progress: Int = 0,
    val dateCreated: Long = System.currentTimeMillis()
)

data class GetTaskGroupsResponse(
    val success: Boolean,
    val taskGroups: List<TaskGroup>
)

data class SaveTaskGroupResponse(
    val success: Boolean,
    val message: String? = null,
    val taskGroup: TaskGroup? = null
) 