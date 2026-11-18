import { NavLink, useNavigate } from "react-router-dom";
import { Camera, House, User, Settings, LogOut } from 'lucide-react'
import Erro from '../componentes/Erro.jsx'

// A barra de cima, com a marca e os links para as páginas.
function Menu() {
    const navegar = useNavigate()

    function sair() {
        localStorage.removeItem('token') // devolve o crachá
        navegar('/login')
    }

    return (
        <header className="navbar navbar-expand sticky-top border-bottom">
            <nav className="container flex-wrap">
                <span className="navbar-brand d-flex align-items-center gap-2 fw-bold fg-primary">
                    <Camera size={28} /> Instaclone
                </span>
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/" aria-label="Feed">
                            <House size={24} />
                            <span className="d-none md:d-inline">Feed</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/Perfil" aria-label="Perfil">
                            <User size={24} />
                            <span className="d-none md:d-inline">Perfil</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/Configuracoes" aria-label="Configurações">
                            <Settings size={24} />
                            <span className="d-none md:d-inline">Configurações</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" aria-label="Sair" onClick={sair}>
                            <LogOut size={28} />
                            <span className="d-none md:d-inline">Sair</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Menu