-- =============================================
-- POLITICS BRUTAL - SCHEMA DO BANCO DE DADOS
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA: users (perfis de usuário)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Metadados
  quiz_streak INT DEFAULT 0,
  last_quiz_date DATE,
  total_quizzes_completed INT DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  -- Plano de assinatura
  subscription_plan TEXT DEFAULT 'gratuito' CHECK (subscription_plan IN ('gratuito', 'basico', 'pro')),
  subscription_expires_at TIMESTAMPTZ,
  subscription_pix_id TEXT -- ID do pagamento PIX
);

-- =============================================
-- TABELA: political_dimensions (dimensões políticas)
-- =============================================
CREATE TABLE IF NOT EXISTS political_dimensions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  left_label TEXT NOT NULL,  -- ex: "Intervenção estatal"
  right_label TEXT NOT NULL, -- ex: "Livre mercado"
  icon TEXT,
  sort_order INT DEFAULT 0
);

-- Inserir dimensões padrão
INSERT INTO political_dimensions (id, name, description, left_label, right_label, icon, sort_order) VALUES
  ('economia', 'Economia', 'Como o Estado deve atuar na economia', 'Intervenção estatal', 'Livre mercado', 'TrendingUp', 1),
  ('social', 'Costumes e Sociedade', 'Visão sobre costumes, família e comportamento', 'Progressista', 'Conservador', 'Users', 2),
  ('ambiental', 'Meio Ambiente', 'Prioridade entre preservação e desenvolvimento', 'Preservação ambiental', 'Desenvolvimento econômico', 'Leaf', 3),
  ('seguranca', 'Segurança Pública', 'Abordagem para combate à criminalidade', 'Garantismo / Direitos', 'Punitivismo / Rigor', 'Shield', 4),
  ('transparencia', 'Transparência', 'Nível de controle e fiscalização do Estado', 'Mais controle popular', 'Menos burocracia', 'Eye', 5),
  ('federalismo', 'Federalismo', 'Distribuição de poder entre União e estados', 'Centralização', 'Descentralização', 'Building', 6)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- TABELA: quiz_categories (categorias de quiz)
-- =============================================
CREATE TABLE IF NOT EXISTS quiz_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#000000'
);

-- Inserir categorias padrão
INSERT INTO quiz_categories (id, name, description, icon, color) VALUES
  ('leis', 'Projetos de Lei', 'Perguntas sobre projetos de lei em tramitação ou aprovados', 'ScrollText', '#3B82F6'),
  ('escandalos', 'Escândalos', 'Perguntas sobre escândalos e investigações políticas', 'AlertTriangle', '#EF4444'),
  ('votacoes', 'Votações', 'Perguntas sobre votações importantes no Congresso', 'Vote', '#10B981'),
  ('historia', 'História Política', 'Perguntas sobre história política do Brasil', 'BookOpen', '#8B5CF6'),
  ('atualidades', 'Atualidades', 'Perguntas sobre eventos políticos recentes', 'Newspaper', '#F59E0B'),
  ('valores', 'Valores Políticos', 'Perguntas para definir seu perfil político', 'Compass', '#EC4899')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- TABELA: quiz_questions (perguntas do quiz)
-- =============================================
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id TEXT REFERENCES quiz_categories(id),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'scale', 'agree_disagree', 'ranking')),
  options JSONB, -- Para multiple_choice: [{id, text, is_correct?, dimension_impacts: [{dimension, impact}]}]
  correct_answer TEXT, -- Para perguntas com resposta certa (quiz de conhecimento)
  explanation TEXT, -- Explicação após responder
  source_url TEXT, -- Fonte da informação
  difficulty INT DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  -- Impacto nas dimensões políticas (para perguntas de valores)
  dimension_impacts JSONB, -- [{dimension_id, left_weight, right_weight}]
  -- Controle de exibição
  is_active BOOLEAN DEFAULT TRUE,
  is_daily BOOLEAN DEFAULT FALSE,
  daily_date DATE, -- Se for quiz diário, qual data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELA: user_quiz_responses (respostas do usuário)
