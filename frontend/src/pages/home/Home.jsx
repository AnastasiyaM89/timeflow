import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Timer } from './components/timer/Timer';
import { loadTasks } from '../../store/actions/taskActions';
import { selectAllTasks, selectTasksLoading } from '../../selectors/task-selectors';
import { Loader, H2 } from '../../components';
import { TaskTitle } from './components/task-title/task-title';
import { toggleTaskCompleted } from '../../store/actions/taskActions';
import styled from 'styled-components';

const normalizeDate = (date) => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const formatDate = (dateString) => {
	if (!dateString) return 'Нет даты';
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString('ru-RU');
	} catch (e) {
		console.error('Error formatting date:', dateString, e);
		return dateString;
	}
};

const isSameDay = (dateString, comparisonDate) => {
	if (!dateString) return false;
	try {
		const date = new Date(dateString);
		const normalizedDate = normalizeDate(date);
		const normalizedComparison = normalizeDate(comparisonDate);
		return (
			normalizedDate.getFullYear() === normalizedComparison.getFullYear() &&
			normalizedDate.getMonth() === normalizedComparison.getMonth() &&
			normalizedDate.getDate() === normalizedComparison.getDate()
		);
	} catch (e) {
		console.error('Error parsing date:', dateString, e);
		return false;
	}
};

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
	margin-right: 5px;
	cursor: pointer;
`;

const HomeContainer = ({ className }) => {
	const dispatch = useDispatch();
	const { id } = useParams();

	const allTasks = useSelector(selectAllTasks);
	const isLoading = useSelector(selectTasksLoading);

	const tasksForToday = useMemo(() => {
		const today = new Date();
		return allTasks.filter((task) => isSameDay(task.dateEnd, today));
	}, [allTasks]);

	const [selectedTaskId, setSelectedTaskId] = useState('');
	const [taskInProgress, setTaskInProgress] = useState(null);

	const handleSelectChange = (taskId) => {
		setSelectedTaskId(taskId);
		if (taskId) {
			const task = allTasks.find((t) => t._id === taskId);
			setTaskInProgress(task);
			console.log(`Starting timer for task: ${task.title}`);
		} else {
			setTaskInProgress(null);
		}
	};

	const handleCheckboxChange = (_taskId) => {
		if (!_taskId) {
			console.error('Пустой taskId в handleCheckboxChange');
			return;
		}
		dispatch(toggleTaskCompleted(_taskId));
	};

	useEffect(() => {
		dispatch(loadTasks());
	}, [dispatch]);

	if (isLoading) return <Loader />;

	return (
		<div className={className}>
			<H2>Текущая сессия</H2>
			<Timer
				tasks={allTasks || []}
				selectedTask={selectedTaskId}
				onTaskChange={handleSelectChange}
			/>

			<H2>Задачи на сегодня</H2>
			{tasksForToday.length === 0 ? (
				<p>На сегодня задач нет</p>
			) : (
				tasksForToday.map((task) => (
					<div className="task-card" key={task._id}>
						<Checkbox
							type="checkbox"
							checked={task.completed || false}
							onChange={() => handleCheckboxChange(task._id)}
						/>
						<TaskTitle $completed={task.completed}>
							{task.title || 'Без названия'}
						</TaskTitle>
						<div className="task-category">({task.category})</div>
						{task.dateEnd && (
							<div className="task-date">
								Дата: {formatDate(task.dateEnd)}
							</div>
						)}
					</div>
				))
			)}
		</div>
	);
};

export const Home = styled(HomeContainer)`
	align-items: center;
	max-width: 800px;
	margin: 20px auto;

	& .task-card {
		display: flex;
		align-items: center;
		padding: 12px;
		border: 1px solid #ccc;
		border-radius: 4px;
		margin-bottom: 8px;
		background-color: #fafafa;
	}

	& .task-category {
		font-size: 13px;
		color: #666;
		margin-left: 10px;
	}

	& .task-date {
		float: right;
		font-size: 0.9em;
		color: #555;
		margin-left: 15px;
		white-space: nowrap;
	}
`;
