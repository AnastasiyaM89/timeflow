import React from 'react';
import styled from 'styled-components';
import { H2 } from '../../components';

export const InfoPageContainer = ({ className }) => {
	return (
		<div className={className}>
			<H2>Доступ ограничен</H2>
			<div className="message-info">
				Вы не авторизованы для просмотра этой страницы. <br /> <br />
				Пожалуйста, войдите в систему или зарегистрируйтесь.
			</div>
		</div>
	);
};

export const InfoPage = styled(InfoPageContainer)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;

	& .message-info {
		font-size: 18px;
		margin-bottom: 20px;
	}
`;
