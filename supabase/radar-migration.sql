-- =============================================
-- RADAR SEM FILTRO - MIGRAÇÃO DE TABELAS
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- =============================================
-- TABELA: deputies (deputados no banco local)
-- Substitui busca constante da API da Câmara
-- =============================================
CREATE TABLE IF NOT EXISTS deputies (
  id SERIAL PRIMARY KEY,
  camara_id INTEGER UNIQUE NOT NULL,  -- ID da API da Câmara
  nome VARCHAR(255) NOT NULL,
  nome_civil VARCHAR(255),
  sigla_partido VARCHAR(20),
  sigla_uf CHAR(2),
  url_foto TEXT,
  email VARCHAR(255),
  cpf VARCHAR(14),
  data_nascimento DATE,
  sexo CHAR(1),
  municipio_nascimento VARCHAR(100),
  uf_nascimento CHAR(2),
  escolaridade VARCHAR(100),
  situacao VARCHAR(50) DEFAULT 'Exercício',
  condicao_eleitoral VARCHAR(100),
  -- Dados do gabinete
  gabinete_numero VARCHAR(10),
  gabinete_anexo VARCHAR(10),
  gabinete_telefone VARCHAR(20),
  -- Dados calculados/cacheados
  total_gastos_ceap DECIMAL(12,2) DEFAULT 0,
  teto_ceap DECIMAL(12,2),
  percentual_presenca DECIMAL(5,2),
  total_votacoes INTEGER DEFAULT 0,
  total_ausencias INTEGER DEFAULT 0,
  -- Redes sociais
  twitter VARCHAR(100),
  instagram VARCHAR(100),
  facebook VARCHAR(100),
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para buscas
CREATE INDEX IF NOT EXISTS idx_deputies_camara_id ON deputies(camara_id);
CREATE INDEX IF NOT EXISTS idx_deputies_partido ON deputies(sigla_partido);
CREATE INDEX IF NOT EXISTS idx_deputies_uf ON deputies(sigla_uf);
CREATE INDEX IF NOT EXISTS idx_deputies_nome ON deputies(nome);

-- =============================================
-- TABELA: subscription_plans (planos de assinatura)
-- =============================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id VARCHAR(20) PRIMARY KEY,  -- 'gratuito', 'basico', 'pro'
  name VARCHAR(50) NOT NULL,
  price DECIMAL(5,2) NOT NULL DEFAULT 0,
  max_deputies INTEGER NOT NULL DEFAULT 1,
  features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir planos padrão
INSERT INTO subscription_plans (id, name, price, max_deputies, features) VALUES
  ('gratuito', 'Gratuito', 0, 1, '{"email_notifications": false, "custom_notifications": false, "whatsapp": false}'),
  ('basico', 'Básico', 0.99, 3, '{"email_notifications": true, "custom_notifications": false, "whatsapp": false}'),
  ('pro', 'Pro', 3.99, 15, '{"email_notifications": true, "custom_notifications": true, "whatsapp": true}')
ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  max_deputies = EXCLUDED.max_deputies,
  features = EXCLUDED.features;

-- =============================================
-- TABELA: news (notícias do sistema)
-- =============================================
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT,  -- Markdown ou HTML
  cover_image TEXT,
  -- Categorização
  category VARCHAR(50) NOT NULL DEFAULT 'politica',  -- politica, economia, fiscalize, litera, dossie
  editorial VARCHAR(50) NOT NULL DEFAULT 'radarnews',  -- radarnews, litera
  tags TEXT[] DEFAULT '{}',
  -- Fonte
  source_name VARCHAR(100),
  source_url TEXT,
  -- Autor
  author_id UUID REFERENCES users(id),
  author_name VARCHAR(100),
  -- Status
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT FALSE,
  is_breaking BOOLEAN DEFAULT FALSE,
  -- Datas
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Metadados
  read_time INTEGER DEFAULT 5,  -- minutos
  views INTEGER DEFAULT 0
);

-- Índices para buscas
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_editorial ON news(editorial);
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_is_featured ON news(is_featured) WHERE is_featured = TRUE;

