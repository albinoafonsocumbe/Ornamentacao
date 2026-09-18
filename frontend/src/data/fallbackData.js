// Dados de demonstração ricos e realistas para a plataforma Ornamentação em Inhambane
// Usados como fallback caso a API demore a carregar ou a base de dados ainda não esteja povoada.

export const servicosDefault = [
    {
        id: 1,
        nome: 'Casamentos de Sonho',
        descricao: 'Cenografia integral para casamentos: cortejo, altar floral, passarela e recepção de gala inesquecível em salão, resort ou à beira-mar.',
        preco_base: 45000,
        imagem: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        destaques: ['Altar Floral e Passadeira', 'Mesa dos Noivos com Espelho', 'Iluminação Cénica Completa', 'Centros de Mesa Exclusivos']
    },
    {
        id: 2,
        nome: 'Cerimónias Tradicionais (Lobo / Kuthinga)',
        descricao: 'Cenografia personalizada que honra as raízes culturais de Moçambique com elegância, tecidos nobres e elementos tradicionais.',
        preco_base: 35000,
        imagem: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
        destaques: ['Tecidos e Paleta Personalizada', 'Estruturas em Madeira Nobre', 'Arranjos Florais Exóticos', 'Espaço de Recepção Familiar']
    },
    {
        id: 3,
        nome: 'Galas & Eventos Corporativos',
        descricao: 'Cenografia de alto impacto para conferências, lançamentos de marcas, jantares de gala e celebrações anuais de empresas.',
        preco_base: 50000,
        imagem: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        destaques: ['Palco e Púlpito Personalizado', 'Branding e Cores Institucionais', 'Lounges VIP Executivos', 'Iluminação Arquitectural']
    },
    {
        id: 4,
        nome: 'Batizados & Festas Infantis Temáticas',
        descricao: 'Ambientes mágicos e delicados criados sob medida para os mais pequeninos, com painéis decorativos, balões orgânicos e mesa de doces.',
        preco_base: 20000,
        imagem: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
        destaques: ['Arcos Orgânicos de Balões', 'Mesa do Bolo Temática', 'Peças em Cerâmica & Vidro', 'Cantinho de Lembranças']
    },
    {
        id: 5,
        nome: 'Aniversários & Celebrações Glamour',
        descricao: 'Decoração sofisticada para festas de 15 anos, 30, 40, 50 anos ou celebrações intimistas com lounges VIP e iluminação de destaque.',
        preco_base: 28000,
        imagem: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
        destaques: ['Painel Shimmer / Neon Glow', 'Lounge VIP com Veludo', 'Mesa de Doces Iluminada', 'Detalhes Dourados Champagne']
    },
    {
        id: 6,
        nome: 'Design Floral & Mobiliário Exclusivo',
        descricao: 'Arranjos florais de luxo, centros de mesa esculturais, cadeiras Dior/Tiffany e mesas espelhadas para aluguer com montagem e desmontagem.',
        preco_base: 18000,
        imagem: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80',
        destaques: ['Flores Frescas Seleccionadas', 'Cadeiras Dior e Tiffany', 'Centros Altos em Vidro Cristal', 'Montagem e Apoio no Local']
    }
];

export const pacotesDefault = [
    {
        id: 1,
        nome: 'Pacote Essencial',
        preco_base: 25000,
        descricao: 'Perfeito para celebrações intimistas e reuniões familiares com bom gosto e charme sem excessos.',
        capacidade: 'Até 50 convidados',
        itens: [
            'Decoração completa da mesa de honra / bolo',
            '5 centros de mesa florais elegantes',
            'Painel de fundo clássico em tecido e flores',
            'Toalhas e guardanapos premium',
            'Iluminação pontual acolhedora',
            'Montagem e desmontagem pela nossa equipa'
        ]
    },
    {
        id: 2,
        nome: 'Pacote Glamour',
        preco_base: 65000,
        descricao: 'O pacote preferido dos noivos e anfitriões para casamentos e grandes celebrações inesquecíveis.',
        capacidade: 'Até 150 convidados',
        destaque: true,
        badge: 'Mais Escolhido',
        itens: [
            'Cenografia da mesa do bolo espelhada / vidro de luxo',
            '12 a 15 centros de mesa com arranjos florais altos e baixos',
            'Backdrop personalizado com neon ou monograma dos noivos',
            'Passadeira cerimonial e cortejo com arranjos no corredor',
            'Iluminação cénica LED e banho de luz nas paredes',
            'Mesa de boas-vindas / livro de honra',
            'Apoio cenográfico dedicado no dia do evento'
        ]
    },
    {
        id: 3,
        nome: 'Pacote Imperial de Luxo',
        preco_base: 150000,
        descricao: 'Cenografia monumental de alto padrão com mobiliário exclusivo, lustres e túnel floral de entrada.',
        capacidade: 'Até 300+ convidados',
        itens: [
            'Pérgola ou túnel floral monumental na entrada principal',
            'Palco dos noivos com cadeiras tronos / sofás Dior em veludo',
            'Mesas espelhadas e cadeiras Tiffany / Dior para todos os convidados',
            'Lustres de cristal e cascata de luzes suspensas',
            'Passarela espelhada para o cortejo nupcial',
            'Lounge VIP com sofás, mesas de apoio e iluminação exclusiva',
            'Efeito nuvem (fumo baixo) e faíscas frias (sparklers) na dança',
            'Consultoria e projecto de cenografia 3D personalizado'
        ]
    }
];

