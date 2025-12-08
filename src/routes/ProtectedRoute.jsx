import {Navigate} from 'react-router-dom'

const ProtectedRoute = ({children}) => {
    const isAuthenticated = localStorage.getItem('adminToken');

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace></Navigate>;
    }
    return children;
}
export default ProtectedRoute;