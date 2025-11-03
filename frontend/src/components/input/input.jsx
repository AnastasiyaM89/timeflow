import { forwardRef } from 'react';
import styled from 'styled-components';

const InputContainer = forwardRef(({ className, width, ...props }, ref) => {
	return <input className={className} {...props} ref={ref} />;
});

export const Input = styled(InputContainer)`
	width: ${({ width = '100%' }) => width};
	height: 40px;
	margin: 0 0 15px;
	padding: 10px;
	font-size: 16px;
	box-sizing: border-box;
	border-radius: 4px;
	border: 1px solid #ccc;
`;
