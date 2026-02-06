require('dotenv').config({ path: '.env.local' });

const TEST_URL = 'http://localhost:3000/api/payments';
const API_KEY = process.env.ADMIN_API_KEY;

async function testAuth() {
    console.log("🚀 Iniciando teste de autenticação nativo...");
    console.log(`🔑 Usando a chave: ${API_KEY ? 'Configurada (OK)' : 'NÃO ENCONTRADA NO .ENV'}`);

    // 1. Teste sem chave
    try {
        const res1 = await fetch(TEST_URL);
        console.log(`✅ Teste 1: Status ${res1.status} (Esperado: 401 ou 403)`);
    } catch (e) {
        console.log("❌ Erro de conexão no Teste 1. O servidor 'npm run dev' está ligado?");
        return;
    }

    // 2. Teste com a chave
    try {
        const res2 = await fetch(TEST_URL, {
            method: 'POST', // Geralmente rotas de pagamento são POST
            headers: {
                'x-admin-api-key': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ test: true })
        });

        console.log(`📡 Resposta do Servidor: Status ${res2.status}`);

        if (res2.ok || res2.status === 422 || res2.status === 200) {
            console.log("✅ Teste 2: Sucesso! O servidor reconheceu a requisição com a chave.");
        } else {
            const text = await res2.text();
            console.log(`⚠️ Detalhe do erro: ${text}`);
        }
    } catch (e) {
        console.error("❌ Erro de conexão.");
    }
}

testAuth();