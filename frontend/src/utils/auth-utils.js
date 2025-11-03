export const getToken = () => {
	try {
		const str = sessionStorage.getItem('userData');
		if (!str) {
			return null;
		}
		const data = JSON.parse(str);
		return data?.token ?? null;
	} catch (e) {
		console.error('Ошибка в getToken():', e);
		return null;
	}
};
