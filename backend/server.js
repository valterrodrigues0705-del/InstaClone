import express from 'express'
import cors from 'cors'
import banco from './banco.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const app = express()
const PORTA = 3000
// Segredo usado para assinar os tokens. Em um projeto de verdade, ele fica em uma variável de ambiente e nunca é escrito no código.
const segredo = 'segredo-insta-clone'

// Configurações do servidor
app.use(cors()) // libera o front-end (que roda em outra porta) para conversar com a gente
app.use(express.json()) // ensina o servidor a entender dados em formato JSON
app.use('/uploads', express.static('uploads')) // deixa o navegador abrir as fotos da pasta uploads

//PORTEIRO
function exigirlogin(req, res, next) {
    const cabecalho = req.headers.authorization //chega assim: "Bearer eyJhbGci..."

    if (!cabecalho) {
        res.status(401).json({
            erro: "Faça login para continuar."
        })
    }

    const token = cabecalho.split(' ')[1]

    try {
        const dados = jwt.verify(token, segredo)
        req.usuarioId = dados.id // guarda quem é a pessoa, para as rotas usarem
        next() // pode passar!
    } catch {
        res.status(401).json({
            erro: "Sessão invalida faça login de novo"
        })
    }
}
// Busca os dados de uma pessoa (nunca devolve a senha!)
function buscarPessoa(id) {
    return banco
        .prepare('SELECT id, usuario, nome, bio, foto FROM usuarios WHERE id = ?')
        .get(id)
}

// POST /login -> confere usuário e senha e devolve um token
app.post('/login', (req, res) => {
    const usuario = req.body.usuario
    const senha = req.body.senha

    if (!usuario || !senha) {
        return res.status(400).json({
            erro: 'Informe o usuário e a senha.'
        })
    }
    const pessoa = banco
        .prepare('SELECT * FROM usuarios WHERE usuario = ?')
        .get(usuario)

    if (!pessoa || !bcrypt.compareSync(senha, pessoa.senha)) {
        return res.status(401).json({
            erro: 'Usuário ou senha incorretos.'
        })
    }
    const token = jwt.sign({ id: pessoa.id }, segredo, { expiresIn: '7d' })
    res.json({
        token: token
    })
})

// GET /perfil -> devolve os dados de quem está logado
app.get('/perfil', exigirlogin, (req, res) => {
    const pessoa = buscarPessoa(req.usuarioId)

    res.json(pessoa)
})

// GET /feed -> devolve posts de todo mundo, em ordem aleatória
app.get('/feed', exigirlogin, (req, res) => {
    const posts = banco
        .prepare(
            `SELECT posts.id, posts.imagem, posts.legenda,
             usuarios.usuario AS autor, usuarios.foto AS fotoAutor
             FROM posts
             JOIN usuarios ON usuarios.id = posts.usuario_id
             ORDER BY RANDOM()
             LIMIT 10`)
        .all()

    res.json(posts)
})

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`)
})