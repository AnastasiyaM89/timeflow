import { request } from '../utils/request';
import { ACTION_TYPE } from './action-type';

export const logout = () => async (dispatch) => {
	try {
		localStorage.clear();

		await request('/logout', 'POST');

		dispatch({ type: ACTION_TYPE.LOGOUT, payload: { tasks: [], user: null } });
	} catch (error) {
		console.error('Ошибка при выходе:', error);
	}
};
