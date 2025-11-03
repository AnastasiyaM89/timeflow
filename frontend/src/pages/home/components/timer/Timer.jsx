import React from 'react';
import { Icon } from '../../../../components/icon/icon';
import { useTimer } from '../../../../context';
import styled from 'styled-components';

const TimerContainer = ({ className, tasks, selectedTask, onTaskChange }) => {
	const { seconds, running, startTimer, stopTimer, pauseTimer } = useTimer();

	const toggleTimer = () => {
		if (running) {
			pauseTimer();
		} else {
			startTimer();
		}
	};

	const handleStopClick = () => {
		stopTimer();
	};

	const fmt = (sec) => {
		const hrs = Math.floor(sec / 3600)
			.toString()
			.padStart(2, '0');
		const mins = Math.floor((sec % 3600) / 60)
			.toString()
			.padStart(2, '0');
		const secs = (sec % 60).toString().padStart(2, '0');
		return `${hrs}:${mins}:${secs}`;
	};

	return (
		<div className={className}>
			<div className="timer-container">
				<div className="icon-container">
					<Icon
						id={running ? 'fa-pause' : 'fa-play'}
						onClick={toggleTimer}
						size="20px"
						margin="0 8px"
					/>
					<Icon
						id="fa-stop"
						onClick={handleStopClick}
						size="20px"
						margin="0 8px"
					/>
				</div>
				<div className="clock">{fmt(seconds)}</div>
			</div>

			<div className="select-container">
				<select
					className="select-task"
					value={selectedTask ?? ''}
					onChange={(e) => {
						const selectedValue = e.target.value;
						onTaskChange(selectedValue);

						if (selectedValue && !running) {
							startTimer();
						} else if (!selectedValue) {
							stopTimer();
						}
					}}
				>
					<option value="" disabled>
						-- выберите задачу --
					</option>
					{tasks && tasks.length > 0 ? (
						tasks.map((task) => (
							<option key={task._id} value={task._id}>
								{task.title}
							</option>
						))
					) : (
						<option value="" disabled>
							Нет доступных задач
						</option>
					)}
				</select>
			</div>
		</div>
	);
};

export const Timer = styled(TimerContainer)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-bottom: 50px;

	& .timer-container {
		display: flex;
		align-items: center;
	}

	& .icon-container {
		display: flex;
		align-items: center;
		margin-right: 20px;
	}

	& .clock {
		font-size: 30px;
		font-weight: 500;
	}

	& .select-container {
		margin-top: 10px;
	}

	& .select-task {
		margin-top: 8px;
		padding: 4px 8px;
		font-size: 14px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
`;
