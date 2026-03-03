# Plano de Ataque — Política Sem Filtro

## Fase 0: Limpeza — Remover o módulo Quiz
Deletar tudo relacionado ao quiz para simplificar o projeto.

### Arquivos a deletar:
- `app/quiz/page.tsx`
- `app/quiz/matching/page.tsx`
- `hooks/useQuiz.ts`
- `components/quiz/QuizCard.tsx`
- `components/quiz/QuizProgress.tsx`
- `components/quiz/PoliticalValuesResult.tsx`
- `components/ui/QuizShareButton.tsx`

### Arquivos a editar:
- `components/layout/Navigation.tsx` — remover item Quiz do `navItems`
- `app/page.tsx` — remover qualquer referência/link ao quiz (se houver)
- `app/perfil/page.tsx` — remover referências a quiz streak/resultados (se houver)
- `contexts/AuthContext.tsx` — remover campos `quizStreak` e `totalQuizzesCompleted` do tipo `AuthUser`
- `hooks/index.ts` — remover export do useQuiz
- `components/features/index.ts` (ou barrel file equivalente) — remover exports de quiz

### Tabelas Supabase (não deletar agora, apenas anotar para limpeza futura):
- `quiz_questions`, `quiz_categories`, `user_quiz_responses`, `user_political_values`, `politician_profiles`, `user_politician_matches`, `daily_quiz_completions`

---

## Fase 1: Reestruturação — Escândalos + Eleições 2026

### 1a. Renomear "Investigações" → "Escândalos"
- Renomear `app/investigacoes/` → `app/escandalos/`
- Atualizar Navigation.tsx: href `/investigacoes` → `/escandalos`, label "Investigações" → "Escândalos"
- Atualizar qualquer link interno que aponte para `/investigacoes`

### 1b. Migrar sub-módulos editoriais de Eleições 2026 → Escândalos
- Mover os 3 conteúdos editoriais (Polarização, MBL, Falsos Profetas) de `app/eleicoes-2026/page.tsx` para `app/escandalos/page.tsx`
- O componente `MBLDossier` já está em `components/features/Scandals/` — boa localização
- Escândalos ficará com 6 blocos: Lava Jato, Mensalão, Petrolão + Polarização, MBL, Falsos Profetas
- Considerar reorganizar em tabs/categorias: "Escândalos Históricos" e "Denúncias Atuais"

### 1c. Limpar Eleições 2026
- Remover o conteúdo editorial que foi migrado
- Deixar a página como placeholder estruturado para dados eleitorais reais futuros
- Texto explicativo: "Em breve: dados de candidatos, patrimônio e doações do TSE para 2026"

---

## Fase 2: Abordagem Híbrida — Parlamentares

### 2a. Gerar JSON estático dos 513 deputados
- Criar script `scripts/sync-deputados.ts` que busca da API da Câmara e salva em `lib/data/deputados.json`
- Campos: `id`, `nome`, `siglaPartido`, `siglaUf`, `urlFoto`, `email`
- Adicionar comando `npm run sync-deputados`

### 2b. Refatorar endpoints
- `GET /api/deputados` — passa a ler do JSON estático (resposta instantânea)
- `GET /api/bancada` — usa o JSON para lista base + API só para dados CEAP dinâmicos
- `GET /api/deputados/[id]` — usa JSON para dados base + API para dados dinâmicos (CEAP, votações, presenças)

### 2c. Remover dados hardcoded falsos
- Remover `advisors: 25` e `cabinet_budget: 111000` da rota `/api/deputados/[id]`
- Substituir por dados reais da API ou omitir se não disponível

---

## Fase 3: Responsividade

Auditoria revelou score ~7.5/10. Pontos a corrigir:

### 3a. Correções prioritárias
- **Votações** — grid de resultados (`grid-cols-3`) não tem breakpoint mobile → adicionar `grid-cols-1 sm:grid-cols-3`
- **Navigation** — popup do perfil com `w-64` fixo → tornar responsivo em telas < 320px
- **Bancada** — modal sem `max-w` pode ficar muito largo em telas grandes

### 3b. Revisão geral
- Testar todas as páginas em viewport 375px (iPhone SE) e 320px
- Verificar se gráficos (Recharts) não transbordam em mobile
- Garantir que tabs de navegação (Escândalos, Eleições) façam wrap correto em mobile
- Verificar font sizes em mobile (hero text, headings)

---

## Fase 4: Solidificar o Core

### 4a. Página de Metodologia
- Transformar o stub atual em página completa e estilizada
- Explicar: fontes de dados (API da Câmara, Portal Transparência), critérios de detecção de gastos suspeitos, como funciona o score

### 4b. Build de produção
- Garantir que `npm run build` passa sem erros após todas as mudanças
- Verificar que não há imports quebrados ou referências ao quiz deletado

### 4c. Análises — verificar dark mode
- A página `/analises` não usa classes `dark:` no container principal → corrigir

---

## Ordem de execução sugerida

1. **Fase 0** — Limpar quiz (reduz complexidade antes de tudo)
2. **Fase 1** — Reestruturar Escândalos/Eleições (reorganização de conteúdo)
3. **Fase 2** — Abordagem híbrida parlamentares (melhoria de performance)
4. **Fase 3** — Responsividade (polish visual)
5. **Fase 4** — Solidificar core (metodologia, build, dark mode)
