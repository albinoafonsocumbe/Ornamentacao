-- ═══════════════════════════════════════════════
-- SETUP.SQL — Script completo da base de dados
-- Ornamentação Premium
-- Execute com: psql -U postgres -d plataforma-ornamentacao -f setup.sql
-- ═══════════════════════════════════════════════

-- ── ADMINS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    criado_em   TIMESTAMP DEFAULT NOW()
);

-- Admin padrão: email=admin@ornamentacao.mz  password=Admin@2024
-- NOTA: usar o script criar-admin.js para garantir hash válido
-- node criar-admin.js
-- (este INSERT usa hash pré-gerado; se falhar, corre o script acima)
INSERT INTO admins (nome, email, password)
VALUES (
    'Administrador',
    'admin@ornamentacao.mz',
    '$2b$10$qQzpksjDHKZcuRAKMcNy1uSDBiXsxamVz79NjBT0VsHCluv.SBMya'
)
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- ── SERVICOS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS servicos (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(150) NOT NULL,
    descricao   TEXT,
    preco_base  NUMERIC(12,2) DEFAULT 0,
    imagem      VARCHAR(255),
    ativo       BOOLEAN DEFAULT TRUE,
    criado_em   TIMESTAMP DEFAULT NOW()
);

-- ── EVENTOS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS eventos (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(150) NOT NULL,
    descricao   TEXT,
    imagem      VARCHAR(255),
    ativo       BOOLEAN DEFAULT TRUE,
    criado_em   TIMESTAMP DEFAULT NOW()
);

-- ── PACOTES ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS pacotes (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(150) NOT NULL,
    descricao   TEXT,
    preco_base  NUMERIC(12,2) DEFAULT 0,
    ativo       BOOLEAN DEFAULT TRUE,
    criado_em   TIMESTAMP DEFAULT NOW()
);

-- ── PORTEFOLIO ──────────────────────────────────
CREATE TABLE IF NOT EXISTS portefolio (
    id          SERIAL PRIMARY KEY,
    titulo      VARCHAR(200) NOT NULL,
    descricao   TEXT,
    imagem      VARCHAR(255) NOT NULL,
    categoria   VARCHAR(100),
    ativo       BOOLEAN DEFAULT TRUE,
    criado_em   TIMESTAMP DEFAULT NOW()
);

-- ── TARIFAS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS tarifas (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(150) NOT NULL,
    descricao   TEXT,
    tipo        VARCHAR(50) NOT NULL CHECK (tipo IN ('pacote','extra','deslocacao')),
    valor       NUMERIC(12,2) DEFAULT 0,
    ativo       BOOLEAN DEFAULT TRUE,
    criado_em   TIMESTAMP DEFAULT NOW()
);

-- ── PEDIDOS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS pedidos (
    id            SERIAL PRIMARY KEY,
    nome_cliente  VARCHAR(150) NOT NULL,
    email         VARCHAR(150) NOT NULL,
    telefone      VARCHAR(30),
    tipo_evento   VARCHAR(100),
    data_evento   DATE,
    local_evento  VARCHAR(200),
    descricao     TEXT,
    estimativa    NUMERIC(12,2),
    estado        VARCHAR(30) DEFAULT 'pendente'
                    CHECK (estado IN ('pendente','em_analise','aprovado','recusado','concluido')),
    notas_admin   TEXT,
    criado_em     TIMESTAMP DEFAULT NOW()
);

-- Adicionar coluna notas_admin caso a tabela já exista sem ela
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS notas_admin TEXT;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS estado VARCHAR(30) DEFAULT 'pendente';

