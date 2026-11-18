import { useState, useEffect } from 'react'
import { RefreshCw, Images, TriangleAlert } from 'lucide-react'
import { chamarApi } from '../api.js'
import Post from '../componentes/Post.jsx'
import Erro from '../componentes/Erro.jsx'


function Feed() {
    const [posts, setPosts] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')


    // Busca os posts no servidor (cada busca devolve uma mistura diferente)
    async function carregarFeed() {
        try {
            const dados = await chamarApi('/feed')
            setPosts(dados)
            setErro('')
        } catch (error) {
            setErro(error.message)
        }
        setCarregando(false)
    }
    // Quando a página aparece pela primeira vez, carrega o feed
    useEffect(() => {
        carregarFeed()
    }, [])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1 className="fs-xl mb-0">Feed ({posts.length})</h1>
                <button className="btn-outline theme-secondary btn-sm" onClick={carregarFeed}>
                    <RefreshCw size={18} /> Atualizar
                </button>
            </div>
            <>
                <Erro erro={erro} />
            </>
            {!carregando && !erro && posts.length === 0 && (
                <article className="card">
                    <div className="card-body text-center fg-3">
                        <Images size={40} className='align-self-center' />
                        <p>Ainda não há posts por aqui</p>
                    </div>
                </article>
            )}

            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </>
    )
}

export default Feed
