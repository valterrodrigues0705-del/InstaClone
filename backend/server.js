import express from 'express'
import cors from 'cors'
import banco from './banco.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'

const app = express()
const PORTA = 3000
// Segredo usado para assinar os tokens. Em um projeto de verdade, ele fica em uma variável de ambiente e nunca é escrito no código.
const segredo = 'segredo-insta-clone'

// Configurações do servidor
app.use(cors()) // libera o front-end (que roda em outra porta) para conversar com a gente
app.use(express.json()) // ensina o servidor a entender dados em formato JSON
app.use('/uploads', express.static('uploads')) // deixa o navegador abrir as fotos da pasta uploads

const upload = multer({
    storage: multer.diskStorage({
        destination: 'uploads',
        filename: (req, arquivo, avisar) => {
            avisar(null, Date.now() + path.extname(arquivo.originalname))
        },
    }),
})

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
    pessoa.posts = banco
        .prepare('SELECT id, imagem, legenda FROM posts WHERE usuario_id = ? ORDER BY id DESC')
        .all(req.usuarioId)

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

// POST /posts -> publica uma foto nova (o arquivo vem no campo "imagem")
app.post('/posts', exigirlogin, upload.single('imagem'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            erro: 'Escolha uma foto para publicar.'
        })
    }
    const legenda = req.body.legenda || ''

    const resultado = banco
        .prepare('INSERT INTO posts (usuario_id, imagem, legenda) VALUES (?, ?, ?)')
        .run(req.usuarioId, req.file.filename, legenda)

    const novo = {
        id: resultado.lastInsertRowid,
        imagem: req.file.filename,
        legenda: legenda
    }
    res.status(201).json(novo)
})

// PATCH /perfil -> altera nome, bio e (se vier uma) a foto de perfil
app.patch('/perfil', exigirlogin, upload.single('foto'), (req, res) => {
    const nome = (req.body.nome || '').trim()
    const bio = (req.body.bio || '').trim()


    if (nome === '') {
        return res.status(400).json({
            erro: 'O nome não pode estar vazio.'
        })
    }


    banco
        .prepare('UPDATE usuarios SET nome = ?, bio = ? WHERE id = ?')
        .run(nome, bio, req.usuarioId)

    // Só troca a foto se a pessoa escolheu uma foto nova
    if (req.file) {
        banco
            .prepare('UPDATE usuarios SET foto = ? WHERE id = ?')
            .run(req.file.filename, req.usuarioId)
    }
    res.json(buscarPessoa(req.usuarioId))
})

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`)
})