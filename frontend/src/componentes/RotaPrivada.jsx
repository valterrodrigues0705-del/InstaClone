import { Navigate, Outlet } from 'react-router-dom'
import Menu from './Menu'

// O "porteiro" do front-end: quem não tem token volta para o login.
// Quem tem, vê o menu e a página que foi pedida (o Outlet é o lugar dela).
function RotaPrivada() {
    const token = localStorage.getItem('token')

    if (!token) {
        return <Navigate to="/login" />
    }

    return (
        <>
            <Menu />
            <main className="container py-7">
                <div className="row justify-content-center">
                    <div className="col-12 md:col-8 xl:col-6">
                        <Outlet />
                    </div>
                </div>
            </main>
        </>
    )
}

export default RotaPrivada