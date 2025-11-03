import { ACTION_TYPE } from '../../actions';
import { request } from '../../utils/request';

export const loadCategories = () => async (dispatch) => {
	dispatch({ type: ACTION_TYPE.CATEGORIES_LOADING });
	try {
		const response = await request('/categories/', 'GET');
		if (response?.categories && Array.isArray(response.categories)) {
			dispatch({
				type: ACTION_TYPE.SET_CATEGORIES,
				payload: response.categories,
			});
		} else {
			throw new Error('Неожиданный формат ответа при загрузке категорий.');
		}
	} catch (err) {
		console.error('!!! ERROR IN loadCategories:', err);
		dispatch({
			type: ACTION_TYPE.CATEGORIES_ERROR,
			payload: err.message || 'Не удалось загрузить категории',
		});
		throw err;
	}
};

export const addCategory = (newCategoryName) => async (dispatch) => {
	dispatch({ type: ACTION_TYPE.ADD_CATEGORY_REQUEST });

	try {
		const savedCategory = await request('/categories/', 'POST', {
			name: newCategoryName,
		});

		if (!savedCategory || !savedCategory.name) {
			console.error(
				'Error: savedCategory from backend is invalid or missing name.',
				savedCategory,
			);
			throw new Error(
				'Категория не была добавлена или сервер вернул некорректные данные.',
			);
		}

		dispatch({ type: ACTION_TYPE.ADD_CATEGORY_SUCCESS, payload: savedCategory.name });

		return savedCategory;
	} catch (error) {
		console.error('!!! ERROR IN addCategory (caught):', error);

		let errorMessage = 'Не удалось добавить категорию';
		if (error.isNetworkError) {
			errorMessage = 'Ошибка сети. Не удалось связаться с сервером.';
		} else if (error.message) {
			errorMessage = error.message;
		}

		dispatch({
			type: ACTION_TYPE.ADD_CATEGORY_FAILURE,
			payload: errorMessage,
		});

		throw error;
	}
};

export const deleteCategory = (categoryNameToDelete) => async (dispatch) => {
	dispatch({ type: ACTION_TYPE.DELETE_CATEGORY_REQUEST });

	const endpoint = `/categories/${encodeURIComponent(categoryNameToDelete)}`;

	try {
		const response = await request(endpoint, 'DELETE');

		dispatch(loadCategories());

		return response;
	} catch (error) {
		console.error('!!! ERROR IN deleteCategory (caught):', error);

		let errorMessage = `Не удалось удалить категорию: ${categoryNameToDelete}`;
		if (error.isNetworkError) {
			errorMessage = 'Ошибка сети. Не удалось связаться с сервером для удаления.';
		} else if (error.message) {
			errorMessage = error.message;
		}

		dispatch({
			type: ACTION_TYPE.DELETE_CATEGORY_FAILURE,
			payload: errorMessage,
		});

		throw error;
	}
};
