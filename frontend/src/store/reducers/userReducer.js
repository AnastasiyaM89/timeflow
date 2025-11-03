import { ROLE } from '../../constans';
import { ACTION_TYPE } from '../../actions';

const initialState = {
	currentUser: null,
	isAuth: false,
	roleId: ROLE.GUEST,
	session: null,
	isLoading: true,
};

export const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPE.FETCH_USER_REQUEST:
			return {
				...state,
				isLoading: true,
			};

		case ACTION_TYPE.SET_USER:
			const { id, username, role, firstName, lastName, email, gender } =
				action.payload;
			return {
				...state,
				currentUser: { id, username, role, firstName, lastName, email, gender },
				isAuth: true,
				roleId: Number(role),
				isLoading: false,
			};
		case ACTION_TYPE.LOGOUT:
			return { ...initialState, isLoading: false };
		default:
			return state;
	}
};
