import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, H2 } from '../../components';
import { updateUser } from '../../store/actions/userActions';
import { GENDER_OPTIONS } from '../../constans';
import styled from 'styled-components';

const UserProfileContainer = ({ className, user }) => {
	const [isEditing, setIsEditing] = useState(false);

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [gender, setGender] = useState(GENDER_OPTIONS.UNKNOWN);
	const [email, setEmail] = useState('');

	useEffect(() => {
		if (user) {
			setFirstName(user.firstName || user.login || '');
			setLastName(user.lastName || '');
			setGender(user.gender || GENDER_OPTIONS.UNKNOWN);
			setEmail(user.email || '');
		}
	}, [user]);

	const handleFirstNameChange = (e) => setFirstName(e.target.value);
	const handleLastNameChange = (e) => setLastName(e.target.value);
	const handleGenderChange = (e) => setGender(e.target.value);
	const handleEmailChange = (e) => setEmail(e.target.value);

	const dispatch = useDispatch();

	const handleSave = () => {
		if (!user || !user.id) {
			alert('Ошибка: Не найден ID пользователя.');
			return;
		}
		const updatedUserData = {
			firstName: firstName,
			lastName: lastName,
			gender: gender,
			email: email,
		};

		dispatch(updateUser(user.id, updatedUserData))
			.then(() => {
				setIsEditing(false);
				alert('Профиль успешно обновлен!');
			})
			.catch((error) => {
				alert('Не удалось сохранить изменения. Пожалуйста, попробуйте позже.');
			});
	};

	const renderRole = () => {
		const roleValue = user?.roleId || user?.role;

		if (roleValue === 0) {
			return 'Администратор';
		} else {
			return 'Пользователь';
		}
	};

	const renderGender = (genderValue) => {
		switch (genderValue) {
			case GENDER_OPTIONS.MALE:
				return 'Мужской';
			case GENDER_OPTIONS.FEMALE:
				return 'Женский';
			default:
				return 'Не указан';
		}
	};

	return (
		<>
			<H2>Профиль пользователя</H2>
			<div className={className}>
				<div className="container-profile">
					<div className="name-field">
						<strong>Имя:</strong>
					</div>
					{isEditing ? (
						<input
							type="text"
							value={firstName}
							onChange={handleFirstNameChange}
						/>
					) : (
						<div>{firstName || 'Не указано'}</div>
					)}

					<div className="name-field">
						<strong>Фамилия:</strong>
					</div>
					{isEditing ? (
						<input
							type="text"
							value={lastName}
							onChange={handleLastNameChange}
						/>
					) : (
						<div>{user?.lastName || 'Не указана'}</div>
					)}

					<div className="name-field">
						<strong>Роль:</strong>
					</div>
					<div>{renderRole()}</div>

					<div className="name-field">
						<strong>Пол:</strong>
					</div>
					{isEditing ? (
						<select value={gender} onChange={handleGenderChange}>
							<option value={GENDER_OPTIONS.MALE}>Мужской</option>
							<option value={GENDER_OPTIONS.FEMALE}>Женский</option>
							<option value={GENDER_OPTIONS.UNKNOWN}>Не указан</option>
						</select>
					) : (
						<div>{renderGender(user?.gender || GENDER_OPTIONS.UNKNOWN)}</div>
					)}

					<div className="name-field">
						<strong>Email:</strong>
					</div>
					{isEditing ? (
						<input type="email" value={email} onChange={handleEmailChange} />
					) : (
						<div>{user?.email || 'Не указан'}</div>
					)}
				</div>
				<div className="button-group">
					<Button
						className="button-edit-save"
						onClick={() => setIsEditing(!isEditing)}
					>
						{isEditing ? 'Отмена' : 'Редактировать'}
					</Button>
					{isEditing && (
						<Button className="button-cancel" onClick={handleSave}>
							Сохранить
						</Button>
					)}
				</div>
			</div>
		</>
	);
};

const UserProfileStyled = styled(UserProfileContainer)`
	padding: 30px;
	border: 1px solid #e0e0e0;
	border-radius: 4px;
	max-width: 600px;
	margin: 50px auto;
	background-color: #ffffff;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	align-items: center;

	& .button-group {
		display: flex;
		gap: 10px;
		margin-top: 20px;
		width: 100%;
		justify-content: flex-start;
	}

	& .button-edit-save,
	& .button-cancel {
		flex-grow: 1;
	}

	& .container-profile {
		display: grid;
		grid-template-columns: 150px 1fr;
		gap: 15px;
	}

	p,
	div div {
		margin-bottom: 15px;
		font-size: 17px;
		color: #555;
	}

	div div:first-child {
		font-weight: 500;
		color: #333;
	}

	input,
	select {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-size: 16px;
		width: 100%;
		box-sizing: border-box;
	}

	select {
		cursor: pointer;
	}
`;

export const ProfilePage = () => {
	const user = useSelector((state) => state.user.currentUser);

	return <UserProfileStyled user={user} />;
};
