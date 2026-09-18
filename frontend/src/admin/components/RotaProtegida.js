import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RotaProtegida({ children }) {
    const { autenticado, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#f9f4ef' }}>
                <div style={{ color:'#c9857a', fontSize:'0.85rem', letterSpacing:'3px', textTransform:'uppercase' }}>
                    A carregar...
                </div>
            </div>
        );
    }

    return autenticado ? children : <Navigate to="/admin/login" replace />;
}

export default RotaProtegida;
