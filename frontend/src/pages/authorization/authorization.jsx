import React, { useState, useEffect, useCallback } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { H2, AuthFormError, Input, Button } from '../../components';
import { useResetForm } from '../../hooks';
import { setUser } from '../../actions';
import { selectUserRole } from '../../selectors';
import { ROLE } from '../../constans';
import { request } from '../../utils/request';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';

const authFormSchema = yup.object().shape({
	login: yup
		.string()
		.required('Заполните логин')
		.matches(/^\w+$/, 'Неверно заполнен логин. Допускаются только буквы и цифры')
		.min(3, 'Минимум 3 символа')
		.max(15, 'Максимум 15 символов'),
	password: yup
		.string()
		.required('Заполните пароль')
		.matches(
			/^[\w#%]+$/,
			'Неверно заполнен пароль. Допускаются буквы, цифры и знаки # %',
		)
		.min(6, 'Минимум 6 символов')
		.max(30, 'Максимум 30 символов'),
});

const StyledLink = styled(Link)`
	text-align: center;
	text-decoration: underline;
	margin: 20px 0;
	font-size: 18px;
`;

const LoginPageContainer = ({ className }) => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			login: '',
			password: '',
		},
		resolver: yupResolver(authFormSchema),
	});

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const roleId = useSelector(selectUserRole);
	const [serverError, setServerError] = useState(null);

	useResetForm(reset);

	const onSubmit = useCallback(
		async ({ login, password }) => {
			try {
				const responseData = await request('/login', 'POST', {
					login,
					password,
				});

				if (responseData.error) {
					setServerError(`Ошибка запроса: ${responseData.error}`);
					return;
				}

				if (responseData.user && responseData.token) {
					localStorage.setItem('token', responseData.token);

					sessionStorage.setItem(
						'userData',
						JSON.stringify({
							user: responseData.user,
							token: responseData.token,
						}),
					);

					dispatch(setUser(responseData.user));

					navigate('/');
				} else {
					console.error('Missing user or token in responseData:', responseData);
					setServerError(
						'Ошибка: не удалось получить данные пользователя или токен.',
					);
				}
			} catch (error) {
				console.error('Error during login/request (async/await):', error);
				setServerError(
					error?.message ||
						'Неизвестная ошибка при авторизации. Пожалуйста, попробуйте позже.',
				);
			}
		},
		[dispatch, navigate],
	);

	const formError = errors?.login?.message || errors?.password?.message;
	const errorMessage = formError || serverError;

	if (roleId !== ROLE.GUEST) {
		return <Navigate to="/" />;
	}

	return (
		<>
			<H2>Войти</H2>
			<div className={className}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Input
						type="text"
						placeholder="Логин..."
						{...register('login', {
							onChange: () => setServerError(null),
						})}
					/>
					<Input
						type="password"
						placeholder="Пароль..."
						{...register('password', {
							onChange: () => setServerError(null),
						})}
					/>
					<Button type="submit" disabled={!!formError}>
						Войти
					</Button>
					{errorMessage && <AuthFormError>{errorMessage}</AuthFormError>}
					<StyledLink to="/register">Регистрация</StyledLink>
				</form>
			</div>
		</>
	);
};

export const LoginPage = styled(LoginPageContainer)`
	display: flex;
	flex-direction: column;
	align-items: center;

	& > form {
		display: flex;
		flex-direction: column;
		width: 260px;
	}
`;
