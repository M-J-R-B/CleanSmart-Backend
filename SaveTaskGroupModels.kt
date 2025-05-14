package com.example.cleansmart.models

/**
 * Request class for saving a TaskGroup
 */
data class SaveTaskGroupRequest(
    val taskGroup: TaskGroup
)

/**
 * Model representing a group of tasks for a specific area
 */
data class TaskGroup(
    val id: String? = null,
    val userId: String? = null,
    val areaName: String,
    val imageBase64: String? = null,
    val tasks: List<String> = emptyList(),
    val progress: Int = 0,
    val dateCreated: Long = System.currentTimeMillis()
)

/**
 * Response class for getting task groups
 */
data class GetTaskGroupsResponse(
    val success: Boolean,
    val taskGroups: List<TaskGroup>
)

/**
 * Response class for saving or updating a task group
 */
data class SaveTaskGroupResponse(
    val success: Boolean,
    val message: String? = null,
    val taskGroup: TaskGroup? = null
) 