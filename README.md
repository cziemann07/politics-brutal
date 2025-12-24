# Política Sem Filtro

Um projeto open source que visa facilitar o entendimento político do cidadão brasileiro médio, combatendo a idolatria política e o "voto de cabresto" através da transparência de dados.

## 🎯 Objetivo

O Brasil é um país onde a população é extremamente conectada à política, mas muitas vezes falta educação e discernimento. Isso resulta em:

- **Voto de cabresto**: Eleitores que votam sem conhecimento adequado
- **Idolatria política**: Pessoas que não exigem responsabilidade dos seus políticos
- **Falta de fiscalização**: Cidadãos que não sabem quem está gastando acima do teto, quais projetos seus deputados votaram, etc.

Este projeto busca mudar isso, fornecendo dados crus e transparentes sobre:

- Gastos parlamentares (CEAP - Cota para Exercício da Atividade Parlamentar)
- Status de regularidade dos deputados
- Informações sobre a bancada federal
- Dados sobre escândalos e controvérsias

## 🏗️ Estrutura do Projeto

### Tecnologias

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS** (estilo "brutal" - design bold e direto)

### Estrutura de Pastas

```
politics-brutal/
├── app/
│   ├── api/                    # Rotas de API
│   │   ├── bancada/            # Endpoint para calcular CEAP da bancada
│   │   └── deputados/          # Endpoints para buscar deputados
│   │       └── [id]/           # Endpoint para um deputado específico
│   ├── bancada/                # Página da bancada federal
│   ├── politico/[id]/          # Página de perfil do político
│   ├── metodologia/            # Página explicando a metodologia
│   └── page.tsx                # Página inicial
├── components/
│   ├── features/               # Componentes de features específicas
│   │   ├── Blocks/            # Blocos de conteúdo (escândalos, etc)
│   │   ├── Cost/              # Componentes de custos
│   │   ├── Dictionary/        # Dicionário de termos
│   │   ├── Pyramid/           # Pirâmide de poder
│   │   └── Scandals/          # Dossiês de escândalos
│   └── ui/                    # Componentes de UI reutilizáveis
├── lib/
│   ├── camara.ts              # Funções para interagir com API da Câmara
│   └── ceapTeto.ts            # Valores de teto CEAP por UF
└── public/                    # Arquivos estáticos
```

## 📊 Fontes de Dados

O projeto utiliza a **API de Dados Abertos da Câmara dos Deputados**:

- https://dadosabertos.camara.leg.br/api/v2

### Dados Utilizados

- Lista de deputados em exercício
- Despesas parlamentares (CEAP)
- Informações básicas dos deputados (nome, partido, UF, foto)

### Teto CEAP por UF

Os valores de teto da CEAP são baseados no **Ato da Mesa nº 43/2009** (com redação do Ato da Mesa nº 76/2016). Os valores estão definidos em `lib/ceapTeto.ts`.

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
```

O projeto estará disponível em `http://localhost:3000`

## 🔧 Funcionalidades Principais

### 1. Página Inicial (`/`)

- Visão geral do projeto
- Destaque para maior gastador do mês
- Seções sobre escândalos, pirâmide de poder, dicionário de termos
- Blocos informativos sobre temas polêmicos

### 2. Bancada Federal (`/bancada`)

- Lista completa de deputados federais
- Busca por nome ou partido
- Filtro por estado (UF)
- Botão para carregar dados de CEAP (gastos)
- Status de regularidade (Regular/Irregular baseado no teto)

### 3. Perfil do Político (`/politico/[id]`)

- Informações detalhadas do deputado
- Gastos mensais (CEAP)
- Cálculo do custo total para o bolso do cidadão
- Ficha corrida (processos)
- Fatos e controvérsias

### 4. Metodologia (`/metodologia`)

- Explicação sobre como os dados são coletados
- Critérios de classificação (Regular/Irregular)

## 📡 APIs do Projeto

### `GET /api/deputados`

Busca lista de deputados.

**Query params:**

- `emExercicio` (boolean): Filtrar apenas deputados em exercício

**Resposta:**

```json
{
  "dados": [
    {
      "id": 123,
      "name": "Nome do Deputado",
      "party": "PT",
      "state": "SP",
      "role": "Deputado Federal",
      "image": "url_da_foto"
    }
  ]
}
```

### `GET /api/deputados/[id]`

Busca dados de um deputado específico, incluindo gastos CEAP.

**Resposta:**