-- ── DADOS INICIAIS (DEMONSTRAÇÃO / SEED) ───────────
INSERT INTO servicos (nome, descricao, preco_base, imagem, ativo) VALUES
('Casamentos de Sonho', 'Decoração integral para casamentos: cerimónia religiosa/civil, cortejo, altar floral, passarela e recepção de gala inesquecível.', 45000.00, 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', true),
('Cerimónias Tradicionais (Lobo / Kuthinga)', 'Cenografia personalizada que honra as raízes culturais de Moçambique com elegância, tecidos refinados e elementos tradicionais.', 35000.00, 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', true),
('Galas & Eventos Corporativos', 'Cenografia de alto impacto para conferências, lançamentos de marcas, jantares de gala e festas de fim de ano empresariais.', 50000.00, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', true),
('Batizados & Festas Infantis Temáticas', 'Ambientes mágicos e delicados criados sob medida para os mais pequenos, com painéis decorativos, balões orgânicos e mesa de doces.', 20000.00, 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80', true),
('Aniversários & Celebrações Glamour', 'Decoração sofisticada para festas de 15 anos, 30, 40, 50 anos ou celebrações íntimas com lounges VIP e iluminação de destaque.', 28000.00, 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80', true),
('Design Floral & Mobiliário Exclusivo', 'Arranjos florais de luxo, centros de mesa esculturais, cadeiras Dior/Tiffany e mesas espelhadas para aluguer com montagem.', 18000.00, 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80', true)
ON CONFLICT DO NOTHING;

INSERT INTO eventos (nome, descricao, imagem, ativo) VALUES
('Casamentos', 'O dia mais especial da sua vida com cenografia romântica e memorável.', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', true),
('Eventos Corporativos', 'Imagem corporativa impecável em conferências, galas e lançamentos.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', true),
('Aniversários & Datas Especiais', 'Celebrações que marcam uma época com glamour e exclusividade.', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80', true),
('Batizados & Comunhões', 'Tons suaves e pureza em arranjos para momentos espirituais de família.', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80', true),
('Formaturas & Festas Académicas', 'Homenagem a grandes conquistas com elegância e celebração vibrante.', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80', true),
('Noivados & Pedidos de Casamento', 'Cenários intimistas e apaixonantes para o início de uma nova história.', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80', true)
ON CONFLICT DO NOTHING;

INSERT INTO pacotes (nome, descricao, preco_base, ativo) VALUES
('Pacote Essencial', 'Ideal para celebrações intimistas até 50 convidados. Inclui mesa de honra decorada, 5 centros de mesa florais, iluminação suave e assessoria completa no dia.', 25000.00, true),
('Pacote Glamour (Mais Popular)', 'A escolha favorita para casamentos e aniversários de até 150 convidados. Inclui cenografia de mesa do bolo espelhada, 12 centros florais altos, backdrop personalizado, passadeira cerimonial e iluminação cénica LED.', 65000.00, true),
('Pacote Imperial de Luxo', 'Cenografia monumental para eventos até 300+ convidados. Pérgola ou túnel floral de entrada, mesas espelhadas, cadeiras Tiffany/Dior, lustres de cristal, passarela espelhada, lounge VIP e equipa de supervisão dedicada.', 150000.00, true)
ON CONFLICT DO NOTHING;

INSERT INTO portefolio (titulo, descricao, imagem, categoria, ativo) VALUES
('Casamento Real no Polana Serena', 'Cenografia romântica com túnel de orquídeas brancas, rosas blush e detalhes em dourado champagne no salão nobre.', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&q=85', 'Casamentos', true),
('Cerimónia ao Pôr do Sol na Catembe', 'Decoração rústico-chic à beira-mar com pérgola de madeira natural, flores tropicais e iluminação boho em microlâmpadas.', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1000&q=85', 'Casamentos', true),
('Gala Empresarial 20 Anos — Maputo', 'Cenografia corporativa sofisticada em tons de azul marinho, prata e iluminação arquitectural para 400 convidados.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=85', 'Corporativo', true),
('Aniversário 30 Anos Glamour Dourado', 'Festa temática com lounge VIP em veludo, painel de luzes LED com neon personalizado e mesa de doces em acrílico espelhado.', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1000&q=85', 'Aniversários', true),
('Batizado Clássico no Jardim da Matola', 'Ambiente celestial em tons de branco e verde eucalipto, com arco orgânico de balões e flores naturais frescas.', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1000&q=85', 'Batizados', true),
('Casamento Tradicional Lobolo', 'Harmonia perfeita entre requinte contemporâneo e riqueza cultural moçambicana com elementos capulana e arranjos exóticos.', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&q=85', 'Casamentos', true)
ON CONFLICT DO NOTHING;

INSERT INTO tarifas (nome, descricao, tipo, valor, ativo) VALUES
('Pacote Essencial', 'Celebração intimista com mesa principal e centros florais', 'pacote', 25000.00, true),
('Pacote Glamour', 'Cenografia completa com mesa espelhada e iluminação LED', 'pacote', 65000.00, true),
('Pacote Imperial de Luxo', 'Cenografia integral com pérgola, cadeiras Dior e lustres', 'pacote', 150000.00, true),
('Iluminação Cénica & Robôs LED', 'Banho de luz ambiente e focos direccionais para pista e mesas', 'extra', 8500.00, true),
('Pérgola Floral ou Túnel de Entrada', 'Estrutura floral exuberante para recepção e fotos inesquecíveis', 'extra', 15000.00, true),
('Mesa do Bolo Espelhada com Bolo Cenográfico', 'Mesa de luxo em vidro/espelho com suportes dourados', 'extra', 12000.00, true),
('Efeito Nuvem (Gelo Seco) & Sparklers', 'Fumo rasteiro e faíscas frias seguras para a dança dos noivos', 'extra', 6500.00, true),
('Letras Gigantes Luminosas (Love / Iniciais)', 'Letras vintage iluminadas em madeira branca para fotos', 'extra', 5000.00, true),
('Lounge VIP com Sofás em Veludo (20 pessoas)', 'Zona de estar reservada com sofás, mesas de apoio e almofadas', 'extra', 18000.00, true),
('Taxa de Deslocação — Maputo Centro', 'Deslocação gratuita para a cidade de Maputo', 'deslocacao', 0.00, true),
('Taxa de Deslocação — Matola / Boane', 'Deslocação e logística na zona metropolitana', 'deslocacao', 2500.00, true),
('Taxa de Deslocação — Marracuene / Macaneta', 'Deslocação e montagem no distrito de Marracuene', 'deslocacao', 4500.00, true)
ON CONFLICT DO NOTHING;

