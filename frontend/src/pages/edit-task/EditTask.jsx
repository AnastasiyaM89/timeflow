import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { editTask } from '../../store/actions/taskActions';
import { Button, H2, Loader, Input } from '../../components';
import {
	loadCategories,
	addCategory,
	deleteCategory,
} from '../../store/actions/categoryActions';
import styled from 'styled-components';

const Select = styled.select`
	width: 100%;
	padding: 10px;
	margin-bottom: 15px;
	border-radius: 4px;
`;

const EditTaskContainer = ({ className }) => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const task = useSelector((state) => state.tasks.tasks.find((t) => t._id === id));
	const isLoadingTasks = useSelector((state) => state.tasks.isLoading);

	const categoriesFromRedux = useSelector((state) => state.categories.categories || []);
	const isLoadingCategories = useSelector((state) => state.categories.isLoading);
	const categoryError = useSelector((state) => state.categories.error);

	const [newCategoryInput, setNewCategoryInput] = useState('');

	const { register, handleSubmit, reset, watch, setValue } = useForm({
		defaultValues: {
			title: '',
			category: '',
			dateStart: '',
			dateEnd: '',
		},
	});

	const currentCategory = watch('category');

	useEffect(() => {
		if (!isLoadingCategories && categoriesFromRedux.length === 0) {
			dispatch(loadCategories());
		}
	}, [dispatch, isLoadingCategories, categoriesFromRedux.length]);

	useEffect(() => {
		if (!task) return;

		const formatted = {
			title: task.title ?? '',
			category: task.category ?? 'Общая',
			dateStart: task.dateStart
				? new Date(task.dateStart).toISOString().split('T')[0]
				: '',
			dateEnd: task.dateEnd
				? new Date(task.dateEnd).toISOString().split('T')[0]
				: '',
		};

		reset(formatted);
	}, [task, reset]);

	const handleAddCategory = () => {
		if (
			!newCategoryInput.trim() ||
			categoriesFromRedux.includes(newCategoryInput.trim())
		) {
			alert('Введите название категории или она уже существует.');
			return;
		}

		dispatch(addCategory(newCategoryInput.trim())).then(() => {
			setValue('category', newCategoryInput.trim());
			setNewCategoryInput('');
		});
	};

	const handleDeleteCategory = (name) => {
		if (!confirm(`Вы уверены, что хотите удалить категорию "${name}"?`)) return;

		dispatch(deleteCategory(name)).then(() => {
			alert(`Категория "${name}" удалена.`);
			if (currentCategory === name) {
				setValue('category', '');
			}
		});
	};

	const defaultCategories = ['Работа', 'Личное', 'Общая'];
	const allCategoriesForDisplay = [
		...new Set([...defaultCategories, ...categoriesFromRedux]),
	].sort();

	const onSubmit = async (data) => {
		try {
			await dispatch(editTask(id, data));
			alert('Задача успешно обновлена!');
			navigate('/projects');
		} catch (err) {
			alert(`Не удалось сохранить изменения: ${err.message}`);
		}
	};

	if (isLoadingTasks) return <Loader />;
	if (!task && !isLoadingTasks) return <div>Задача с ID {id} не найдена.</div>;

	return (
		<>
			<H2>Редактирование задачи</H2>
			<div className={className}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Input
						className="input-field"
						{...register('title')}
						placeholder="Название задачи"
						required
					/>
					<label>Категория:</label>
					<Select
						className="select-category"
						{...register('category')}
						defaultValue={watch('category') || ''}
					>
						<option value="">-- Выберите категорию --</option>
						{isLoadingCategories && (
							<option disabled>Загрузка категорий...</option>
						)}
						{categoryError && (
							<option disabled style={{ color: 'red' }}>
								Ошибка: {categoryError}
							</option>
						)}
						{allCategoriesForDisplay.map((cat) => (
							<option key={cat} value={cat}>
								{cat}
							</option>
						))}
					</Select>
					{categoriesFromRedux.filter((cat) => !defaultCategories.includes(cat))
						.length > 0 && (
						<div className="managed-categories-group">
							<label>Управляемые категории:</label>
							<div className="managed-categories-list">
								{categoriesFromRedux
									.filter((cat) => !defaultCategories.includes(cat))
									.map((cat) => (
										<div className="managed-category-item" key={cat}>
											<div className="category-input-wrapper">
												<Input
													className="managed-category-input"
													type="text"
													value={cat}
													readOnly
												/>
											</div>
											<Button
												className="delete-category-button"
												type="button"
												onClick={() => handleDeleteCategory(cat)}
											>
												Удалить
											</Button>
										</div>
									))}
							</div>
						</div>
					)}
					<div className="new-category">
						<Input
							className="common-input"
							type="text"
							placeholder="Новая категория"
							value={newCategoryInput}
							onChange={(e) => setNewCategoryInput(e.target.value)}
						/>
						<Button
							className="new-category-button"
							type="button"
							onClick={handleAddCategory}
						>
							Добавить категорию
						</Button>
					</div>
					<label>Дата начала:</label>
					<Input {...register('dateStart')} type="date" />{' '}
					<label>Дата окончания:</label>
					<Input {...register('dateEnd')} type="date" />{' '}
					<Button className="save-button" type="submit">
						Сохранить изменения
					</Button>
				</form>
			</div>
		</>
	);
};

export const EditTask = styled(EditTaskContainer)`
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 500px;
	margin: 50px auto;
	padding: 20px;
	border: 1px solid #ddd;
	border-radius: 4px;

	& button {
		height: 40px;
		padding: 0 15px;
		margin: 0;
		box-sizing: border-box;
		white-space: nowrap;
		font-size: 14px;
		font-family: inherit;
		width: 160px;
	}

	& .save-button {
		width: 100%;
	}

	& .input-field {
		border-radius: 4px;
	}

	& .select-category {
		border: 1px solid #ccc;
		margin: 0 0 15px;
	}

	& .new-category {
		display: flex;
		gap: 10px;
		align-items: center;
		margin: 0 0 15px;
	}

	& .common-input {
		margin: 0;
		flex: 1;
	}

	& .managed-categories-group {
		width: 100%;
		margin-bottom: 20px;
	}

	& .managed-categories-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 10px 0;
	}

	& .managed-category-item {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 0 0 15 px;
	}

	& .category-input-wrapper {
		flex: 1;
	}

	& .managed-category-input {
		box-sizing: border-box;
		margin: 0;
	}

	& .delete-category-button {
		padding: 10px;
		box-sizing: border-box;
		background-color: #d32f2f;
	}

	& .delete-category-button:hover {
		background-color: #c62828;
	}
`;
