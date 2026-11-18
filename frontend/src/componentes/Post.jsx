import { urlFoto } from "../api";
import Avatar from './Avatar.jsx'

// Mostra UM post do feed: quem postou, a foto e a legenda.
// Os dados chegam do componente pai através da prop "post"

function Post({ post }) {
    return (
        <article className="card mb-5">
            <div className="card-body flex-row align-items-center py-4">
                <Avatar foto={post.fotoAutor} grande />

                <strong>{post.autor}</strong>
            </div>
            <img className="w-100 ratio-1x1 object-fit-cover"

                src={urlFoto(post.imagem)}

                alt={post.legenda}
            />
            <div className="card-body py-4">
                <p>
                    <strong>{post.autor}</strong>{post.legenda}
                </p>
            </div>

        </article>
    )
}

export default Post