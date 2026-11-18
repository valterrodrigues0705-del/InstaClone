import { useState, useEffect } from 'react'
import { ImagePlus, Images, Upload, TriangleAlert } from 'lucide-react'
import { chamarApi, urlFoto } from '../api.js'
import Avatar from '../componentes/Avatar.jsx'
import Erro from '../componentes/Erro.jsx'


// Página do perfil: dados de quem está logado, fotos publicadas e o formulário de nova foto.

function Perfil() {
    const [pessoa, setPessoa] = useState(null) // começa vazio, até o servidor responder
    const [erro, setErro] = useState('')

    // Busca os dados e as fotos de quem está logado
    async function carregarPerfil() {
        try {
            const dados = await chamarApi('/perfil')
            setPessoa(dados)
            setErro('')
        } catch (problema) {
            setErro(problema.message)
        }
    }
    useEffect(() => {
        carregarPerfil()
    }, [])

    // Envia a foto escolhida e a legenda para o servidor
    async function publicar(evento) {
        evento.preventDefault()
        const formulario = evento.target

        try {
            await chamarApi('/posts', 'POST', new FormData(formulario))
            formulario.reset()
            carregarPerfil()

        } catch (problema) {
            setErro(problema.message)
        }
    }
    return (
        <>
            <Erro erro={erro} />

            {pessoa && (
                <section className="d-flex align-items-center gap-6 mb-7">
                    <Avatar foto={pessoa.foto} grande />
                    <div>
                        <h1 className="fs-xl mb-1">{pessoa.usuario}</h1>
                        <strong>{pessoa.nome}</strong>
                        <p className="mb-1">{pessoa.bio}</p>
                        <small className="fg-3">Publicações: {pessoa.posts.length}</small>
                    </div>
                </section>
            )}
            <article className="card mb-7">
                <div className="card-body">
                    <h2 className="fs-lg d-flex align-items-center gap-2">
                        <ImagePlus size={22} /> Nova publicação
                    </h2>
                    <form onSubmit={publicar} className="d-grid gap-3">
                        <input className="form-control" type="file" name="imagem" accept="image/*" required />
                        <input
                            className="form-control"
                            type="text"
                            name="legenda"
                            placeholder="Escreva uma legenda..."
                        />
                        <button className="btn-solid theme-primary" type="submit">
                            <Upload size={18} /> Publicar
                        </button>
                    </form>
                </div>
            </article>
        </>
    )
}

export default Perfil
