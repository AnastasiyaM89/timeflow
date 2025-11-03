import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { H2, AuthFormError, Input } from '../../components';
import { useResetForm } from '../../hooks';
import { setUser } from '../../actions';
import { selectUserRole } from '../../selectors';
import { ROLE } from '../../constans';
import { request } from '../../utils/request';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../components/button/Button';
import styled from 'styled-components';

const regFormSchema = yup.object().shape({
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
	passcheck: yup
		.string()
		.required('Заполните повтор пароля')
		.oneOf([yup.ref('password'), null], 'Повтор пароля не совпадает'),
});

const RegisterPageContainer = ({ className }) => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			login: '',
			password: '',
			passcheck: '',
		},
		resolver: yupResolver(regFormSchema),
	});

	const [serverError, setServerError] = useState(null);
	const dispatch = useDispatch();
	const roleId = useSelector(selectUserRole);

	useResetForm(reset);
	const navigate = useNavigate();

	const onSubmit = async ({ login, password }) => {
		setServerError(null);

		try {
			const responseData = await request('/register', 'POST', { login, password });

			if (responseData.error) {
				setServerError(responseData.error || responseData.message);
				return;
			}

			if (responseData.user && responseData.token) {
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
				setServerError('Ошибка: Некорректный ответ от сервера.');
				console.error(
					'Registration response missing user or token:',
					responseData,
				);
			}
		} catch (error) {
			console.error('Ошибка при отправке запроса (onSubmit):', error);
			let errorMessage = 'Произошла неизвестная ошибка';

			if (error.message && error.message.includes('status: 409')) {
				if (error.serverMessage) {
					errorMessage = error.serverMessage;
				} else {
					errorMessage = 'Пользователь с таким логином уже существует.';
				}
			} else if (error.message) {
				errorMessage = error.message;
			}

			setServerError(errorMessage);
		}
	};

	const formError =
		errors?.login?.message || errors?.password?.message || errors?.passcheck?.message;
	const errorMessage = formError || serverError;

	if (roleId !== ROLE.GUEST) {
		return <Navigate to="/" />;
	}

	return (
		<div className={className}>
			<H2>Регистрация</H2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					type="text"
					placeholder="Логин..."
					{...register('login', { onChange: () => setServerError(null) })}
				/>
				<Input
					type="password"
					placeholder="Пароль..."
					{...register('password', { onChange: () => setServerError(null) })}
				/>
				<Input
					type="password"
					placeholder="Проверка пароля..."
					{...register('passcheck', { onChange: () => setServerError(null) })}
				/>
				<Button type="submit" disabled={!!formError}>
					Зарегистрироваться
				</Button>
				{errorMessage && <AuthFormError>{errorMessage}</AuthFormError>}
			</form>
		</div>
	);
};

export const RegisterPage = styled(RegisterPageContainer)`
	display: flex;
	flex-direction: column;
	align-items: center;

	& > form {
		display: flex;
		flex-direction: column;
		width: 260px;
	}
`;
