import styled from 'styled-components';

export const Button = styled.button`
	background-color: #5b7b9a;
	color: white;
	border: none;
	padding: 8px 12px;
	margin: 4px;
	border-radius: 4px;
	cursor: pointer;

	&:hover {
		background-color: #0069d9;
	}

	${(props) =>
		props.$fullWidth &&
		`
        width: 100%;
    `}
`;
