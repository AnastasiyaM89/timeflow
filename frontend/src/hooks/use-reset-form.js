import { useEffect } from 'react';
import { useStore } from 'react-redux';

export const useResetForm = (reset) => {
	const store = useStore();

	useEffect(() => {
		const appState = store.getState().app || {};
		let currentWasLogout = appState.wasLogout;

		return store.subscribe(() => {
			let previosWasLogout = currentWasLogout;
			const updatedAppState = store.getState().app || {};
			currentWasLogout = updatedAppState.wasLogout;

			if (currentWasLogout !== previosWasLogout) {
				reset();
			}
		});
	}, [reset, store]);
};
