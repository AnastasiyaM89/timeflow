import React from 'react';
import styled from 'styled-components';

const ModalContainer = ({ className, onClose, time }) => {
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;

	return (
		<div className={className}>
			<div className="modal-content">
				<h2> Задача завершена! </h2>
				<p>
					Вы потратили{' '}
					{minutes > 0 ? `${minutes} минут${minutes === 1 ? 'а' : ''}` : ''}
					{seconds} секунд.
				</p>
				<button onClick={onClose}>Закрыть</button>
			</div>
		</div>
	);
};

export const Modal = styled(ModalContainer)`
	position: fixed;
	top: 0;
	left: 0;
	z-index: 100;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;

	& .modal-content {
		background-color: white;
		padding: 20px;
		border-radius: 5px;
		text-align: center;
	}
`;
