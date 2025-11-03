import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
	AddProjectTask,
	Analytics,
	EditTask,
	Home,
	InfoPage,
	LoginPage,
	ProfilePage,
	Projects,
	RegisterPage,
} from './pages';
import { PrivateRoute, Header, Footer } from './components';
import { setUser } from './actions/set-user.js';
import { TimerProvider } from './context';
import { Modal } from './pages/home/components/modal/modal.jsx';
import { logout } from './actions/logout.js';
import styled from 'styled-components';

const AppContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
	width: 1000px;
	min-height: 100%;
	margin: 0 auto;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const Page = styled.div`
	padding: 120px 0 160px;
	flex: 1;
`;

export const App = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const currentUserDataJSON = sessionStorage.getItem('userData');

		if (!currentUserDataJSON) {
			return;
		}
		try {
			const currentUserData = JSON.parse(currentUserDataJSON);

			if (!currentUserData) {
				console.error('App: Failed to parse userData from sessionStorage.');
				sessionStorage.removeItem('userData');
				dispatch(logout());
				return;
			}

			const usernameFromStorage =
				currentUserData.user?.username || currentUserData.username;
			const roleFromStorage = currentUserData.user?.role || currentUserData.role;

			let userIdFromStorage = undefined;
			if (currentUserData.user && currentUserData.user._id) {
				userIdFromStorage = currentUserData.user._id;
			} else if (currentUserData._id) {
				userIdFromStorage = currentUserData._id;
			} else if (currentUserData.id) {
				userIdFromStorage = currentUserData.id;
			} else if (currentUserData.user && currentUserData.user.id) {
				userIdFromStorage = currentUserData.user.id;
			}

			const payload = {
				username: usernameFromStorage,
				role: Number(roleFromStorage),
				firstName: currentUserData.user?.firstName,
				lastName: currentUserData.user?.lastName,
				email: currentUserData.user?.email,
				gender: currentUserData.user?.gender,
			};

			if (userIdFromStorage !== undefined && userIdFromStorage !== null) {
				payload.id = userIdFromStorage;
			} else {
				console.warn(
					'App: User ID not found in session data. It will be undefined in Redux.',
				);
			}

			dispatch(setUser(payload));
		} catch (e) {
			sessionStorage.removeItem('userData');
			dispatch(logout());
		}
	}, [dispatch, logout]);

	const [showTimerModal, setShowTimerModal] = useState(false);
	const [lastTimerSeconds, setLastTimerSeconds] = useState(0);

	const handleStopFromTimer = (seconds) => {
		setLastTimerSeconds(seconds);
		setShowTimerModal(true);
	};

	const handleStartFromTimer = () => {
		setShowTimerModal(false);
	};

	return (
		<TimerProvider
			onStopFromTimer={handleStopFromTimer}
			onStartFromTimer={handleStartFromTimer}
		>
			<AppContainer>
				<Header />
				<Page>
					<Routes>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/info" element={<InfoPage />} />

						<Route element={<PrivateRoute />}>
							<Route path="/" element={<Home />} />
							<Route path="/projects" element={<Projects />} />
							<Route path="/analytics" element={<Analytics />} />
							<Route
								path="/add-project-task"
								element={<AddProjectTask />}
							/>
							<Route path="/edit/:id" element={<EditTask />} />
							<Route path="/profile" element={<ProfilePage />} />
						</Route>

						<Route path="*" element={<Navigate to="/login" />} />
					</Routes>
				</Page>
				<Footer />
				{showTimerModal && (
					<Modal
						onClose={() => setShowTimerModal(false)}
						time={lastTimerSeconds}
					/>
				)}
			</AppContainer>
		</TimerProvider>
	);
};
