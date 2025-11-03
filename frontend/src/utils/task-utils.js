export const createFullTaskData = (task, taskId) => {
	return {
		...task,
		_id: taskId,
		completed: task.completed || false,
		description: task.description || '',
		title: task.title || '',
		category: task.category || '',
		dateStart: task.dateStart || '',
		dateEnd: task.dateEnd || '',
	};
};