-- =============================================
CREATE TABLE IF NOT EXISTS user_quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
  answer JSONB NOT NULL, -- Resposta do usuário (flexível para diferentes tipos)
  is_correct BOOLEAN, -- Se tinha resposta certa, acertou?
  time_taken_ms INT, -- Tempo para responder em ms
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id) -- Cada usuário responde cada pergunta uma vez
);

-- =============================================
-- TABELA: user_political_values (valores políticos calculados)
-- =============================================
CREATE TABLE IF NOT EXISTS user_political_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  dimension_id TEXT REFERENCES political_dimensions(id),
  score DECIMAL(5,2) NOT NULL CHECK (score BETWEEN 0 AND 100), -- 0 = totalmente esquerda, 100 = totalmente direita
  confidence DECIMAL(3,2) DEFAULT 0.5 CHECK (confidence BETWEEN 0 AND 1), -- Confiança baseada em qtd de respostas
  is_manual BOOLEAN DEFAULT FALSE, -- Se foi definido manualmente pelo usuário
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, dimension_id)
);

-- =============================================
-- TABELA: politician_profiles (perfil político dos deputados)
-- =============================================
CREATE TABLE IF NOT EXISTS politician_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deputado_id INT NOT NULL,
  deputado_nome TEXT NOT NULL,
  deputado_partido TEXT,
  deputado_uf TEXT,
  deputado_foto_url TEXT,
  dimension_id TEXT REFERENCES political_dimensions(id),
  score DECIMAL(5,2) NOT NULL CHECK (score BETWEEN 0 AND 100),
  confidence DECIMAL(3,2) DEFAULT 0.5,
  -- Metadados de cálculo
  votacoes_analisadas INT DEFAULT 0,
  ultima_atualizacao TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(deputado_id, dimension_id)
);

-- =============================================
-- TABELA: user_politician_matches (matching usuário-político)
-- =============================================
CREATE TABLE IF NOT EXISTS user_politician_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  deputado_id INT NOT NULL,
  match_score DECIMAL(5,2) NOT NULL CHECK (match_score BETWEEN 0 AND 100),
  dimension_breakdown JSONB, -- Detalhamento por dimensão
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, deputado_id)
);

