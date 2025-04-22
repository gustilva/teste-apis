import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { jwtDecode } from 'jwt-decode';

interface RoleGuardProps {
    allowedRoles: string[];
}

interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}

export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
    const { accessToken, isAuthenticated } = useUserStore();

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    const decodedToken = jwtDecode<JwtPayload>(accessToken);
    const userRole = decodedToken.role;

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};
