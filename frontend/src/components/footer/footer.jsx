import styled from 'styled-components';

const FooterContainer = ({ className }) => {
	const currentYear = new Date().getFullYear();
	return (
		<div className={className}>
			<div>&copy; TimeFlow</div>
			<div>{currentYear} год</div>
		</div>
	);
};

export const Footer = styled(FooterContainer)`
	padding: 20px 40px;
	display: flex;
	justify-content: space-between;
	background-color: #cbd9eb;
	align-items: center;
	border-top: 1px solid #ccc;
	font-weight: 500;
	height: 100px;
	width: 1000px;
	box-shadow: 0px 3px 10px #000;
	position: fixed;
	bottom: 0;
	z-index: 1000;
`;