-- =============================================
-- TABELA: daily_quiz_completions (controle de quiz diário)
-- =============================================
CREATE TABLE IF NOT EXISTS daily_quiz_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quiz_date DATE NOT NULL,
  questions_answered INT DEFAULT 0,
  correct_answers INT DEFAULT 0,
  score DECIMAL(5,2),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quiz_date)
);

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category ON quiz_questions(category_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_daily ON quiz_questions(daily_date) WHERE is_daily = TRUE;
CREATE INDEX IF NOT EXISTS idx_quiz_questions_active ON quiz_questions(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_responses_user ON user_quiz_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_values_user ON user_political_values(user_id);
CREATE INDEX IF NOT EXISTS idx_politician_profiles_deputado ON politician_profiles(deputado_id);
CREATE INDEX IF NOT EXISTS idx_user_matches_user ON user_politician_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_user_matches_score ON user_politician_matches(match_score DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_political_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_politician_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quiz_completions ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users podem ver próprio perfil" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users podem atualizar próprio perfil" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users podem inserir próprio perfil" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para quiz_responses
CREATE POLICY "Users podem ver próprias respostas" ON user_quiz_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users podem inserir próprias respostas" ON user_quiz_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para political_values
CREATE POLICY "Users podem ver próprios valores" ON user_political_values
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users podem inserir/atualizar próprios valores" ON user_political_values
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para matches
CREATE POLICY "Users podem ver próprios matches" ON user_politician_matches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users podem inserir/atualizar próprios matches" ON user_politician_matches
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para daily_completions
CREATE POLICY "Users podem ver próprias completions" ON daily_quiz_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users podem inserir próprias completions" ON daily_quiz_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tabelas públicas (leitura para todos)
CREATE POLICY "Qualquer um pode ver dimensões" ON political_dimensions
  FOR SELECT USING (true);

CREATE POLICY "Qualquer um pode ver categorias" ON quiz_categories
  FOR SELECT USING (true);

CREATE POLICY "Qualquer um pode ver perguntas ativas" ON quiz_questions
  FOR SELECT USING (is_active = true);

CREATE POLICY "Qualquer um pode ver perfis de políticos" ON politician_profiles
  FOR SELECT USING (true);

-- =============================================
-- FUNÇÕES ÚTEIS
-- =============================================

-- Função para calcular match entre usuário e político
CREATE OR REPLACE FUNCTION calculate_politician_match(
  p_user_id UUID,
  p_deputado_id INT
) RETURNS DECIMAL AS $$
DECLARE
  v_match_score DECIMAL;
BEGIN
  SELECT
    100 - (AVG(ABS(upv.score - pp.score)))
  INTO v_match_score
  FROM user_political_values upv
  JOIN politician_profiles pp ON pp.dimension_id = upv.dimension_id
  WHERE upv.user_id = p_user_id
    AND pp.deputado_id = p_deputado_id;

  RETURN COALESCE(v_match_score, 50);
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar valores políticos do usuário baseado em respostas
CREATE OR REPLACE FUNCTION update_user_political_values(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Esta função seria chamada após cada resposta de quiz
  -- Implementação depende da estrutura específica das perguntas
  -- Por enquanto é um placeholder
  NULL;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- DADOS INICIAIS - PERGUNTAS DE VALORES
-- =============================================

-- Perguntas para determinar perfil político (agree_disagree)
INSERT INTO quiz_questions (category_id, question_text, question_type, dimension_impacts, explanation) VALUES

-- ECONOMIA
('valores', 'O Estado deve ter mais controle sobre empresas estratégicas como Petrobras e Banco do Brasil.', 'agree_disagree',
 '[{"dimension_id": "economia", "left_weight": 1, "right_weight": 0}]',
 'Esta questão mede sua posição sobre intervenção estatal na economia.'),

('valores', 'Privatizações são geralmente benéficas para a economia e para os consumidores.', 'agree_disagree',
 '[{"dimension_id": "economia", "left_weight": 0, "right_weight": 1}]',
 'Esta questão mede sua posição sobre livre mercado vs. estatização.'),

('valores', 'Programas de transferência de renda como o Bolsa Família são essenciais para reduzir a desigualdade.', 'agree_disagree',
 '[{"dimension_id": "economia", "left_weight": 1, "right_weight": 0}]',
 'Esta questão mede sua posição sobre políticas redistributivas.'),

-- SOCIAL
('valores', 'A família tradicional (pai, mãe e filhos) deve ser protegida e incentivada pelo Estado.', 'agree_disagree',
 '[{"dimension_id": "social", "left_weight": 0, "right_weight": 1}]',
 'Esta questão mede sua posição sobre valores familiares tradicionais.'),

('valores', 'Casais homoafetivos devem ter os mesmos direitos que casais heterossexuais, incluindo adoção.', 'agree_disagree',
 '[{"dimension_id": "social", "left_weight": 1, "right_weight": 0}]',
 'Esta questão mede sua posição sobre direitos LGBTQ+.'),

('valores', 'A descriminalização do aborto até certo período da gestação deve ser debatida no Brasil.', 'agree_disagree',
 '[{"dimension_id": "social", "left_weight": 1, "right_weight": 0}]',
 'Esta questão mede sua posição sobre direitos reprodutivos.'),

-- AMBIENTAL
('valores', 'A preservação ambiental deve ser prioridade mesmo que isso limite o crescimento econômico.', 'agree_disagree',
 '[{"dimension_id": "ambiental", "left_weight": 1, "right_weight": 0}]',
 'Esta questão mede sua posição sobre meio ambiente vs. desenvolvimento.'),

('valores', 'O Brasil deveria flexibilizar leis ambientais para aumentar a produção agrícola.', 'agree_disagree',
 '[{"dimension_id": "ambiental", "left_weight": 0, "right_weight": 1}]',
 'Esta questão mede sua posição sobre agronegócio e meio ambiente.'),

-- SEGURANÇA
('valores', 'A redução da maioridade penal ajudaria a diminuir a criminalidade no Brasil.', 'agree_disagree',
 '[{"dimension_id": "seguranca", "left_weight": 0, "right_weight": 1}]',
 'Esta questão mede sua posição sobre punitivismo.'),

('valores', 'A posse e o porte de armas de fogo devem ser facilitados para cidadãos de bem.', 'agree_disagree',
 '[{"dimension_id": "seguranca", "left_weight": 0, "right_weight": 1}]',
 'Esta questão mede sua posição sobre armamento civil.'),

('valores', 'O sistema prisional deveria focar mais em ressocialização do que em punição.', 'agree_disagree',
 '[{"dimension_id": "seguranca", "left_weight": 1, "right_weight": 0}]',
 'Esta questão mede sua posição sobre sistema penal.'),

-- TRANSPARÊNCIA
('valores', 'Os salários e gastos de todos os servidores públicos devem ser totalmente públicos.', 'agree_disagree',
 '[{"dimension_id": "transparencia", "left_weight": 1, "right_weight": 0}]',
 'Esta questão mede sua posição sobre transparência governamental.'),

('valores', 'O sigilo de 100 anos imposto a documentos governamentais é aceitável em alguns casos.', 'agree_disagree',
 '[{"dimension_id": "transparencia", "left_weight": 0, "right_weight": 1}]',
 'Esta questão mede sua posição sobre acesso à informação.'),

-- FEDERALISMO
('valores', 'Estados e municípios deveriam ter mais autonomia para definir suas próprias políticas.', 'agree_disagree',
 '[{"dimension_id": "federalismo", "left_weight": 0, "right_weight": 1}]',
 'Esta questão mede sua posição sobre descentralização.'),

('valores', 'Políticas públicas como educação e saúde devem ser padronizadas nacionalmente pelo governo federal.', 'agree_disagree',
 '[{"dimension_id": "federalismo", "left_weight": 1, "right_weight": 0}]',
 'Esta questão mede sua posição sobre centralização.')

ON CONFLICT DO NOTHING;

-- =============================================
-- DADOS INICIAIS - QUIZ DE CONHECIMENTO
-- =============================================

INSERT INTO quiz_questions (category_id, question_text, question_type, options, correct_answer, explanation, difficulty) VALUES

('votacoes', 'Em 2016, qual foi o resultado da votação de impeachment de Dilma Rousseff na Câmara?', 'multiple_choice',
 '[{"id": "a", "text": "367 a favor, 137 contra"}, {"id": "b", "text": "342 a favor, 150 contra"}, {"id": "c", "text": "400 a favor, 100 contra"}, {"id": "d", "text": "300 a favor, 200 contra"}]',
 'a', 'O impeachment foi aprovado com 367 votos a favor e 137 contra, superando os 342 necessários (2/3 dos deputados).', 3),

('escandalos', 'Qual foi o escândalo que revelou o esquema de corrupção na Petrobras?', 'multiple_choice',
 '[{"id": "a", "text": "Mensalão"}, {"id": "b", "text": "Lava Jato"}, {"id": "c", "text": "Banestado"}, {"id": "d", "text": "Satiagraha"}]',
 'b', 'A Operação Lava Jato, iniciada em 2014, revelou um esquema bilionário de corrupção envolvendo a Petrobras.', 1),

('leis', 'A Lei da Ficha Limpa (LC 135/2010) impede a candidatura de políticos condenados por quanto tempo?', 'multiple_choice',
 '[{"id": "a", "text": "4 anos"}, {"id": "b", "text": "8 anos"}, {"id": "c", "text": "10 anos"}, {"id": "d", "text": "Permanente"}]',
 'b', 'A Lei da Ficha Limpa torna inelegível por 8 anos o candidato condenado por órgão colegiado.', 2),

('historia', 'Quantos presidentes o Brasil já teve desde a redemocratização em 1985?', 'multiple_choice',
 '[{"id": "a", "text": "6 presidentes"}, {"id": "b", "text": "7 presidentes"}, {"id": "c", "text": "8 presidentes"}, {"id": "d", "text": "9 presidentes"}]',
 'c', 'Desde 1985: Sarney, Collor, Itamar, FHC, Lula, Dilma, Temer e Bolsonaro (8 presidentes até 2022).', 2),

('atualidades', 'Qual é o número mínimo de deputados necessários para aprovar uma PEC na Câmara?', 'multiple_choice',
 '[{"id": "a", "text": "257 deputados"}, {"id": "b", "text": "308 deputados"}, {"id": "c", "text": "342 deputados"}, {"id": "d", "text": "400 deputados"}]',
 'b', 'PECs precisam de 3/5 dos votos (308 de 513) em dois turnos para serem aprovadas.', 3)

ON CONFLICT DO NOTHING;

-- =============================================
-- GRANT PERMISSIONS
-- =============================================

-- Permitir que usuários autenticados acessem as tabelas necessárias
GRANT SELECT ON political_dimensions TO authenticated;
GRANT SELECT ON quiz_categories TO authenticated;
GRANT SELECT ON quiz_questions TO authenticated;
GRANT SELECT ON politician_profiles TO authenticated;
GRANT ALL ON users TO authenticated;
GRANT ALL ON user_quiz_responses TO authenticated;
GRANT ALL ON user_political_values TO authenticated;
GRANT ALL ON user_politician_matches TO authenticated;
GRANT ALL ON daily_quiz_completions TO authenticated;

-- Permitir acesso anônimo para leitura de dados públicos
GRANT SELECT ON political_dimensions TO anon;
GRANT SELECT ON quiz_categories TO anon;
GRANT SELECT ON quiz_questions TO anon;
GRANT SELECT ON politician_profiles TO anon;

-- =============================================
-- TABELA: news_votes (votos em notícias)
-- =============================================
CREATE TABLE IF NOT EXISTS news_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  noticia_id INT NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, noticia_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_news_votes_noticia ON news_votes(noticia_id);
CREATE INDEX IF NOT EXISTS idx_news_votes_user ON news_votes(user_id);

-- Habilitar RLS
ALTER TABLE news_votes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Qualquer um pode ver todos os votos (para contagem)
CREATE POLICY "Qualquer um pode ver votos" ON news_votes
  FOR SELECT USING (true);

-- Usuários autenticados podem inserir seus próprios votos
CREATE POLICY "Users podem inserir próprios votos" ON news_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar seus próprios votos
CREATE POLICY "Users podem atualizar próprios votos" ON news_votes
  FOR UPDATE USING (auth.uid() = user_id);

-- Usuários podem deletar seus próprios votos
CREATE POLICY "Users podem deletar próprios votos" ON news_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Permissões
GRANT SELECT ON news_votes TO anon;
GRANT ALL ON news_votes TO authenticated;

-- =============================================
-- TABELA: payments (histórico de pagamentos)
-- =============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tx_id TEXT UNIQUE NOT NULL,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('basico', 'pro')),
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'expired', 'refunded')),
  payment_method TEXT NOT NULL DEFAULT 'pix',
  pix_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '15 minutes',
  metadata JSONB
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_tx_id ON payments(tx_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Habilitar RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Usuários podem ver seus próprios pagamentos
CREATE POLICY "Users podem ver próprios pagamentos" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Service role pode gerenciar todos os pagamentos
CREATE POLICY "Service role gerencia pagamentos" ON payments
  FOR ALL USING (true);

-- Permissões
GRANT SELECT ON payments TO authenticated;
