import styled from 'styled-components';

export const TaskTitle = styled.div`
	font-size: 15px;
	font-weight: 400;
	text-decoration: ${(props) => (props.$completed ? 'line-through' : 'none')};
	color: ${(props) => (props.$completed ? '#999' : '#000')};
	flex: 1;
`;
