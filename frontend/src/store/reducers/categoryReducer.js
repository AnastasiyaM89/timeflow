import { ACTION_TYPE } from '../../actions';

const initialState = {
	categories: [],
	loading: false,
	error: null,
	loaded: false,
};

export const categoryReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPE.CATEGORIES_LOADING:
			return { ...state, loading: true, error: null };
		case ACTION_TYPE.SET_CATEGORIES:
			return { ...state, categories: action.payload, loading: false, loaded: true };
		case ACTION_TYPE.ADD_CATEGORY_SUCCESS:
			return {
				...state,
				categories: [...state.categories, action.payload],
				loading: false,
				loaded: true,
			};
		case ACTION_TYPE.CATEGORIES_ERROR:
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
};
