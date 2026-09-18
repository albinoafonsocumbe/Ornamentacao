import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ── Contexto ──────────────────────────────────────
import { AuthProvider } from './admin/context/AuthContext';
import RotaProtegida   from './admin/components/RotaProtegida';

// ── Público ───────────────────────────────────────
import Navbar       from './components/Navbar';
import Footer       from './components/Footer';
import WhatsAppBtn  from './components/WhatsAppBtn';
import Inicio      from './pages/Inicio';
import Sobre       from './pages/Sobre';
import Servicos    from './pages/Servicos';
import Eventos     from './pages/Eventos';
import Pacotes     from './pages/Pacotes';
import Portefolio  from './pages/Portefolio';
import Calculadora from './pages/Calculadora';
import Contacto    from './pages/Contacto';

// ── Admin ─────────────────────────────────────────
import AdminLogin      from './admin/pages/Login';
import Dashboard       from './admin/pages/Dashboard';
import AdminServicos   from './admin/pages/AdminServicos';
import AdminPacotes    from './admin/pages/AdminPacotes';
import AdminPortefolio from './admin/pages/AdminPortefolio';
import AdminPedidos    from './admin/pages/AdminPedidos';
import AdminTarifas    from './admin/pages/AdminTarifas';

import './App.css';

function LayoutPublico({ children }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <WhatsAppBtn />
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* ── Público ── */}
                    <Route path="/" element={<LayoutPublico><Inicio /></LayoutPublico>} />
                    <Route path="/sobre" element={<LayoutPublico><Sobre /></LayoutPublico>} />
                    <Route path="/servicos" element={<LayoutPublico><Servicos /></LayoutPublico>} />
                    <Route path="/eventos" element={<LayoutPublico><Eventos /></LayoutPublico>} />
                    <Route path="/pacotes" element={<LayoutPublico><Pacotes /></LayoutPublico>} />
                    <Route path="/portefolio" element={<LayoutPublico><Portefolio /></LayoutPublico>} />
                    <Route path="/calculadora" element={<LayoutPublico><Calculadora /></LayoutPublico>} />
                    <Route path="/contacto" element={<LayoutPublico><Contacto /></LayoutPublico>} />

                    {/* ── Admin ── */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

                    <Route path="/admin/dashboard" element={
                        <RotaProtegida><Dashboard /></RotaProtegida>
                    } />
                    <Route path="/admin/servicos" element={
                        <RotaProtegida><AdminServicos /></RotaProtegida>
                    } />
                    <Route path="/admin/pacotes" element={
                        <RotaProtegida><AdminPacotes /></RotaProtegida>
                    } />
                    <Route path="/admin/portefolio" element={
                        <RotaProtegida><AdminPortefolio /></RotaProtegida>
                    } />
                    <Route path="/admin/pedidos" element={
                        <RotaProtegida><AdminPedidos /></RotaProtegida>
                    } />
                    <Route path="/admin/tarifas" element={
                        <RotaProtegida><AdminTarifas /></RotaProtegida>
                    } />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
