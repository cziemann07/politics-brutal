# Política Sem Filtro

Sistema de transparência e accountability de parlamentares brasileiros.
Permite que cidadãos acompanhem votações, gastos e comportamento de deputados federais,
com alertas automáticos por email quando irregularidades são detectadas.

## Stack

- **Framework:** Next.js 14 (App Router, Server Components por padrão)
- **Backend/DB:** Supabase (PostgreSQL + Auth + Realtime + Edge Functions)
- **Linguagem:** TypeScript (strict mode sempre)
- **Estilo:** Tailwind CSS
- **Runtime:** Node.js

## Comandos

```bash
npm run dev             # servidor local
npm run build           # build de produção
npm run lint            # eslint
npm run typecheck       # tsc --noEmit
npm run sync-deputados  # atualiza lib/data/deputados.json da API da Câmara
```

## Estrutura do projeto

```
app/                        # Pages (App Router)
  page.tsx                  # Home / dashboard
  politico/[id]/page.tsx    # Perfil do parlamentar
  bancada/page.tsx          # Listagem por bancada
  analises/page.tsx         # Análises e rankings
  escandalos/page.tsx       # Escândalos históricos + denúncias atuais
  eleicoes-2026/            # Seção eleições (placeholder para dados TSE)
  noticias/page.tsx         # Notícias com sistema de votos
  admin/                    # Painel administrativo
  api/                      # Route handlers
    deputados/[id]/route.ts # API de dados do deputado

components/
  layout/Navigation.tsx     # Navegação principal

contexts/
  AuthContext.tsx            # Contexto de autenticação

hooks/
  index.ts                  # Hooks exportados

lib/
  camara.ts                 # Client principal da API da Câmara
  data/deputados.json       # JSON estático dos 513 deputados (gerado por sync)
  data/camara-client.ts     # Abstração/cache dos dados
  seo.ts                    # Utilitários de SEO

scripts/
  sync-deputados.ts         # Sincroniza lista de deputados da API → JSON

types/
  database.ts               # Tipos gerados pelo Supabase (NÃO editar manualmente)

.cache/
  estatisticas-home.json    # Cache local de estatísticas
```

## Fontes de dados externas

### API da Câmara dos Deputados (principal)
- Base: `https://dadosabertos.camara.leg.br/api/v2`
- Documentação: `https://dadosabertos.camara.leg.br/swagger/api.html`
- Endpoints críticos:
  - `GET /deputados` — listagem com filtros
  - `GET /deputados/{id}` — perfil completo
  - `GET /deputados/{id}/despesas` — gastos da cota parlamentar (CEAP)
  - `GET /deputados/{id}/votacoes` — histórico de votações
  - `GET /votacoes/{id}` — detalhes de uma votação
  - `GET /proposicoes` — projetos de lei em tramitação
- Rate limit: respeitar paginação (`itens` e `pagina` nos params)
- Sempre verificar `dados` e `links` na resposta paginada

### Portal da Transparência (gastos federais)
- Base: `https://api.portaldatransparencia.gov.br/api-de-dados`
- Requer header: `chave-api: {PORTAL_TRANSPARENCIA_API_KEY}`
- Útil para contratos, convênios e benefícios vinculados a parlamentares

### Dados complementares
- IBGE para dados de estado/município dos parlamentares
- TSE para dados eleitorais históricos

## Funcionalidades em desenvolvimento

### 1. Perfil detalhado do parlamentar
- Foto, partido, estado, mandatos
- Score de presença em votações
- Histórico de votações com posição (sim/não/abstenção)
- Gastos da cota parlamentar (CEAP) com categorias e fornecedores
- Projetos de lei de autoria

### 2. Detecção de gastos suspeitos (CEAP)
Lógica de análise no servidor — nunca expor critérios no cliente:
- Gasto acima de 2x a média da categoria para o estado
- Fornecedor com CNPJ suspeito (criado recentemente, sem funcionários)
- Mesmo fornecedor recebendo múltiplos pagamentos no mesmo dia
- Gasto em categoria incomum para o tipo de mandato
- Flags salvas em `gastos_suspeitos` no Supabase com `motivo` e `score`

### 3. Tracking de votações
- Sincronização periódica via Supabase Edge Functions (cron)
- Detectar ausências injustificadas acima do threshold configurável
- Detectar votação contrária ao partido (destacar como "voto dissidente")
- Armazenar histórico em `votacoes_parlamentar` com snapshot do placar

### 4. Alertas por email
- Usuário segue parlamentares específicos (tabela `seguindo`)
- Triggers no Supabase disparam quando novo evento é inserido
- Email enviado via Resend (`resend.com`) com template React Email
- Tipos de alerta: `gasto_suspeito`, `ausencia`, `voto_importante`, `nova_proposicao`
- Usuário configura quais tipos de alerta quer receber (`preferencias_alertas`)

## Supabase — tabelas principais

```sql
-- Não modificar types/database.ts manualmente
-- Regenerar com: npx supabase gen types typescript --project-id ... > types/database.ts

parlamentares          -- dados base dos deputados
votacoes               -- votações registradas
votacoes_parlamentar   -- como cada dep. votou em cada votação
despesas               -- gastos CEAP
gastos_suspeitos       -- flags de irregularidade com motivo e score
seguindo               -- relação usuário → parlamentar
alertas                -- fila de alertas a enviar
preferencias_alertas   -- config de notificações por usuário
```

## Regras de desenvolvimento

### Arquitetura
- Preferir Server Components; Client Components só quando necessário (`useState`, `useEffect`, eventos)
- Mutations via Server Actions, não via fetch no cliente
- Cache de dados da API da Câmara sempre que possível (revalidação a cada 1h no mínimo)
- Lógica de detecção de irregularidades SEMPRE no servidor, nunca exposta no cliente

### TypeScript
- Strict mode — sem `any` sem justificativa no comentário
- Tipos do Supabase vêm de `types/database.ts` (gerado, não editar)
- Criar interfaces próprias em `types/` para DTOs e modelos de domínio

### Dados sensíveis
- Chaves de API somente em variáveis de ambiente (`.env.local`)
- Nunca logar dados pessoais de parlamentares além do que é público
- Row Level Security (RLS) ativo em todas as tabelas de usuário no Supabase

### Qualidade
- Rodar `npm run typecheck` antes de qualquer commit
- Componentes de UI reutilizáveis em `components/ui/`
- Nomear Server Actions com prefixo `action` (ex: `actionSeguirParlamentar`)

## Comandos customizados úteis

Criar os arquivos em `.claude/commands/`:

- `/project:sync-deputados` — sincroniza lista de deputados da API da Câmara
- `/project:analisa-gastos` — roda análise de suspeição nos gastos do último mês
- `/project:dispara-alertas` — processa fila de alertas pendentes
- `/project:regenera-types` — regenera types do Supabase

## Armadilhas conhecidas

- A API da Câmara retorna datas no formato `YYYY-MM-DD`, não ISO 8601 completo
- `despesas` da CEAP têm delay de ~30 dias para aparecer na API
- Paginação da API da Câmara começa em `pagina=1`, não `0`
- O campo `urlFoto` dos deputados às vezes retorna 404 — sempre ter fallback
- `types/database.ts` é gerado automaticamente — qualquer edição manual será sobrescrita
- O `.cache/` local é só para dev; em produção usar Supabase ou Redis