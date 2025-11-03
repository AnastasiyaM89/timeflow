import { createSelector } from 'reselect';

const selectTasksState = (state) => state.tasks;

export const selectAllTasks = createSelector(
	[selectTasksState],
	(tasksState) => tasksState.tasks,
);

export const selectTasksForToday = createSelector([selectAllTasks], (allTasks) => {
	const today = new Date();
	return allTasks.filter((task) => {
		if (!task.dateEnd && !task.dateStart) return false;
		try {
			const dateEnd = task.dateEnd ? new Date(task.dateEnd) : null;
			const dateStart = task.dateStart ? new Date(task.dateStart) : null;

			const matchesDateEnd =
				dateEnd &&
				dateEnd.getFullYear() === today.getFullYear() &&
				dateEnd.getMonth() === today.getMonth() &&
				dateEnd.getDate() === today.getDate();

			const matchesDateStart =
				dateStart &&
				dateStart.getFullYear() === today.getFullYear() &&
				dateStart.getMonth() === today.getMonth() &&
				dateStart.getDate() === today.getDate();

			return matchesDateEnd || matchesDateStart;
		} catch (e) {
			console.error(
				'Error parsing date in selector:',
				task.dateEnd,
				task.dateStart,
				e,
			);
			return false;
		}
	});
});

export const selectTaskById = createSelector(
	[selectAllTasks, (_, taskId) => taskId],
	(allTasks, taskId) => {
		if (!taskId || !allTasks) return undefined;

		return allTasks.find((task) => task._id?.toString() === taskId.toString());
	},
);

export const selectTasksLoading = createSelector(
	[selectTasksState],
	(tasksState) => tasksState.loading,
);

export const selectTasksError = createSelector(
	[selectTasksState],
	(tasksState) => tasksState.error,
);
