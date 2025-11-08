import { ACTION_TYPE } from '../../actions';

const initialState = {
	tasks: [],
	loading: false,
	error: null,
};

export const taskReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPE.TASKS_LOADING:
			return { ...state, loading: true, error: null };

		case ACTION_TYPE.SET_TASKS:
			return {
				...state,
				tasks: action.payload,
				loading: false,
				error: null,
			};

		case ACTION_TYPE.TASKS_ERROR:
			return { ...state, loading: false, error: action.payload };

		case ACTION_TYPE.ADD_TASK_SUCCESS: {
			const newTask = action.payload;
			return {
				...state,
				tasks: [...state.tasks, newTask],
				loading: false,
				error: null,
			};
		}

		case ACTION_TYPE.ADD_TASK_FAILURE:
			return { ...state, loading: false, error: action.payload };

		case ACTION_TYPE.EDIT_TASK_SUCCESS: {
			const updatedTaskData = action.payload;

			return {
				...state,
				tasks: state.tasks.map((task) => {
					if (task._id === updatedTaskData._id) {
						return {
							...task,
							...updatedTaskData,
						};
					}
					return task;
				}),
			};
		}

		case ACTION_TYPE.DELETE_TASK_SUCCESS:
			return {
				...state,
				tasks: state.tasks.filter((t) => t._id !== action.payload),
			};

		case ACTION_TYPE.TOGGLE_TASK_COMPLETED:
			const updatedTask = action.payload;
			return {
				...state,
				tasks: state.tasks.map((task) =>
					task._id === updatedTask._id ? { ...task, ...updatedTask } : task,
				),
			};

		case ACTION_TYPE.LOGOUT:
			return initialState;

		default:
			return state;
	}
};
