// 인증 상태 관리(검사)
import { Children, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";


export default function AuthRequired() {
	const { user } = useContext(AuthContext);

	if (!user) {
		return <Navigate to="/accounts/login" replace={true} />
	}

	return children;
}