import styled from 'styled-components';

export const TaskName = styled.div`
	font-size: 15px;
	font-weight: 400;
	margin-right: 15px;
	text-decoration: ${(props) => (props.$completed ? 'line-through' : 'none')};
	color: ${(props) => {
		if (props.$completed) return '#999';
		if (props.$isOverdue) return '#d32f2f';
		return '#000';
	}};
`;