-- =============================================
-- TABELA: news_sources (fontes de agregação)
-- Para o sistema de agregação de notícias com IA
-- =============================================
CREATE TABLE IF NOT EXISTS news_sources (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  feed_url TEXT,  -- RSS feed URL
  type VARCHAR(20) DEFAULT 'manual' CHECK (type IN ('rss', 'api', 'manual')),
  category VARCHAR(50),
  editorial VARCHAR(50) DEFAULT 'radarnews',
  reliability_score DECIMAL(3,2) DEFAULT 0.8,  -- 0-1
  is_active BOOLEAN DEFAULT TRUE,
  last_fetched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir algumas fontes padrão
INSERT INTO news_sources (name, url, feed_url, type, category, reliability_score) VALUES
  ('Câmara dos Deputados', 'https://www.camara.leg.br', 'https://www.camara.leg.br/rss/rss-e-cidadania', 'rss', 'politica', 0.95),
  ('Senado Federal', 'https://www12.senado.leg.br', 'https://www12.senado.leg.br/jornal/rss', 'rss', 'politica', 0.95),
  ('Agência Brasil', 'https://agenciabrasil.ebc.com.br', 'https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml', 'rss', 'politica', 0.9),
  ('Portal Transparência', 'https://portaldatransparencia.gov.br', NULL, 'manual', 'fiscalize', 0.95)
ON CONFLICT DO NOTHING;

-- =============================================
-- TABELA: news_queue (fila de notícias agregadas)
-- Para processamento com IA
-- =============================================
CREATE TABLE IF NOT EXISTS news_queue (
  id SERIAL PRIMARY KEY,
  source_id INTEGER REFERENCES news_sources(id),
  external_id VARCHAR(255),  -- ID original da fonte
  external_url TEXT NOT NULL,
  -- Conteúdo original
  original_title TEXT NOT NULL,
  original_summary TEXT,
  original_content TEXT,
  original_image TEXT,
  original_published_at TIMESTAMPTZ,
  -- Análise da IA
  ai_relevance_score DECIMAL(3,2),  -- 0-1
  ai_category_suggestion VARCHAR(50),
  ai_editorial_suggestion VARCHAR(50),
  ai_is_featured_suggestion BOOLEAN DEFAULT FALSE,
  ai_summary TEXT,
  ai_analysis TEXT,
  ai_processed_at TIMESTAMPTZ,
  -- Status de processamento
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'published')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  -- Se publicado, link para a notícia
  published_news_id UUID REFERENCES news(id),
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_id, external_id)
);

-- Índice para buscar pendentes
CREATE INDEX IF NOT EXISTS idx_news_queue_status ON news_queue(status);
CREATE INDEX IF NOT EXISTS idx_news_queue_created_at ON news_queue(created_at DESC);

-- =============================================
-- TABELA: user_followed_deputies
-- Já existe no notifications-schema.sql com colunas em português
-- Apenas garantir que os índices existam
-- =============================================
-- Índices (usando nomes de coluna existentes em português)
CREATE INDEX IF NOT EXISTS idx_user_followed_deputies_user ON user_followed_deputies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_followed_deputies_deputado ON user_followed_deputies(deputado_id);

-- =============================================
-- FUNÇÕES AUXILIARES
-- =============================================

-- Função para verificar limite de deputados por plano
CREATE OR REPLACE FUNCTION check_deputy_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_plan TEXT;
  max_deps INTEGER;
  current_count INTEGER;
BEGIN
  -- Buscar plano do usuário
  SELECT subscription_plan INTO user_plan
  FROM users WHERE id = NEW.user_id;

  -- Se não encontrou, assume gratuito
  IF user_plan IS NULL THEN
    user_plan := 'gratuito';
  END IF;

  -- Buscar limite do plano
  SELECT max_deputies INTO max_deps
  FROM subscription_plans WHERE id = user_plan;

  -- Se plano não existe na tabela, usar limite padrão
  IF max_deps IS NULL THEN
    max_deps := 1;
  END IF;

  -- Contar deputados atuais
  SELECT COUNT(*) INTO current_count
  FROM user_followed_deputies WHERE user_id = NEW.user_id;

  -- Verificar limite
  IF current_count >= max_deps THEN
    RAISE EXCEPTION 'Limite de deputados atingido para o plano %. Máximo: %, Atual: %', user_plan, max_deps, current_count;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar limite antes de inserir
-- Só cria se a tabela existe
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_followed_deputies') THEN
    DROP TRIGGER IF EXISTS check_deputy_limit_trigger ON user_followed_deputies;
    CREATE TRIGGER check_deputy_limit_trigger
      BEFORE INSERT ON user_followed_deputies
      FOR EACH ROW
      EXECUTE FUNCTION check_deputy_limit();
  END IF;
END $$;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- RLS para deputies (público, apenas leitura)
ALTER TABLE deputies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deputies são públicos" ON deputies
  FOR SELECT USING (true);

-- RLS para news (publicados são públicos)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notícias publicadas são públicas" ON news
  FOR SELECT USING (status = 'published' OR auth.uid() IN (SELECT id FROM users WHERE is_admin = true));
CREATE POLICY "Admins podem gerenciar notícias" ON news
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = true));

-- RLS para subscription_plans (público, apenas leitura)
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Planos são públicos" ON subscription_plans
  FOR SELECT USING (is_active = true);

-- RLS para user_followed_deputies - já configurado em notifications-schema.sql
-- Não precisa criar novamente

-- =============================================
-- ATUALIZAR TABELA USERS (se necessário)
-- =============================================
DO $$
BEGIN
  -- Adicionar coluna max_followed_deputies se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'max_followed_deputies'
  ) THEN
    ALTER TABLE users ADD COLUMN max_followed_deputies INTEGER DEFAULT 1;
  END IF;
END $$;

-- =============================================
-- COMENTÁRIOS NAS TABELAS
-- =============================================
COMMENT ON TABLE deputies IS 'Deputados federais importados da API da Câmara';
COMMENT ON TABLE subscription_plans IS 'Planos de assinatura disponíveis';
COMMENT ON TABLE news IS 'Notícias publicadas no sistema';
COMMENT ON TABLE news_sources IS 'Fontes de notícias para agregação';
COMMENT ON TABLE news_queue IS 'Fila de notícias aguardando aprovação';
