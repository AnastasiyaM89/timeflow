import { ACTION_TYPE } from './action-type';

export const setUser = (userFromApi) => (dispatch) => {
	const payload = {
		id: userFromApi._id?.toString() || userFromApi.id || '',

		username: userFromApi.username || userFromApi.login || '',

		role: userFromApi.role ?? 0,

		firstName: userFromApi.firstName || '',
		lastName: userFromApi.lastName || '',
		email: userFromApi.email || '',
		gender: userFromApi.gender || 'unknown',
	};

	dispatch({
		type: ACTION_TYPE.SET_USER,
		payload,
	});
};
