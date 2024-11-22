import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from "./pages/Login"
import Users from "./pages/Users"
import ChangePassword from './pages/ChangePassword';
import SendRecoveryPassword from "./pages/SendRecoveryPassword"
import RecoveryPassword from './pages/RecoveryPassword';
import Page404 from "./pages/Page404"
import Navbar from './components/Navbar';
import PrivateRoute from "./components/PrivateRoute";
import Records from './pages/Records';
import { AuthContextProvider } from './context/authContext';
import { ClientContextProvider } from "./context/clientContext";
import Balance from './pages/Balances';
import CheckList from './pages/CheckList';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <AuthContextProvider>
      <ClientContextProvider>
        <Router>
          <Navbar />
          <div id='wrapper' className="d-flex vh-100 overflow-auto p-0">
            <Routes>
              <Route path='/' element={<Navigate to="/login" />} />
              <Route path='login' element={<Login />} />
              <Route path='/usuarios' element={<PrivateRoute component={Users} />} />
              <Route path='/cambiar/contrasena' element={<PrivateRoute component={ChangePassword} />} />
              <Route path='/enviar/recuperacion' element={<SendRecoveryPassword/>} />
              <Route path='/recuperacion/contrasena/:token' element={<RecoveryPassword/>} />
              <Route path='*' element={<Page404 />} />

              {/* rutas privadas */}
              <Route path='/registros/diarios' element={<PrivateRoute component={Records} />} />
              <Route path='/grameras' element={<PrivateRoute component={Balance} />} />
              <Route path='/verificaciones' element={<PrivateRoute component={CheckList} />} />

            </Routes>
          </div>
        </Router>
      </ClientContextProvider>
    </AuthContextProvider>
  );
}

export default App;
