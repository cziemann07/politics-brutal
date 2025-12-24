-- =============================================
-- POLITICS BRUTAL - SCHEMA DE NOTIFICAÇÕES E MONITORAMENTO
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- =============================================
-- TABELA: user_notification_settings (configurações de notificação)
-- =============================================
CREATE TABLE IF NOT EXISTS user_notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Canais de notificação
  email_enabled BOOLEAN DEFAULT TRUE,
  email_address TEXT, -- Se diferente do email de auth
  whatsapp_enabled BOOLEAN DEFAULT FALSE,
  whatsapp_number TEXT,
  push_enabled BOOLEAN DEFAULT FALSE,
  
  -- Tipos de notificação
  notify_absences BOOLEAN DEFAULT TRUE,           -- Faltas em votações/reuniões
  notify_expenses_above_limit BOOLEAN DEFAULT TRUE, -- Gastos acima do teto
  notify_suspicious_expenses BOOLEAN DEFAULT TRUE,  -- Gastos suspeitos
  notify_votes_against_values BOOLEAN DEFAULT TRUE, -- Votos contra seus valores
  notify_scandals BOOLEAN DEFAULT TRUE,           -- Envolvimento em escândalos
  notify_weekly_digest BOOLEAN DEFAULT TRUE,      -- Resumo semanal
  
  -- Frequência
  notification_frequency TEXT DEFAULT 'realtime' CHECK (notification_frequency IN ('realtime', 'daily', 'weekly')),
  preferred_time TIME DEFAULT '09:00:00', -- Hora preferida para digest
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- =============================================
-- TABELA: user_followed_deputies (deputados seguidos pelo usuário)
-- Substitui/complementa o localStorage atual
-- =============================================
CREATE TABLE IF NOT EXISTS user_followed_deputies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deputado_id INT NOT NULL,
  deputado_nome TEXT NOT NULL,
  deputado_partido TEXT,
  deputado_uf TEXT,
  deputado_foto_url TEXT,
  
  -- Configurações específicas para este deputado
  notify_enabled BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, deputado_id)
);

-- =============================================
-- TABELA: deputy_events (cache de eventos/sessões)
-- =============================================
CREATE TABLE IF NOT EXISTS deputy_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evento_id INT NOT NULL UNIQUE,
  data_hora_inicio TIMESTAMPTZ NOT NULL,
  data_hora_fim TIMESTAMPTZ,
  situacao TEXT, -- "Encerrada", "Em Andamento", etc
  tipo TEXT, -- "Sessão Deliberativa", "Reunião", etc
  titulo TEXT,
  descricao TEXT,
  local TEXT,
  orgao_sigla TEXT,
  orgao_nome TEXT,
  uri TEXT,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELA: deputy_event_attendance (presença em eventos)
-- =============================================
CREATE TABLE IF NOT EXISTS deputy_event_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evento_id INT NOT NULL,
  deputado_id INT NOT NULL,
  
  -- Status de presença
  presente BOOLEAN DEFAULT FALSE,
  justificativa TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(evento_id, deputado_id)
);

-- =============================================
-- TABELA: deputy_absences (faltas registradas)
-- =============================================
CREATE TABLE IF NOT EXISTS deputy_absences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deputado_id INT NOT NULL,
  deputado_nome TEXT NOT NULL,
  
  -- Detalhes do evento
  evento_id INT,
  evento_tipo TEXT NOT NULL, -- 'votacao', 'sessao', 'reuniao'
  evento_titulo TEXT,
  evento_data TIMESTAMPTZ NOT NULL,
  evento_orgao TEXT,
  
  -- Status
  justificada BOOLEAN DEFAULT FALSE,
  justificativa TEXT,
  
  -- Votação associada (se for falta em votação)
  votacao_id TEXT,
  votacao_descricao TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(deputado_id, evento_id)
);

