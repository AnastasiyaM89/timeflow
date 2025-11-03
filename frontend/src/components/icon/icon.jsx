import styled from 'styled-components';

const IconContainer = ({ className, id, onClick }) => (
	<div className={className}>
		<i className={`fa ${id}`} aria-hidden="true" onClick={onClick}></i>
	</div>
);

export const Icon = styled(IconContainer)`
	font-size: ${({ size = '24px' }) => size};
	margin: ${({ margin = '0' }) => margin};

	&:hover {
		cursor: ${({ inactive }) => (inactive ? 'default' : 'pointer')};
	}
`;
