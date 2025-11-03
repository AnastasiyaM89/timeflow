import { Link } from 'react-router-dom';
import { Icon } from '../../../icon/icon';
import styled from 'styled-components';

const LogoContainer = ({ className }) => (
	<Link className={className} to="/">
		<Icon id="fa-clock-o" size="50px" margin="0 30px" />
		<div className="logo">
			<div className="logo-name">Time </div>
			<div className="logo-name">flow</div>
		</div>
	</Link>
);

export const Logo = styled(LogoContainer)`
	display: flex;
	margin-top: -5px;

	& .logo-name {
		font-size: 24px;
		font-weight: 700;
		line-height: 0.5;
		margin: 15px;
		text-align: center;
	}
`;
