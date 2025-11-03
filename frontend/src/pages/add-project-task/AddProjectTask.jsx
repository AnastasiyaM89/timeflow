import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../../store/actions/taskActions';
import { useNavigate } from 'react-router-dom';
import { Button, H2, Input } from '../../components';
import { loadCategories, addCategory } from '../../store/actions/categoryActions';
import { loadTasks } from '../../store/actions/taskActions';
import styled from 'styled-components';

const AddProjectTaskContainer = ({ className }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const currentUser = useSelector((state) => state.user.currentUser);
	const loaded = useSelector((s) => s.categories.loaded);

	const { register, handleSubmit, setValue } = useForm();
	const categoriesFromRedux = useSelector((state) => state.categories.categories || []);
	const [newCategoryInput, setNewCategoryInput] = useState('');

	useEffect(() => {
		if (!loaded) dispatch(loadCategories());
	}, [dispatch, loaded]);

	const handleAddCategory = (e) => {
		e.preventDefault();
		if (
			newCategoryInput.trim() &&
			!categoriesFromRedux.includes(newCategoryInput.trim())
		) {
			dispatch(addCategory(newCategoryInput.trim()));
			setValue('category', newCategoryInput.trim());
		}
		setNewCategoryInput('');
	};

	const onSubmit = async (data) => {
		try {
			const newTask = {
				title: data.title,
				category: data.category ?? 'Общая',
				dateStart: data.dateStart,
				dateEnd: data.dateEnd,
				author: currentUser?.id ?? '',
			};

			await dispatch(addTask(newTask));

			await dispatch(loadTasks());

			navigate('/projects');
		} catch (e) {
			console.error('Error adding task:', e);
			setServerError('Не удалось добавить задачу. Попробуйте позже.');
		}
	};

	const defaultCategories = ['Работа', 'Личное', 'Общая'];
	const allCategoriesForDisplay = [
		...new Set([...defaultCategories, ...categoriesFromRedux]),
	].sort();

	return (
		<>
			<H2>Новая задача</H2>
			<div className={className}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Input
						div
						className="name-task"
						{...register('title', { required: true })}
						placeholder="Название задачи"
						required
					/>

					<select
						className="select-category"
						{...register('category', { required: true })}
					>
						<option value="">-- Выберите категорию --</option>
						{allCategoriesForDisplay.map((cat) => (
							<option key={cat} value={cat}>
								{cat}
							</option>
						))}
					</select>
					<div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
						<input
							type="text"
							placeholder="Новая категория"
							value={newCategoryInput}
							onChange={(e) => setNewCategoryInput(e.target.value)}
							style={{
								flex: 1,
								padding: '10px',
								borderRadius: '4px',
								border: '1px solid #ccc',
							}}
						/>
						<Button type="button" onClick={handleAddCategory} $fullWidth>
							Добавить категорию
						</Button>
					</div>

					<label>Дата начала:</label>
					<input
						{...register('dateStart')}
						type="date"
						style={{
							width: '100%',
							padding: '10px',
							borderRadius: '4px',
							border: '1px solid #ccc',
							marginBottom: '15px',
						}}
					/>

					<label>Дата окончания:</label>
					<input
						{...register('dateEnd')}
						type="date"
						style={{
							width: '100%',
							padding: '10px',
							borderRadius: '4px',
							border: '1px solid #ccc',
							marginBottom: '15px',
						}}
					/>

					<Button type="submit" $fullWidth>
						Создать задачу
					</Button>
				</form>
			</div>
		</>
	);
};

export const AddProjectTask = styled(AddProjectTaskContainer)`
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 500px;
	margin: 50px auto;
	padding: 20px;
	border: 1px solid #ddd;
	border-radius: 8px;

	& .select-category {
		width: 100%;
		padding: 10px;
		margin-bottom: 15px;
		border-radius: 4px;
		border: 1px solid #ccc;
	}

	& .name-task {
		margin-bottom: 15px;
		border-radius: 4px;
		border: 1px solid #ccc;
	}
`;