export const portefolioDefault = [
    {
        id: 1,
        titulo: 'Casamento Real na Baía de Inhambane',
        categoria: 'Casamentos',
        local: 'Cidade de Inhambane',
        descricao: 'Cenografia romântica com vista para a baía histórica, orquídeas brancas, rosas blush e detalhes em dourado champagne.',
        imagem: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&q=85'
    },
    {
        id: 2,
        titulo: 'Cerimónia ao Pôr do Sol na Praia do Tofo',
        categoria: 'Casamentos',
        local: 'Praia do Tofo, Inhambane',
        descricao: 'Decoração rústico-chic à beira-mar com pérgola de madeira natural, flores tropicais e iluminação boho em microlâmpadas.',
        imagem: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1000&q=85'
    },
    {
        id: 3,
        titulo: 'Gala Empresarial na Maxixe',
        categoria: 'Corporativo',
        local: 'Maxixe, Inhambane',
        descricao: 'Cenografia corporativa sofisticada em tons de azul marinho, prata e iluminação arquitectural para empresas da província.',
        imagem: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=85'
    },
    {
        id: 4,
        titulo: 'Aniversário 30 Anos Glamour na Barra',
        categoria: 'Aniversários',
        local: 'Praia da Barra, Inhambane',
        descricao: 'Festa temática com lounge VIP em veludo, painel de luzes LED com neon personalizado e mesa de doces em acrílico espelhado.',
        imagem: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1000&q=85'
    },
    {
        id: 5,
        titulo: 'Batizado Clássico em Inhambane',
        categoria: 'Batizados',
        local: 'Cidade de Inhambane',
        descricao: 'Ambiente celestial em tons de branco e verde eucalipto, com arco orgânico de balões e flores naturais frescas.',
        imagem: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1000&q=85'
    },
    {
        id: 6,
        titulo: 'Casamento Tradicional Lobolo em Morrumbene',
        categoria: 'Casamentos',
        local: 'Morrumbene, Inhambane',
        descricao: 'Harmonia perfeita entre requinte contemporâneo e riqueza cultural moçambicana com elementos capulana e arranjos exóticos.',
        imagem: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&q=85'
    }
];

export const tarifasDefault = {
    pacote: [
        { id: 1, nome: 'Pacote Essencial', valor: 25000, descricao: 'Celebração intimista até 50 pessoas com mesa principal e centros florais' },
        { id: 2, nome: 'Pacote Glamour', valor: 65000, descricao: 'Cenografia completa com mesa espelhada e iluminação LED para até 150 convidados' },
        { id: 3, nome: 'Pacote Imperial de Luxo', valor: 150000, descricao: 'Cenografia monumental com pérgola, cadeiras Dior e lustres para até 300+ pessoas' }
    ],
    extra: [
        { id: 4, nome: 'Iluminação Cénica & Robôs LED', valor: 8500, descricao: 'Banho de luz ambiente e focos direccionais' },
        { id: 5, nome: 'Pérgola Floral / Túnel de Entrada', valor: 15000, descricao: 'Estrutura floral exuberante para entrada triunfal' },
        { id: 6, nome: 'Mesa do Bolo Espelhada de Luxo', valor: 12000, descricao: 'Mesa de vidro/espelho com suportes dourados' },
        { id: 7, nome: 'Efeito Nuvem (Gelo Seco) & Sparklers', valor: 6500, descricao: 'Fumo rasteiro e faíscas frias para dança dos noivos' },
        { id: 8, nome: 'Letras Gigantes Luminosas (Love/Iniciais)', valor: 5000, descricao: 'Letras vintage com iluminação quente' },
        { id: 9, nome: 'Lounge VIP Sofás em Veludo (20 pessoas)', valor: 18000, descricao: 'Zona de estar reservada com mesas de centro e almofadas' }
    ],
    deslocacao: [
        { id: 10, nome: 'Inhambane Centro', valor: 0 },
        { id: 11, nome: 'Maxixe / Praia do Tofo / Barra', valor: 2500 },
        { id: 12, nome: 'Morrumbene / Massinga / Jangamo', valor: 4500 },
        { id: 13, nome: 'Vilankulo / Inharrime', valor: 8000 }
    ]
};
