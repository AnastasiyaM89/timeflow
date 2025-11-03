import React from 'react';
import styled from 'styled-components';
import { Icon } from '../../../../components';

const PageButton = styled.button`
	padding: 8px 12px;
	border: 1px solid #ccc;
	border-radius: 4px;
	background-color: ${(props) => (props.$active ? '#007bff' : '#fff')};
	color: ${(props) => (props.$active ? '#fff' : '#000')};
	cursor: pointer;
	font-size: 14px;
	font-weight: ${(props) => (props.$active ? '600' : '400')};
	transition: all 0.3s ease;
	min-width: 40px;

	&:hover {
		background-color: ${(props) => (props.$active ? '#0056b3' : '#f0f0f0')};
		border-color: ${(props) => (props.$active ? '#0056b3' : '#999')};
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;

const PaginationContainer = ({
	className,
	currentPage,
	totalPages,
	onPageChange,
	itemsPerPage,
	totalItems,
}) => {
	const getPageNumbers = () => {
		const pages = [];
		const maxVisible = 5;
		let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
		let endPage = Math.min(totalPages, startPage + maxVisible - 1);

		if (endPage - startPage + 1 < maxVisible) {
			startPage = Math.max(1, endPage - maxVisible + 1);
		}

		if (startPage > 1) {
			pages.push(1);
			if (startPage > 2) {
				pages.push('...');
			}
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				pages.push('...');
			}
			pages.push(totalPages);
		}

		return pages;
	};

	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	};

	if (totalPages <= 1) return null;

	const pageNumbers = getPageNumbers();

	return (
		<div className={className}>
			<PageButton
				onClick={handlePrevious}
				disabled={currentPage === 1}
				title="Предыдущая страница"
			>
				<Icon id="fa-chevron-left" size="14px" />
			</PageButton>

			{pageNumbers.map((page, index) => (
				<div key={index}>
					{page === '...' ? (
						<PageInfo>...</PageInfo>
					) : (
						<PageButton
							$active={page === currentPage}
							onClick={() => onPageChange(page)}
						>
							{page}
						</PageButton>
					)}
				</div>
			))}

			<PageButton
				onClick={handleNext}
				disabled={currentPage === totalPages}
				title="Следующая страница"
			>
				<Icon id="fa-chevron-right" size="14px" />
			</PageButton>
		</div>
	);
};

export const Pagination = styled(PaginationContainer)`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 8px;
	margin-top: 5px;
	margin-bottom: 5px;
	padding: 5px 0;
	background-color: #fff;
`;
