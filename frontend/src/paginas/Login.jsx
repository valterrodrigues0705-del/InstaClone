import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { Camera, LogIn, TriangleAlert } from 'lucide-react'
import { URL_API } from "../api.js"


function Login() {
    const [usuario, setUsuario] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const navegar = useNavigate() // permite trocar de pagina pelo codigo.

    async function entrar(evento) {
        evento.preventDefault();

        try {
            const resposta = await fetch(`${URL_API}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario: usuario,
                    senha: senha
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                setErro(dados.erro);
                return;
            }

            localStorage.setItem('token', dados.token);
            navegar('/');

        } catch (erro) {
            setErro('Não consegui falar com o servidor. Ele está ligado?');
        }
    } // FECHAMENTO DA FUNÇÃO ENTRAR

    return (
        <main className="container">
            <div className="row justify-content-center align-items-center min-vh-100">
                <div className="col-12 md:col-6 xl:col-4">
                    <article className="card">
                        <div className="card-body text-center">
                            <h1 className="fs-2xl fg-primary d-flex justify-content-center align-items-center gap-2">
                                <Camera size={36} /> Instaclone
                            </h1>
                            <p>Entre para ver as fotos da galera.</p>
                            <form onSubmit={entrar} className="d-grid gap-3">
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Usuário"
                                    aria-label="Usuário"
                                    value={usuario}
                                    onChange={(evento) => {
                                        setUsuario(evento.target.value)
                                    }
                                    }
                                />
                                <input
                                    className="form-control"
                                    type="password"
                                    placeholder="Senha"
                                    aria-label="Senha"
                                    value={senha}
                                    onChange={(evento) => {
                                        setSenha(evento.target.value)
                                    }
                                    }
                                />
                                {erro && (
                                    <div className="alert theme-danger" role="alert">
                                        <TriangleAlert size={18} /> {erro}
                                    </div>
                                )}
                                <button className="btn-solid theme-primary" type="submit">
                                    <LogIn size={18} /> Entrar
                                </button>
                            </form>
                            <small className="fg-3">Para testar, entre com o usuário ana e a senha 123456.</small>
                        </div>
                    </article>
                </div>
            </div>
        </main>
    )

}

export default Login
