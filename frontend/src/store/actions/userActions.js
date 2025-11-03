import { request } from '../../utils/request';
import { setUser } from '../../actions';

const BASE_URL = 'http://localhost:3001';

export const updateUser = (userId, userData) => {
	return async (dispatch, getState) => {
		try {
			if (!userId) {
				throw new Error('ID пользователя не указан.');
			}

			const endpoint = `/profile`;
			const method = 'PUT';

			let token = null;
			try {
				const userDataStr = sessionStorage.getItem('userData');
				if (userDataStr) {
					const userData = JSON.parse(userDataStr);
					token = userData.token;
				}
			} catch (e) {
				console.error('Ошибка парсинга sessionStorage:', e);
			}

			const customHeaders = {};
			if (token) {
				customHeaders.Authorization = `Bearer ${token}`;
			}
			const response = await request(endpoint, method, userData, customHeaders);

			const updatedUserDataFromBackend = response.user || response;

			if (!updatedUserDataFromBackend) {
				throw new Error('Сервер не вернул данные пользователя.');
			}

			dispatch(
				setUser({
					id: updatedUserDataFromBackend._id || updatedUserDataFromBackend.id,
					username:
						updatedUserDataFromBackend.username ||
						updatedUserDataFromBackend.login,
					role: updatedUserDataFromBackend.role,
					firstName: updatedUserDataFromBackend.firstName,
					lastName: updatedUserDataFromBackend.lastName,
					email: updatedUserDataFromBackend.email,
					gender: updatedUserDataFromBackend.gender,
				}),
			);

			return response;
		} catch (error) {
			console.error('Ошибка при обновлении пользователя:', error);

			const errorMessage =
				error.data?.message ||
				error.message ||
				'Произошла ошибка при обновлении профиля.';

			throw error;
		}
	};
};
