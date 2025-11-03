import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../button/Button';
import { Logo } from './components/logo/logo';
import { NavPanel } from './components/navigation-bar/navigation-bar';
import { Icon } from '../icon/icon';
import { logout } from '../../actions';
import styled from 'styled-components';

const HeaderContainer = ({ className }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const isAuth = useSelector((state) => state.user.isAuth);

	const currentUser = useSelector((state) => state.user.currentUser);

	const username = currentUser?.username;

	const onLogout = () => {
		dispatch(logout());
		sessionStorage.removeItem('userData');
		navigate('/info');
	};

	return (
		<div className={className}>
			<div className="left-part">
				<Logo />
			</div>
			<div className="right-part">
				<NavPanel />
				{!isAuth ? (
					<Button className="button-login" onClick={() => navigate('/login')}>
						Вход
					</Button>
				) : (
					<>
						{currentUser && (
							<NavLink className="navigation" to="/profile">
								<div className="user-name">{username}</div>{' '}
							</NavLink>
						)}
						<Icon id="fa-sign-out" margin="0 0 3px 10px" onClick={onLogout} />
					</>
				)}
			</div>
		</div>
	);
};

export const Header = styled(HeaderContainer)`
	display: flex;
	justify-content: space-between;
	position: fixed;
	top: 0;
	width: 1000px;
	height: 100px;
	padding: 15px 20px;
	background-color: #cbd9eb;
	align-items: center;
	box-shadow: 0px -3px 10px #000;
	z-index: 99;

	& .left-part {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	& .right-part {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	& .button-login {
		padding: 8px 16px;
		color: #000;
		font-weight: bold;
		margin: 40px;
	}

	& .user-name {
		font-weight: bold;
		padding-bottom: 6px;
	}

	& .navigation {
		color: #333;
		text-decoration: none;
		font-weight: bold;
		&:hover {
			color: #555;
		}
	}
`;
