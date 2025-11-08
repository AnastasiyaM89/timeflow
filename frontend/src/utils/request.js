export function request(url, method, data) {
	const apiUrl = `/api${url}`;

	const token = localStorage.getItem('token');

	return fetch(apiUrl, {
		headers: {
			'Content-Type': 'application/json',
			...(token && { Authorization: `Bearer ${token}` }),
		},
		method: method || 'GET',
		body: data ? JSON.stringify(data) : undefined,
	}).then((res) => {
		if (!res.ok) {
			return res.text().then((text) => {
				throw new Error(`HTTP ${res.status}: ${text || 'Неизвестный ответ'}`);
			});
		}
		return res.json();
	});
}
