import React from 'react';
import { Button, Input } from '../../../../components';
import styled from 'styled-components';

const HeaderPanelContainer = ({
	className,
	search,
	setSearch,
	filterCat,
	setFilterCat,
	categories,
	sortOrder,
	setSortOrder,
	handleAdd,
}) => {
	return (
		<div className={className}>
			<div className="left-elements">
				<Input
					className="search-input"
					placeholder="Поиск..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<select
					className="category-filter"
					value={filterCat}
					onChange={(e) => setFilterCat(e.target.value)}
				>
					{categories.map((c) => (
						<option key={c} value={c}>
							{c}
						</option>
					))}
				</select>
				<select
					className="sort-filter"
					value={sortOrder}
					onChange={(e) => setSortOrder(e.target.value)}
				>
					<option value="asc">От А до Я</option>
					<option value="desc">От Я до А</option>
				</select>
			</div>
			<Button className="create-button" onClick={handleAdd}>
				+ Создать новую
			</Button>
		</div>
	);
};

export const HeaderPanel = styled(HeaderPanelContainer)`
	display: flex;
	align-items: center;

	& .search-input {
		padding: 10px 14px;
		border-radius: 4px;
		font-size: 14px;
		margin: 0 !important;
	}

	& .category-filter,
	& .sort-filter {
		padding: 10px 14px;
		border-radius: 4px;
		border: 1px solid #ccc;
		font-size: 14px;
		height: 40px;
		box-sizing: border-box;
		background-color: white;
		cursor: pointer;
	}

	& .left-elements {
		display: flex;
		gap: 15px;
		align-items: center;
	}

	& .create-button {
		margin-left: auto;
	}
`;
