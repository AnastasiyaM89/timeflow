import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const TimerContext = createContext();

export const TimerProvider = ({ children, onStopFromTimer, onStartFromTimer }) => {
	const [seconds, setSeconds] = useState(0);
	const [running, setRunning] = useState(false);

	const intervalRef = useRef(null);

	useEffect(() => {
		const savedTime = localStorage.getItem('timerSeconds');
		const savedRunning = localStorage.getItem('timerRunning') === 'true';

		if (savedTime) {
			setSeconds(parseInt(savedTime, 10));
		}
		if (savedRunning) {
			setRunning(true);
		}
	}, []);

	useEffect(() => {
		if (running) {
			intervalRef.current = setInterval(() => {
				setSeconds((s) => {
					const newSeconds = s + 1;
					localStorage.setItem('timerSeconds', newSeconds.toString());
					return newSeconds;
				});
			}, 1000);
		}

		return () => {
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current);
			}
		};
	}, [running]);

	const startTimer = () => {
		setRunning(true);
		localStorage.setItem('timerRunning', 'true');
		onStartFromTimer?.();
	};

	const pauseTimer = () => {
		setRunning(false);
		localStorage.setItem('timerRunning', 'false');
	};

	const stopTimer = (options = { silent: false }) => {
		if (intervalRef.current !== null) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		pauseTimer();

		if (!options.silent) {
			onStopFromTimer?.(seconds);
		}

		setSeconds(0);
		localStorage.removeItem('timerSeconds');
	};

	return (
		<TimerContext.Provider
			value={{ seconds, running, startTimer, stopTimer, pauseTimer }}
		>
			{children}
		</TimerContext.Provider>
	);
};

export const useTimer = () => {
	const ctx = useContext(TimerContext);
	if (!ctx) throw new Error('useTimer must be used within TimerProvider');
	return ctx;
};
