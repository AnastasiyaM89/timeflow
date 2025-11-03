import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const NavPanelContainer = ({ className }) => {
	return (
		<div className={className}>
			<NavLink className="link-menu" to="/">
				Главная
			</NavLink>
			<NavLink className="link-menu" to="/projects">
				Проекты
			</NavLink>
			<NavLink className="link-menu" to="/analytics">
				Аналитика
			</NavLink>
		</div>
	);
};

export const NavPanel = styled(NavPanelContainer)`
	display: flex;
	gap: 15px;

	& .link-menu {
		color: #000;
		text-decoration: none;
		padding-bottom: 4px;
		border-bottom: 2px solid transparent;

		&.active {
			font-weight: bold;
		}

		&:hover {
			border-bottom: 1px solid #000;
		}
	}
`;
