import { getToken } from './auth-utils';

const BASE_URL = 'http://localhost:3001';

export function request(endpoint, method = 'GET', data, customHeaders = {}) {
	if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
		console.warn(
			'Endpoint содержит полный URL. Используйте относительный путь.',
			endpoint,
		);
	}

	const url = new URL(endpoint, BASE_URL).toString();

	const userSpecifiedHeaders = { ...customHeaders };

	const needsAuthCheck = !customHeaders?.noAuth && customHeaders?.auth !== false;
	const isLoginOrRegisterEndpoint = endpoint === '/login' || endpoint === '/register';
	const needAuth = needsAuthCheck && !isLoginOrRegisterEndpoint;

	if (needAuth) {
		const token = getToken();
		if (token) {
			userSpecifiedHeaders.Authorization = `Bearer ${token}`;
		} else {
			return Promise.reject(new Error('Unauthorized: Token not found.'));
		}
	}

	const headers = {
		'content-type': 'application/json',
		...userSpecifiedHeaders,
	};

	const options = {
		method,
		headers,
		...(data ? { body: JSON.stringify(data) } : {}),
	};

	return fetch(url, options)
		.then((resp) => {
			if (resp.ok) {
				if (resp.status === 204) return null;
				return resp.json();
			}

			const error = new Error();
			error.status = resp.status;
			error.url = url;

			return resp
				.json()
				.then((errorData) => {
					error.data = errorData;
					error.message =
						errorData.message ||
						errorData.error ||
						`HTTP ${resp.status}: ${resp.statusText || 'Ошибка сервера'}`;
					throw error;
				})
				.catch(() => {
					error.message = `HTTP ${resp.status}: ${resp.statusText || 'Ошибка сервера'}`;
					throw error;
				});
		})
		.catch((error) => {
			let errorMessage = error.message || 'Неизвестная ошибка сети';

			if (error instanceof TypeError && error.message === 'Failed to fetch') {
				errorMessage = 'Нет соединения с сервером';
			} else if (error.name === 'AbortError') {
				errorMessage = 'Запрос отменён (тайм-аут)';
			}

			const networkError = new Error(errorMessage);
			networkError.name = error.name || 'NetworkError';
			networkError.stack = error.stack;

			console.error('!!! NETWORK ERROR:', networkError.message, error);
			throw networkError;
		});
}