```json
{
  "id": 123,
  "name": "Nome do Deputado",
  "party": "PT",
  "state": "SP",
  "role": "Deputado Federal",
  "image": "url_da_foto",
  "expenses": 45000.5,
  "teto": 46700,
  "status": "Regular"
}
```

### `GET /api/bancada?ano=YYYY&mes=MM`

Calcula CEAP para todos os deputados de um mês específico.

**Query params:**

- `ano` (obrigatório): Ano (ex: 2024)
- `mes` (obrigatório): Mês (1-12)

**Resposta:**

```json
{
  "ano": 2024,
  "mes": 9,
  "totalDeputados": 513,
  "dados": [
    {
      "id": 123,
      "expenses": 45000.5,
      "teto": 46700,
      "status": "Regular"
    }
  ]
}
```

**Nota:** Esta API usa cache local (`.cache/bancada-YYYY-MM.json`) para evitar múltiplas requisições.

## 🐛 Problemas Conhecidos e Correções

### ✅ Problemas Corrigidos

1. **Arquivo de dados faltante**: A página `/politico/[id]` estava tentando importar `data/politicians.ts` que não existia. **Corrigido**: Agora busca dados da API.

2. **Inconsistência nos valores de teto CEAP**: Havia dois arquivos com valores diferentes. **Corrigido**: Agora usa apenas `lib/ceapTeto.ts` como fonte única.

3. **Parâmetro `emExercicio` não funcionava**: A API `/api/deputados` não estava usando o parâmetro. **Corrigido**: Agora filtra corretamente.

4. **Página do político usava dados mock**: **Corrigido**: Agora busca dados reais da API da Câmara.

## 🔔 Sistema de Notificações

O projeto inclui um sistema completo de notificações para alertar usuários sobre atividades dos deputados que eles seguem.

### Funcionalidades

- **Alertas de Faltas**: Notifica quando um deputado falta em votações
- **Alertas de Gastos**: Notifica quando gastos excedem o teto CEAP
- **Resumo Semanal**: Digest com resumo das atividades
- **Configurações Personalizáveis**: Usuário escolhe quais alertas receber

### Configuração

1. **Supabase**: Execute o schema em `supabase/notifications-schema.sql`
2. **Resend**: Configure a API key para envio de e-mails
3. **Cron Jobs**: Configure para chamar `/api/absences/check` periodicamente

### Variáveis de Ambiente

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Resend (e-mails)
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=Política Sem Filtro <noreply@seudominio.com.br>

# Aplicação
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Segurança (cron jobs)
CRON_SECRET=your-secret-token
```

### APIs de Notificação

- `GET /api/absences/check` - Verifica faltas e envia notificações (cron)
- `POST /api/absences/check` - Verifica faltas de um deputado específico
- `GET /api/absences/[deputadoId]` - Histórico de faltas do deputado
- `GET/PUT /api/notifications` - Lista e marca notificações como lidas
- `GET/PUT /api/notifications/settings` - Configurações de notificação
- `GET/POST/DELETE /api/followed-deputies` - Deputados seguidos

## 🔄 Próximos Passos Sugeridos

1. **Atualizar dados de processos/escândalos**: A página do político ainda não busca processos reais. Considere integrar com APIs de processos judiciais.

2. ~~**Adicionar histórico de votos**: Mostrar como cada deputado votou em projetos importantes.~~ ✅ Implementado

3. ~~**Sistema de notificações**: Alertar quando um deputado ultrapassar o teto.~~ ✅ Implementado

4. **Comparações**: Permitir comparar gastos entre deputados, partidos, estados.

5. **Gráficos e visualizações**: Adicionar mais visualizações de dados.

6. **Notificações por WhatsApp**: Integrar com WhatsApp Business API.

## 📝 Notas Importantes

- **Cache**: A API `/api/bancada` usa cache local para evitar sobrecarregar a API da Câmara. O cache fica em `.cache/`.
- **Rate Limiting**: A API da Câmara pode ter limites de requisições. O código já implementa paginação e cache para minimizar requisições.
- **Dados em tempo real**: Os dados são atualizados conforme a API da Câmara. Pode haver delay entre a publicação de despesas e sua disponibilidade na API.

## 🤝 Contribuindo

Este é um projeto pessoal, mas contribuições são bem-vindas! O objetivo é sempre manter a transparência e objetividade dos dados.

## 📄 Licença

Este projeto é open source. Use e modifique livremente, mas mantenha a transparência e objetividade dos dados.

---

**Lembre-se**: Este projeto não emite juízo de valor político, moral ou jurídico. A classificação é objetiva, matemática e baseada exclusivamente em dados oficiais.