-- =============================================
-- TABELA: notifications (notificações enviadas/pendentes)
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Tipo de notificação
  type TEXT NOT NULL CHECK (type IN (
    'absence',              -- Falta em votação/reunião
    'expense_above_limit',  -- Gasto acima do teto
    'suspicious_expense',   -- Gasto suspeito
    'vote_against_values',  -- Voto contra seus valores
    'scandal',              -- Escândalo/investigação
    'weekly_digest',        -- Resumo semanal
    'system'                -- Notificação do sistema
  )),
  
  -- Conteúdo
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Dados adicionais (deputado_id, evento_id, etc)
  
  -- Deputado relacionado (se aplicável)
  deputado_id INT,
  deputado_nome TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'read')),
  channel TEXT DEFAULT 'email' CHECK (channel IN ('email', 'whatsapp', 'push', 'in_app')),
  
  -- Timestamps
  scheduled_for TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELA: notification_queue (fila de processamento)
-- =============================================
CREATE TABLE IF NOT EXISTS notification_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  
  -- Prioridade (1 = mais alta)
  priority INT DEFAULT 5,
  
  -- Tentativas
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  last_attempt_at TIMESTAMPTZ,
  next_attempt_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELA: expense_alerts (alertas de gastos)
-- =============================================
CREATE TABLE IF NOT EXISTS expense_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deputado_id INT NOT NULL,
  deputado_nome TEXT NOT NULL,
  
  -- Período
  ano INT NOT NULL,
  mes INT NOT NULL,
  
  -- Valores
  total_gasto DECIMAL(12, 2) NOT NULL,
  teto_ceap DECIMAL(12, 2) NOT NULL,
  percentual_teto DECIMAL(5, 2) NOT NULL, -- Ex: 125.50 = 125.50% do teto
  
  -- Classificação
  alert_type TEXT NOT NULL CHECK (alert_type IN (
    'above_limit',      -- Acima do teto
    'near_limit',       -- Próximo do teto (>90%)
    'suspicious',       -- Padrão suspeito
    'spike'             -- Aumento repentino vs mês anterior
  )),
  
  -- Detalhes
  details JSONB, -- Categorias de gasto, fornecedores, etc
  
  -- Status de processamento
  processed BOOLEAN DEFAULT FALSE,
  notifications_sent INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(deputado_id, ano, mes, alert_type)
);

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON notifications(scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

CREATE INDEX IF NOT EXISTS idx_notification_queue_status ON notification_queue(status);
CREATE INDEX IF NOT EXISTS idx_notification_queue_next ON notification_queue(next_attempt_at) WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_deputy_absences_deputado ON deputy_absences(deputado_id);
CREATE INDEX IF NOT EXISTS idx_deputy_absences_data ON deputy_absences(evento_data DESC);

CREATE INDEX IF NOT EXISTS idx_expense_alerts_deputado ON expense_alerts(deputado_id);
CREATE INDEX IF NOT EXISTS idx_expense_alerts_periodo ON expense_alerts(ano, mes);
CREATE INDEX IF NOT EXISTS idx_expense_alerts_unprocessed ON expense_alerts(processed) WHERE processed = FALSE;

CREATE INDEX IF NOT EXISTS idx_user_followed_deputies_user ON user_followed_deputies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_followed_deputies_deputado ON user_followed_deputies(deputado_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS
ALTER TABLE user_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_followed_deputies ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE deputy_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE deputy_event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE deputy_absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_alerts ENABLE ROW LEVEL SECURITY;

-- Políticas para notification_settings
CREATE POLICY "Users podem ver próprias configurações" ON user_notification_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users podem inserir próprias configurações" ON user_notification_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users podem atualizar próprias configurações" ON user_notification_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para followed_deputies
CREATE POLICY "Users podem ver próprios deputados" ON user_followed_deputies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users podem seguir deputados" ON user_followed_deputies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users podem deixar de seguir" ON user_followed_deputies
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para notifications
CREATE POLICY "Users podem ver próprias notificações" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users podem marcar como lida" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Dados públicos (leitura para todos)
CREATE POLICY "Qualquer um pode ver eventos" ON deputy_events
  FOR SELECT USING (true);

CREATE POLICY "Qualquer um pode ver presença" ON deputy_event_attendance
  FOR SELECT USING (true);

CREATE POLICY "Qualquer um pode ver faltas" ON deputy_absences
  FOR SELECT USING (true);

CREATE POLICY "Qualquer um pode ver alertas de gastos" ON expense_alerts
  FOR SELECT USING (true);

-- =============================================
-- PERMISSÕES
-- =============================================
GRANT SELECT ON user_notification_settings TO authenticated;
GRANT INSERT, UPDATE ON user_notification_settings TO authenticated;

GRANT SELECT, INSERT, DELETE ON user_followed_deputies TO authenticated;

GRANT SELECT, UPDATE ON notifications TO authenticated;

GRANT SELECT ON deputy_events TO anon, authenticated;
GRANT SELECT ON deputy_event_attendance TO anon, authenticated;
GRANT SELECT ON deputy_absences TO anon, authenticated;
GRANT SELECT ON expense_alerts TO anon, authenticated;

-- =============================================
-- FUNÇÕES ÚTEIS
-- =============================================

-- Função para buscar usuários que seguem um deputado
CREATE OR REPLACE FUNCTION get_users_following_deputy(p_deputado_id INT)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  notify_absences BOOLEAN,
  notify_expenses_above_limit BOOLEAN,
  email_enabled BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ufd.user_id,
    COALESCE(uns.email_address, u.email) as email,
    COALESCE(uns.notify_absences, TRUE) as notify_absences,
    COALESCE(uns.notify_expenses_above_limit, TRUE) as notify_expenses_above_limit,
    COALESCE(uns.email_enabled, TRUE) as email_enabled
  FROM user_followed_deputies ufd
  JOIN auth.users u ON u.id = ufd.user_id
  LEFT JOIN user_notification_settings uns ON uns.user_id = ufd.user_id
  WHERE ufd.deputado_id = p_deputado_id
    AND ufd.notify_enabled = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para registrar falta
CREATE OR REPLACE FUNCTION register_deputy_absence(
  p_deputado_id INT,
  p_deputado_nome TEXT,
  p_evento_id INT,
  p_evento_tipo TEXT,
  p_evento_titulo TEXT,
  p_evento_data TIMESTAMPTZ,
  p_evento_orgao TEXT,
  p_votacao_id TEXT DEFAULT NULL,
  p_votacao_descricao TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_absence_id UUID;
BEGIN
  INSERT INTO deputy_absences (
    deputado_id, deputado_nome, evento_id, evento_tipo,
    evento_titulo, evento_data, evento_orgao,
    votacao_id, votacao_descricao
  ) VALUES (
    p_deputado_id, p_deputado_nome, p_evento_id, p_evento_tipo,
    p_evento_titulo, p_evento_data, p_evento_orgao,
    p_votacao_id, p_votacao_descricao
  )
  ON CONFLICT (deputado_id, evento_id) DO NOTHING
  RETURNING id INTO v_absence_id;
  
  RETURN v_absence_id;
END;
$$ LANGUAGE plpgsql;

-- Função para criar notificação
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT NULL,
  p_deputado_id INT DEFAULT NULL,
  p_deputado_nome TEXT DEFAULT NULL,
  p_channel TEXT DEFAULT 'email'
) RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (
    user_id, type, title, message, data,
    deputado_id, deputado_nome, channel
  ) VALUES (
    p_user_id, p_type, p_title, p_message, p_data,
    p_deputado_id, p_deputado_nome, p_channel
  )
  RETURNING id INTO v_notification_id;
  
  -- Adiciona à fila de processamento
  INSERT INTO notification_queue (notification_id)
  VALUES (v_notification_id);
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

