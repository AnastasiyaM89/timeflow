import React from 'react';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { H2 } from '../../components';
import styled from 'styled-components';

ChartJS.register(ArcElement, Tooltip, Legend);

const AnalyticsContainer = ({ className }) => {
	const tasks = useSelector((state) => state.tasks.tasks);

	const categoryCounts = {};
	tasks.forEach((t) => {
		categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
	});
	const categoryLabels = Object.keys(categoryCounts);
	const categoryData = Object.values(categoryCounts);

	const statusCounts = { Завершено: 0, 'Не завершено': 0 };
	tasks.forEach((t) => {
		if (t.completed) {
			statusCounts['Завершено'] += 1;
		} else {
			statusCounts['Не завершено'] += 1;
		}
	});
	const statusLabels = Object.keys(statusCounts);
	const statusData = Object.values(statusCounts);

	const dataCategories = {
		labels: categoryLabels,
		datasets: [
			{
				label: 'Задачи по категориям',
				data: categoryData,
				backgroundColor: [
					'#36A2EB',
					'#FF6384',
					'#FFCE56',
					'#4BC0C0',
					'#9966FF',
					'#FF9F40',
				],
				hoverOffset: 4,
			},
		],
	};

	const dataStatus = {
		labels: statusLabels,
		datasets: [
			{
				label: 'Статус задач',
				data: statusData,
				backgroundColor: ['#4BC0C0', '#FF6384'],
				hoverOffset: 4,
			},
		],
	};

	return (
		<>
			<H2>Аналитика задач</H2>
			<div className={className}>
				<div className="diagrams-wrapper">
					<div className="chart-container">
						<h2 style={{ textAlign: 'center' }}>Задачи по категориям</h2>
						{categoryLabels.length > 0 ? (
							<Pie data={dataCategories} />
						) : (
							<p style={{ textAlign: 'center' }}>Нет данных</p>
						)}
					</div>
					<div className="chart-container">
						<h2 style={{ textAlign: 'center' }}>Статус задач</h2>
						<Pie data={dataStatus} />
					</div>
				</div>
			</div>
		</>
	);
};

export const Analytics = styled(AnalyticsContainer)`
	max-width: 1000px;
	margin: 20px auto;
	padding: 20px;

	& .diagrams-wrapper {
		display: flex;
		gap: 40px;
		justify-content: center;
		flex-wrap: wrap;
	}

	& .chart-container {
		width: 300px;
		height: 300px;
	}
`;
