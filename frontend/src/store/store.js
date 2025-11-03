import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import { userReducer } from './reducers/userReducer';
import { taskReducer } from './reducers/taskReducer';
import persistState from 'redux-localstorage';
import { categoryReducer } from './reducers/categoryReducer';

const rootReducer = combineReducers({
	user: userReducer,
	tasks: taskReducer,
	categories: categoryReducer,
});

const persistenceEnhancer = persistState('tasks');

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
	rootReducer,
	composeEnhancers(applyMiddleware(thunk), persistenceEnhancer),
);
