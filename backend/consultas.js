import banco from "./banco.js";

// 1. SELECT: escolhe as colunas que queremos ver
console.log('1. todas as pessoas')
console.table(banco.prepare('SELECT id, usuario, nome FROM usuarios').all())
// 2. WHERE: filtra as linhas (o ? é trocado pelo valor que vai dentro do .all)
console.log('2. Os posts da pessoa com id 1')
console.table(banco.prepare('SELECT id,imagem, legenda FROM posts WHERE usuario_id = ?').all(1))
// 3. ORDER BY: define a ordem (DESC = do maior para o menor)
console.log('3. Os mesmos posts, do mais novo para o mais antigo')
console.table(banco.prepare('SELECT id, imagem, legenda FROM posts WHERE usuario_id = ? ORDER BY id DESC').all(1))
// 4. JOIN: junta duas tabelas, ligando posts.usuario_id com usuarios.id
console.log('4. Os seis primeiros posts, com o nome de quem publicou')
console.table(
    banco
        .prepare(
            `SELECT posts.id, posts.legenda, usuarios.usuario AS autor
       FROM posts
       JOIN usuarios ON usuarios.id = posts.usuario_id
       ORDER BY RANDOM()
       LIMIT 3`
        )
        .all()
)
// 5. O nome e a bio da pessoa com usuario igual a 'carla'
console.log('5. O nome e a bio da pessoa com usuario igual a carla')
console.table(banco.prepare('SELECT nome, bio FROM usuarios WHERE usuario =?').all('carla'))
// 6. A legenda e o nome do autor dos posts da Carla (use o JOIN)
console.log('6. A legenda e o nome do autor dos posts da carla(usando JOIN)')
console.table(banco.prepare('SELECT posts.legenda, usuarios.nome AS autor FROM posts JOIN usuarios ON usuarios.id = posts.usuario_id WHERE usuario =?').all('carla'))
// 7. Desafio Extra
console.log('Desafio Extra')
console.table(banco.prepare('SELECT COUNT(*) AS total FROM posts').all())