import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROLE } from '../../constans/role';
import { Loader } from '../loader/Loader';

export const PrivateRoute = () => {
	const { roleId, isLoading, isAuth } = useSelector((state) => state.user);

	if (!isAuth || roleId === ROLE.GUEST) {
		return <Navigate to="/info" replace />;
	}

	if (isLoading) {
		return <Loader />;
	}

	return <Outlet />;
};
