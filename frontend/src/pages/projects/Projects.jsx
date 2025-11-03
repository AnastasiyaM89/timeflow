import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loader, H2, Icon } from '../../components';
import { TaskName } from './components/task-name/task-name';
import { HeaderPanel } from './components/header-panel/header-panel';
import { Pagination } from './components/pagination/pagination';
import {
	loadTasks,
	toggleTaskCompleted,
	deleteTask,
} from '../../store/actions/taskActions';
import styled from 'styled-components';

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
	margin-right: 5px;
	cursor: pointer;
`;

const ProjectsContainer = ({ className }) => {
	const dispatch = useDispatch();
	const tasksFromRedux = useSelector((state) => state.tasks.tasks);
	const loading = useSelector((state) => state.tasks.loading);
	const error = useSelector((state) => state.tasks.error);

	const [search, setSearch] = useState('');
	const [filterCat, setFilterCat] = useState('Все');
	const [sortOrder, setSortOrder] = useState('asc');
	const [openedCats, setOpenedCats] = useState({});
	const [currentPage, setCurrentPage] = useState(1);

	const ITEMS_PER_PAGE = 3;
	const initialCategories = ['Работа', 'Личное', 'Общая'];

	const allCategories = useMemo(() => {
		const cats = new Set(tasksFromRedux.map((t) => t.category));
		const uniqueInitialCats = initialCategories.filter((cat) => !cats.has(cat));
		const allUniqueCats = Array.from(cats);
		return ['Все', ...uniqueInitialCats, ...allUniqueCats].filter(Boolean);
	}, [tasksFromRedux]);

	useEffect(() => {
		dispatch(loadTasks());
	}, []);

	const handleToggleCategory = (category) => {
		setOpenedCats((prev) => ({
			...prev,
			[category]: !prev[category],
		}));
	};

	const navigate = useNavigate();
	const handleAdd = () => {
		navigate('/add-project-task');
	};

	const handleEdit = useCallback(
		(_id) => {
			const taskToEdit = tasksFromRedux.find((t) => t._id === _id);
			if (!taskToEdit) {
				console.error('Task not found for editing:', _id);
				return;
			}
			navigate(`/edit/${taskToEdit._id}`);
		},
		[dispatch, tasksFromRedux, navigate],
	);

	const handleDelete = useCallback(
		(taskId) => {
			if (window.confirm('Удалить эту задачу?')) {
				dispatch(deleteTask(taskId));
			}
		},
		[dispatch],
	);

	const filteredTasks = useMemo(() => {
		if (!Array.isArray(tasksFromRedux)) return [];
		let filtered = [...tasksFromRedux];

		if (filterCat !== 'Все') {
			filtered = filtered.filter((t) => t.category === filterCat);
		}
		if (search) {
			filtered = filtered.filter(
				(t) => t.title && t.title.toLowerCase().includes(search.toLowerCase()),
			);
		}

		filtered.sort((a, b) => {
			const nameA = a.title || '';
			const nameB = b.title || '';

			if (sortOrder === 'asc') {
				return nameA.localeCompare(nameB);
			} else {
				return nameB.localeCompare(nameA);
			}
		});
		return filtered;
	}, [tasksFromRedux, search, filterCat, sortOrder]);

	useEffect(() => {
		setCurrentPage(1);
	}, [search, filterCat, sortOrder]);

	const paginatedTasks = useMemo(() => {
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		return filteredTasks.slice(startIndex, endIndex);
	}, [filteredTasks, currentPage]);

	const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);

	const tasksByCat = useMemo(() => {
		const map = {};
		paginatedTasks.forEach((t) => {
			if (!map[t.category]) map[t.category] = [];
			map[t.category].push(t);
		});
		return map;
	}, [paginatedTasks]);

	if (loading) {
		return <Loader />;
	}

	if (error) {
		return <H2 style={{ color: 'red' }}>Ошибка: {error}</H2>;
	}

	const formatDisplayDate = (dateValue) => {
		if (!dateValue) {
			return '—';
		}
		const date = new Date(dateValue);
		if (isNaN(date.getTime())) {
			console.warn('Invalid date value received:', dateValue);
			return '—';
		}
		return date.toLocaleDateString('ru-RU');
	};

	const handleCheckboxChange = async (_taskId) => {
		if (!_taskId || String(_taskId).trim() === '') {
			console.error('Некорректный taskId:', _taskId);
			return;
		}

		try {
			await dispatch(toggleTaskCompleted(_taskId));
		} catch (err) {
			alert('Ошибка при обновлении задачи: ' + err.message);
		}
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const isTaskOverdue = (dateEnd) => {
		if (!dateEnd) return false;
		const endDate = new Date(dateEnd);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return endDate < today && !isNaN(endDate.getTime());
	};

	return (
		<>
			<H2>Мои проекты</H2>

			<div className={className}>
				<HeaderPanel
					search={search}
					setSearch={setSearch}
					filterCat={filterCat}
					setFilterCat={setFilterCat}
					sortOrder={sortOrder}
					setSortOrder={setSortOrder}
					categories={allCategories}
					handleAdd={handleAdd}
				/>

				<div className="content-wrapper">
					{filteredTasks.length === 0 ? (
						<H2>Пока нет задач</H2>
					) : (
						<>
							{allCategories.slice(1).map(
								(cat) =>
									tasksByCat[cat] &&
									tasksByCat[cat].length > 0 && (
										<div key={cat} style={{ marginBottom: '10px' }}>
											<div
												className="category-header"
												onClick={() => handleToggleCategory(cat)}
											>
												{cat}
												{openedCats[cat] ? (
													<Icon id="fa-caret-up" />
												) : (
													<Icon id="fa-caret-down" />
												)}
											</div>
											{openedCats[cat] && (
												<div className="tasks-wrapper">
													{tasksByCat[cat].map((t) => (
														<div
															className="task-card"
															key={t._id}
														>
															<Checkbox
																type="checkbox"
																checked={t.completed}
																onChange={() =>
																	handleCheckboxChange(
																		t._id,
																	)
																}
															/>
															<TaskName
																$completed={t.completed}
																$isOverdue={isTaskOverdue(
																	t.dateEnd,
																)}
															>
																{t.title ||
																	'Без названия'}
															</TaskName>
															<div className="right-aligned-content">
																<div className="task-date">
																	Дата завершения:{' '}
																	{formatDisplayDate(
																		t.dateEnd,
																	)}
																</div>
																<div className="buttons-group">
																	<Icon
																		id="fa-pencil-square-o"
																		size="18px"
																		margin="0 7px 0 0"
																		onClick={() =>
																			handleEdit(
																				t._id,
																			)
																		}
																	/>
																	<Icon
																		id="fa-trash"
																		size="18px"
																		margin="0 7px 0 0"
																		onClick={() =>
																			handleDelete(
																				t._id,
																			)
																		}
																	/>
																</div>
															</div>
														</div>
													))}
												</div>
											)}
										</div>
									),
							)}
						</>
					)}
				</div>

				{totalPages > 1 && (
					<div className="pagination-wrapper">
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							totalItems={filteredTasks.length}
							itemsPerPage={ITEMS_PER_PAGE}
							onPageChange={handlePageChange}
						/>
					</div>
				)}
			</div>
		</>
	);
};

export const Projects = styled(ProjectsContainer)`
	align-items: center;
	max-width: 800px;
	margin: 20px auto;
	margin-bottom: 80px;
	padding: 20px;
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);

	& .content-wrapper {
		padding-bottom: 20px;
	}

	& .pagination-wrapper {
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		border-top: 1px solid #e0e0e0;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
		z-index: 100;
		padding: 10px 0;
	}

	& .category-header {
		cursor: pointer;
		background-color: #f0f0f0;
		padding: 6px 15px;
		border-radius: 4px;
		font-weight: 600;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 10px;
	}

	& .tasks-wrapper {
		padding-left: 20px;
	}

	& .task-card {
		padding: 10px;
		margin-top: 5px;
		background-color: #fafafa;
		border: 1px solid #ccc;
		border-radius: 4px;
		display: flex;
		align-items: center;
	}

	& .right-aligned-content {
		display: flex;
		align-items: center;
		margin-left: auto;
	}

	& .task-date {
		font-size: 14px;
		color: #555;
		margin-right: 20px;
	}

	& .buttons-group {
		display: flex;
		gap: 8px;
		flex-shrink: 0;
	}
`;
