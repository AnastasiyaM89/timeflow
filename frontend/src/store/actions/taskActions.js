import { ACTION_TYPE } from '../../actions';
import { request } from '../../utils/request';
import { createFullTaskData } from '../../utils/task-utils';
import { getToken } from '../../utils/auth-utils';

export const loadTasks = (dateFilter) => async (dispatch, getState) => {
	dispatch({ type: ACTION_TYPE.TASKS_LOADING });

	try {
		const params = dateFilter ? { date: dateFilter } : {};
		const response = await request('/tasks', 'GET', null, params);

		if (!response) {
			throw new Error('Пустой ответ от сервера');
		}

		if (!response.tasks || !Array.isArray(response.tasks)) {
			throw new Error('Ответ сервера не содержит массив tasks');
		}

		dispatch({
			type: ACTION_TYPE.SET_TASKS,
			payload: response.tasks.map((task) => ({
				...task,
				_id: String(task._id).trim(),
			})),
		});
	} catch (err) {
		dispatch({
			type: ACTION_TYPE.TASKS_ERROR,
			payload: err.message || 'Не удалось загрузить задачи',
		});
	}
};

export const addTask = (task) => async (dispatch) => {
	dispatch({ type: ACTION_TYPE.ADD_TASK_REQUEST });

	try {
		const savedTask = await request('/tasks', 'POST', task);
		dispatch({ type: ACTION_TYPE.ADD_TASK_SUCCESS, payload: savedTask });
		return savedTask;
	} catch (err) {
		dispatch({
			type: ACTION_TYPE.ADD_TASK_FAILURE,
			payload: err.message || 'Не удалось добавить задачу',
		});
		throw err;
	}
};

export const editTask = (taskId, updatedTaskData) => async (dispatch) => {
	dispatch({ type: ACTION_TYPE.EDIT_TASK_REQUEST });

	try {
		const token = getToken();

		if (!updatedTaskData.title || !updatedTaskData.category) {
			throw new Error('Для редактирования задачи требуются поля: title, category');
		}

		const fullTaskData = createFullTaskData(updatedTaskData, taskId);

		const response = await request(`/tasks/${taskId}`, 'PUT', fullTaskData);

		dispatch({
			type: ACTION_TYPE.EDIT_TASK_SUCCESS,
			payload: response,
		});
		return response;
	} catch (error) {
		console.error('!!! ERROR IN editTask (caught):', error);
		if (error.status) {
			console.log('Server error details:', {
				status: error.status,
				url: error.url,
				data: error.data,
			});
		}
		dispatch({
			type: ACTION_TYPE.EDIT_TASK_FAILURE,
			payload: error.message || 'Не удалось обновить задачу',
		});
		throw error;
	}
};

export const deleteTask = (id) => async (dispatch) => {
	dispatch({ type: ACTION_TYPE.DELETE_TASK_REQUEST });
	try {
		const url = `/tasks/${id}`;
		await request(url, 'DELETE');

		dispatch({ type: ACTION_TYPE.DELETE_TASK_SUCCESS, payload: id });
	} catch (error) {
		console.error('!!! ERROR IN deleteTask (caught):', error);
		const errorMessage = error.isNetworkError
			? 'Ошибка сети. Не удалось связаться с сервером.'
			: `Ошибка сервера: ${error.message || 'Неизвестный статус'}`;
		dispatch({
			type: ACTION_TYPE.DELETE_TASK_FAILURE,
			payload: errorMessage,
		});
		throw error;
	}
};

export const toggleTaskCompleted = (taskId) => async (dispatch, getState) => {
	try {
		if (!taskId || typeof taskId !== 'string') {
			throw new Error('taskId должен быть строкой');
		}

		const tasks = getState().tasks.tasks;
		const currentTask = tasks.find((t) => t._id === taskId);

		if (!currentTask) {
			throw new Error('Задача не найдена');
		}

		const url = `/tasks/${encodeURIComponent(taskId)}`;

		const updatedTask = await request(
			url,
			'PUT',
			createFullTaskData(
				{ ...currentTask, completed: !currentTask.completed },
				taskId,
			),
		);

		if (!updatedTask) {
			throw new Error('Задача не найдена на сервере (404)');
		}

		dispatch({
			type: ACTION_TYPE.TOGGLE_TASK_COMPLETED,
			payload: updatedTask,
		});
	} catch (error) {
		console.error('Ошибка toggleTaskCompleted:', error);
		dispatch({
			type: ACTION_TYPE.TASKS_ERROR,
			payload: error.message || 'Не удалось обновить статус задачи',
		});
		throw error;
	}
};
