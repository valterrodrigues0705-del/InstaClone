// Tudo o que o front-end precisa para conversar com o back-end fica neste arquivo.

// Endereço da nossa API (o back-end feito com Node + Express)
export const URL_API = 'http://localhost:3000'

// Monta o endereço de uma foto guardada na pasta "uploads" do servidor
export function urlFoto(nome) {
    return `${URL_API}/uploads/${nome}`
}

// Faz um pedido ao servidor mostrando o token (o "crachá") de quem está logado.
// Devolve os dados em JSON ou lança um erro com a mensagem que o servidor mandou.
export async function chamarApi(caminho, metodo = 'GET', corpo) {
    let resposta
    try {
        resposta = await fetch(URL_API + caminho, {
            method: metodo,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: corpo
        })
    }
    catch (erro) {
        throw new erro('Não consegui falar com o servidor')
    }
    // Token vencido ou inválido: apaga o token e volta para o login
    if (resposta.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
    }
    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.Error)
    }

    return dados
}