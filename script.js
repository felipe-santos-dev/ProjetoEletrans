/* ================================================================
   ELETRANS — Sistema de Gestão Interna (Protótipo Front-End v2)
   ----------------------------------------------------------------
   ARQUITETURA: SPA simulada em Vanilla JS. Cada "view" é uma função
   que devolve HTML e é injetada em #view-container.

   INTEGRAÇÃO FUTURA (BACKEND PYTHON):
   Todos os pontos marcados com  >>> BACKEND <<<  indicam onde a
   chamada fetch() real deverá substituir a leitura/escrita do
   objeto DB abaixo. Exemplo padrão:

     const resp = await fetch('/api/pedidos', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.token}` },
         body: JSON.stringify(payload)
     });
     const data = await resp.json();
   ================================================================ */

/* ================================================================
   1. BANCO DE DADOS SIMULADO (MOCK)
   >>> BACKEND <<< : este objeto será substituído por endpoints
   REST (ex: GET /api/funcionarios, GET /api/ferramentas ...)
   ================================================================ */
const DB = {

    obras: [
        { id: 1, nome: 'Sylvamo',     cliente: 'Sylvamo do Brasil',      cidade: 'Luiz Antônio-SP', orcamento: 230000, custoTotal: 182500, progresso: 78, inicio: '2026-02-10', prazo: '2026-09-30', responsavelId: 8, status: 'em-andamento' },
        { id: 2, nome: 'Raízen',      cliente: 'Raízen Energia',         cidade: 'Guariba-SP',      orcamento: 260000, custoTotal: 245800, progresso: 91, inicio: '2025-11-03', prazo: '2026-08-15', responsavelId: 7, status: 'em-andamento' },
        { id: 3, nome: 'Piracanjuba', cliente: 'Laticínios Piracanjuba', cidade: 'Bela Vista-GO',   orcamento: 180000, custoTotal: 97300,  progresso: 42, inicio: '2026-04-01', prazo: '2026-12-20', responsavelId: 6, status: 'em-andamento' }
    ],

    funcionarios: [
        { id: 1, nome: 'Carlos Silva',    funcao: 'Eletricista Montador',   valorHora: 28.50, obraId: 2, admissao: '2022-03-14', ativo: true },
        { id: 2, nome: 'João Pereira',    funcao: 'Eletricista Força',      valorHora: 30.00, obraId: 2, admissao: '2021-08-02', ativo: true },
        { id: 3, nome: 'Marcos Andrade',  funcao: 'Ajudante',               valorHora: 16.00, obraId: 1, admissao: '2023-05-22', ativo: true },
        { id: 4, nome: 'Rafael Costa',    funcao: 'Eletricista Controle',   valorHora: 32.00, obraId: 1, admissao: '2020-11-10', ativo: true },
        { id: 5, nome: 'André Oliveira',  funcao: 'Ajudante',               valorHora: 15.50, obraId: 3, admissao: '2024-01-15', ativo: true },
        { id: 6, nome: 'Paulo Mendes',    funcao: 'Encarregado',            valorHora: 38.00, obraId: 3, admissao: '2019-06-01', ativo: true },
        { id: 7, nome: 'Fernanda Rocha',  funcao: 'Técnica de Segurança',   valorHora: 35.00, obraId: 2, admissao: '2021-02-08', ativo: true },
        { id: 8, nome: 'Lucas Bento',     funcao: 'Supervisor',             valorHora: 45.00, obraId: 1, admissao: '2018-04-19', ativo: true }
    ],

    /* status: 'estoque' | 'em-uso' */
    ferramentas: [
        { id: 'FER-001', nome: 'Furadeira de Impacto Bosch GSB 550',  categoria: 'Elétrica',   status: 'em-uso',  funcionarioId: 2, obraId: 2, estoque: 0, estoqueMin: 1 },
        { id: 'FER-002', nome: 'Parafusadeira Makita DF331D',         categoria: 'Elétrica',   status: 'em-uso',  funcionarioId: 1, obraId: 2, estoque: 0, estoqueMin: 1 },
        { id: 'FER-003', nome: 'Alicate Amperímetro Fluke 323',       categoria: 'Medição',    status: 'em-uso',  funcionarioId: 4, obraId: 1, estoque: 0, estoqueMin: 1 },
        { id: 'FER-004', nome: 'Multímetro Digital Minipa ET-2082',   categoria: 'Medição',    status: 'estoque', funcionarioId: null, obraId: null, estoque: 3, estoqueMin: 2 },
        { id: 'FER-005', nome: 'Esmerilhadeira DeWalt DWE4120',       categoria: 'Elétrica',   status: 'estoque', funcionarioId: null, obraId: null, estoque: 2, estoqueMin: 1 },
        { id: 'FER-006', nome: 'Jogo de Chaves Isoladas 1000V',       categoria: 'Manual',     status: 'em-uso',  funcionarioId: 1, obraId: 2, estoque: 4, estoqueMin: 3 },
        { id: 'FER-007', nome: 'Escada Fibra 7 Degraus',              categoria: 'Acesso',     status: 'em-uso',  funcionarioId: 3, obraId: 1, estoque: 1, estoqueMin: 2 },
        { id: 'FER-008', nome: 'Termovisor Flir C5',                  categoria: 'Medição',    status: 'estoque', funcionarioId: null, obraId: null, estoque: 1, estoqueMin: 1 },
        { id: 'FER-009', nome: 'Guincho de Cabo (Tirfor) 1,6t',       categoria: 'Içamento',   status: 'em-uso',  funcionarioId: 6, obraId: 3, estoque: 0, estoqueMin: 1 },
        { id: 'FER-010', nome: 'Serra Copo Bimetal Kit 19-64mm',      categoria: 'Consumível', status: 'estoque', funcionarioId: null, obraId: null, estoque: 1, estoqueMin: 4 },
        { id: 'FER-011', nome: 'Trena a Laser Bosch GLM 50',          categoria: 'Medição',    status: 'estoque', funcionarioId: null, obraId: null, estoque: 2, estoqueMin: 1 },
        { id: 'FER-012', nome: 'Cinto Paraquedista + Talabarte Y',    categoria: 'EPI',        status: 'em-uso',  funcionarioId: 5, obraId: 3, estoque: 6, estoqueMin: 5 }
    ],

    /* status: 'pendente' | 'aprovado' | 'negado' */
    pedidosMaterial: [
        { id: 101, funcionarioId: 2, ferramentaId: 'FER-005', item: 'Esmerilhadeira DeWalt DWE4120', qtd: 1, obraId: 2, justificativa: 'Corte de leito na área 300', data: '2026-07-08', status: 'pendente' },
        { id: 102, funcionarioId: 4, ferramentaId: 'FER-010', item: 'Serra Copo Bimetal Kit 19-64mm', qtd: 2, obraId: 1, justificativa: 'Furação de painéis CCM-02', data: '2026-07-09', status: 'pendente' },
        { id: 103, funcionarioId: 3, ferramentaId: null, item: 'Abraçadeira tipo D 3/4" (cx 100un)', qtd: 3, obraId: 1, justificativa: 'Fixação de eletrodutos mezanino', data: '2026-07-07', status: 'aprovado' },
        { id: 104, funcionarioId: 1, ferramentaId: 'FER-011', item: 'Trena a Laser Bosch GLM 50', qtd: 1, obraId: 2, justificativa: 'Levantamento de rota de leito', data: '2026-07-05', status: 'negado' }
    ],

    /* Horas do mês corrente (Julho/2026) do usuário logado */
    horasMes: [
        { data: '2026-07-01', entrada: '07:00', saida: '17:00', normais: 8, extras50: 1, obraId: 2 },
        { data: '2026-07-02', entrada: '07:00', saida: '17:00', normais: 8, extras50: 1, obraId: 2 },
        { data: '2026-07-03', entrada: '07:00', saida: '16:00', normais: 8, extras50: 0, obraId: 2 },
        { data: '2026-07-06', entrada: '07:00', saida: '18:00', normais: 8, extras50: 2, obraId: 2 },
        { data: '2026-07-07', entrada: '07:00', saida: '17:00', normais: 8, extras50: 1, obraId: 2 },
        { data: '2026-07-08', entrada: '07:00', saida: '16:00', normais: 8, extras50: 0, obraId: 2 },
        { data: '2026-07-09', entrada: '07:00', saida: '19:00', normais: 8, extras50: 3, obraId: 2 }
    ],

    /* Modelos de documentos prontos (baixados em PDF e editados
       pela equipe em Word/Excel) */
    modelosDocumentos: [
        { id: 'MOD-APR',  icon: '⚠️', nome: 'APR — Análise Preliminar de Risco',   desc: 'Preenchida antes de cada atividade de risco. Campos de perigos, controles e equipe.' },
        { id: 'MOD-RDO',  icon: '📝', nome: 'RDO — Relatório Diário de Obra',      desc: 'Efetivo do dia, atividades executadas, clima e ocorrências.' },
        { id: 'MOD-PT',   icon: '🔥', nome: 'PT — Permissão de Trabalho',          desc: 'Liberação para trabalho a quente, altura ou espaço confinado.' },
        { id: 'MOD-NR10', icon: '⚡', nome: 'Checklist NR-10 — Serviços Elétricos', desc: 'Verificação de desenergização, EPIs e sinalização.' },
        { id: 'MOD-NR35', icon: '🪜', nome: 'Checklist NR-35 — Trabalho em Altura', desc: 'Inspeção de cintos, ancoragens e linha de vida.' },
        { id: 'MOD-DDS',  icon: '🗣️', nome: 'DDS — Diálogo Diário de Segurança',   desc: 'Registro do tema abordado e lista de presença da equipe.' },
        { id: 'MOD-MED',  icon: '📐', nome: 'Boletim de Medição',                  desc: 'Medição mensal de serviços executados para faturamento.' },
        { id: 'MOD-CAU',  icon: '🔧', nome: 'Termo de Cautela de Ferramentas',     desc: 'Registro de entrega e devolução de ferramentas ao colaborador.' }
    ],

    /* Documentação da empresa (Admin) — contratos, ARTs, certificados */
    docsEmpresa: [
        { id: 'DOC-001', nome: 'ART Montagem Elétrica — Sylvamo',            tipo: 'ART',         obraId: 1,    validade: '2026-12-31' },
        { id: 'DOC-002', nome: 'Contrato de Prestação — Raízen',             tipo: 'Contrato',    obraId: 2,    validade: '2026-08-15' },
        { id: 'DOC-003', nome: 'Certificados NR-10 — Equipe (12 colab.)',    tipo: 'Certificado', obraId: null, validade: '2026-07-28' },
        { id: 'DOC-004', nome: 'Certificados NR-35 — Equipe (9 colab.)',     tipo: 'Certificado', obraId: null, validade: '2027-03-10' },
        { id: 'DOC-005', nome: 'Seguro de Vida Coletivo',                    tipo: 'Seguro',      obraId: null, validade: '2026-06-30' },
        { id: 'DOC-006', nome: 'PGR — Gerenciamento de Riscos',              tipo: 'Programa',    obraId: null, validade: '2027-01-15' },
        { id: 'DOC-007', nome: 'PCMSO — Controle Médico e Saúde',            tipo: 'Programa',    obraId: null, validade: '2026-09-05' },
        { id: 'DOC-008', nome: 'Contrato de Prestação — Piracanjuba',        tipo: 'Contrato',    obraId: 3,    validade: '2026-12-20' },
        { id: 'DOC-009', nome: 'ART Painéis de Controle — Piracanjuba',      tipo: 'ART',         obraId: 3,    validade: '2026-11-30' }
    ],

    /* Galeria de plantas elétricas (thumbnails desenhados em SVG) */
    plantas: [
        { id: 'PL-01', titulo: 'Diagrama Unifilar QGBT',        obraId: 1, revisao: 'Rev. C', tipo: 'unifilar' },
        { id: 'PL-02', titulo: 'Rota de Leitos — Mezanino',     obraId: 1, revisao: 'Rev. A', tipo: 'rota' },
        { id: 'PL-03', titulo: 'Painel CCM-02 — Layout',        obraId: 1, revisao: 'Rev. B', tipo: 'painel' },
        { id: 'PL-04', titulo: 'Unifilar Subestação 13,8kV',    obraId: 2, revisao: 'Rev. D', tipo: 'unifilar' },
        { id: 'PL-05', titulo: 'Interligação Moenda — Força',   obraId: 2, revisao: 'Rev. B', tipo: 'rota' },
        { id: 'PL-06', titulo: 'Painel de Controle Caldeira',   obraId: 2, revisao: 'Rev. A', tipo: 'painel' },
        { id: 'PL-07', titulo: 'Infra Linha UHT — Eletrodutos', obraId: 3, revisao: 'Rev. A', tipo: 'rota' },
        { id: 'PL-08', titulo: 'Unifilar CCM Utilidades',       obraId: 3, revisao: 'Rev. B', tipo: 'unifilar' }
    ],

    /* Série histórica para os gráficos do Admin */
    horasUltimos6Meses: [
        { mes: 'Fev/26', horas: 3120 },
        { mes: 'Mar/26', horas: 3480 },
        { mes: 'Abr/26', horas: 3350 },
        { mes: 'Mai/26', horas: 3820 },
        { mes: 'Jun/26', horas: 4010 },
        { mes: 'Jul/26', horas: 1460 } // mês em andamento
    ]
};

/* ================================================================
   2. PERFIS DE ACESSO E SESSÃO
   >>> BACKEND <<< : o login real fará POST /api/auth/login e
   guardará o token JWT retornado em session.token
   ================================================================ */
const PERFIS = {
    operacional: {
        nome: 'Carlos Silva', funcionarioId: 1, cargo: 'Eletricista Montador',
        rotulo: 'Operacional', homeView: 'op-home',
        menu: [
            { id: 'op-home',         icon: '🏠', label: 'Início' },
            { id: 'op-pedido',       icon: '🛒', label: 'Pedido de Material' },
            { id: 'op-equipamentos', icon: '🔧', label: 'Meus Equipamentos' },
            { id: 'op-horas',        icon: '⏱️', label: 'Horas e Holerite' }
        ]
    },
    almoxarifado: {
        nome: 'Roberta Lima', funcionarioId: null, cargo: 'Almoxarife',
        rotulo: 'Almoxarifado', homeView: 'alm-dashboard',
        menu: [
            { id: 'alm-dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'alm-estoque',   icon: '🗃️', label: 'Inventário' },
            { id: 'alm-pedidos',   icon: '📥', label: 'Gestão de Pedidos' },
            { id: 'alm-rastreio',  icon: '📍', label: 'Rastreabilidade' }
        ]
    },
    supervisao: {
        nome: 'Lucas Bento', funcionarioId: 8, cargo: 'Supervisor de Obras',
        rotulo: 'Supervisão / Segurança', homeView: 'sup-projetos',
        menu: [
            { id: 'sup-projetos',  icon: '🗂️', label: 'Central de Projetos' },
            { id: 'sup-modelos',   icon: '📄', label: 'Modelos e Documentos' },
            { id: 'op-pedido',     icon: '🛒', label: 'Pedido de Material' },
            { id: 'op-horas',      icon: '⏱️', label: 'Minhas Horas' }
        ]
    },
    admin: {
        nome: 'Sérgio Eletrans', funcionarioId: null, cargo: 'Sócio-Diretor',
        rotulo: 'Administração', homeView: 'adm-dashboard',
        menu: [
            { id: 'adm-dashboard',    icon: '📈', label: 'Visão Geral' },
            { id: 'adm-obras',        icon: '🏗️', label: 'Obras' },
            { id: 'adm-funcionarios', icon: '👥', label: 'Gestão de Pessoas' },
            { id: 'adm-documentos',   icon: '📁', label: 'Documentação' },
            { id: 'adm-relatorios',   icon: '📄', label: 'Relatório de Horas' }
        ]
    }
};

const session = { perfil: null, user: null, token: null };
let currentView = null;
let charts = {}; // instâncias Chart.js ativas (destruídas ao trocar de tela)

/* ================================================================
   3. HELPERS
   ================================================================ */
const $ = (sel) => document.querySelector(sel);
const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const brlK = (v) => 'R$ ' + (v / 1000).toFixed(0) + 'k';
const dataBR = (iso) => iso.split('-').reverse().join('/');
const obraNome = (id) => (DB.obras.find(o => o.id === id) || {}).nome || '—';
const funcNome = (id) => (DB.funcionarios.find(f => f.id === id) || {}).nome || '—';

function toast(msg, tipo = 'info') {
    const el = document.createElement('div');
    el.className = `toast ${tipo}`;
    el.textContent = msg;
    $('#toast-root').appendChild(el);
    setTimeout(() => el.remove(), 3800);
}

function badgeStatus(status) {
    const map = {
        pendente:       ['badge-yellow', 'Aguardando Aprovação'],
        aprovado:       ['badge-green',  'Aprovado'],
        negado:         ['badge-red',    'Negado'],
        'em-uso':       ['badge-blue',   'Em Uso'],
        estoque:        ['badge-green',  'No Estoque'],
        'em-andamento': ['badge-blue',   'Em Andamento']
    };
    const [cls, label] = map[status] || ['badge-gray', status];
    return `<span class="badge ${cls}">${label}</span>`;
}

const statCard = (cls, icon, label, value, hint = '') => `
    <div class="stat-card ${cls}">
        <div class="stat-icon">${icon}</div>
        <div class="stat-body">
            <div class="stat-label">${label}</div>
            <div class="stat-value ${String(value).length > 8 ? 'sm' : ''}">${value}</div>
            ${hint ? `<div class="stat-hint">${hint}</div>` : ''}
        </div>
    </div>`;

/* --- Tabelas responsivas ------------------------------------------
   No celular (≤640px) as tabelas viram cartões empilhados: cada <td>
   ganha um data-label com o texto do cabeçalho correspondente, que o
   CSS exibe como rótulo. Chamada após toda renderização de tabela. */
function prepararTabelasResponsivas() {
    document.querySelectorAll('#view-container table').forEach(tabela => {
        tabela.classList.add('resp-table');
        const cabecalhos = [...tabela.querySelectorAll('thead th')].map(th => th.textContent.trim());
        tabela.querySelectorAll('tbody tr').forEach(tr => {
            [...tr.children].forEach((td, i) => {
                if (cabecalhos[i] && td.textContent.trim() !== '' && !td.hasAttribute('data-label')) {
                    td.setAttribute('data-label', cabecalhos[i]);
                }
            });
        });
    });
}

/* --- Modal genérico --------------------------------------------- */
function openModal(html) {
    $('#modal-box').innerHTML = html;
    $('#modal-root').classList.remove('hidden');
}
function closeModal() {
    $('#modal-root').classList.add('hidden');
    $('#modal-box').innerHTML = '';
}
$('#modal-root').querySelector('.modal-backdrop').addEventListener('click', closeModal);

/* --- Download simulado de arquivos texto (CSV, TXT) --------------- */
function downloadArquivo(nomeArquivo, conteudo, mime = 'text/plain') {
    // ﻿ = BOM para o Excel reconhecer acentuação em CSV
    const blob = new Blob(['﻿' + conteudo], { type: mime + ';charset=utf-8' });
    baixarBlob(blob, nomeArquivo);
}
function baixarBlob(blob, nomeArquivo) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nomeArquivo;
    a.click();
    URL.revokeObjectURL(a.href);
}

/* --- Gerador de PDF simples (protótipo) ---------------------------
   Gera um PDF 1.4 válido com título e linhas de texto, para simular
   o download dos modelos/plantas.
   >>> BACKEND <<< : em produção os PDFs reais ficarão no servidor e
   serão servidos por GET /api/arquivos/{id}/download */
function gerarPDF(nomeArquivo, titulo, linhas) {
    // Fontes básicas do PDF só cobrem ASCII: remove acentos com segurança
    const esc = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^\x20-\x7E]/g, ' ')
        .replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

    let stream = '0.78 0.16 0.16 rg\n50 776 495 3 re f\n'; // barra vermelha da logo
    stream += `0.11 0.25 0.56 rg\nBT /F2 20 Tf 50 792 Td (ELETRANS) Tj ET\n`;
    stream += `0.4 0.45 0.55 rg\nBT /F1 9 Tf 50 762 Td (Automacao e Eletrica Industrial - Araraquara-SP) Tj ET\n`;
    stream += `0 0 0 rg\nBT /F2 14 Tf 50 726 Td (${esc(titulo)}) Tj ET\n`;
    let y = 694;
    linhas.forEach(l => {
        stream += `BT /F1 11 Tf 50 ${y} Td (${esc(l)}) Tj ET\n`;
        y -= 22;
    });

    const objs = [
        '<< /Type /Catalog /Pages 2 0 R >>',
        '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>',
        `<< /Length ${stream.length} >>\nstream\n${stream}endstream`,
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'
    ];
    let pdf = '%PDF-1.4\n';
    const offsets = [];
    objs.forEach((o, i) => {
        offsets.push(pdf.length);
        pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
    });
    const xrefPos = pdf.length;
    pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
    offsets.forEach(off => { pdf += off.toString().padStart(10, '0') + ' 00000 n \n'; });
    pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

    baixarBlob(new Blob([pdf], { type: 'application/pdf' }), nomeArquivo);
}

/* --- Thumbnail SVG de planta elétrica (placeholder) -------------- */
function plantaSVG(tipo) {
    const base = `<rect width="240" height="150" fill="#122d63"/>
        <g stroke="#4d76c4" stroke-width="0.5" opacity="0.35">
        ${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 20}" y1="0" x2="${i * 20}" y2="150"/>`).join('')}
        ${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${i * 20}" x2="240" y2="${i * 20}"/>`).join('')}
        </g>`;
    const desenhos = {
        unifilar: `<g stroke="#fff" stroke-width="2" fill="none">
            <line x1="120" y1="15" x2="120" y2="45"/><circle cx="120" cy="55" r="10"/>
            <line x1="120" y1="65" x2="120" y2="85"/><line x1="60" y1="85" x2="180" y2="85"/>
            <line x1="60" y1="85" x2="60" y2="110"/><line x1="120" y1="85" x2="120" y2="110"/>
            <line x1="180" y1="85" x2="180" y2="110"/>
            <rect x="48" y="110" width="24" height="18"/><rect x="108" y="110" width="24" height="18"/>
            <rect x="168" y="110" width="24" height="18"/></g>`,
        rota: `<g stroke="#fff" stroke-width="3" fill="none">
            <path d="M20 120 L80 120 L80 60 L160 60 L160 100 L220 100"/>
            <circle cx="20" cy="120" r="5" fill="#e05252" stroke="none"/>
            <circle cx="220" cy="100" r="5" fill="#e05252" stroke="none"/></g>
            <g stroke="#8faede" stroke-width="1.5" fill="none">
            <path d="M20 128 L80 128 L80 68"/><path d="M168 60 L168 92"/></g>`,
        painel: `<g stroke="#fff" stroke-width="2" fill="none">
            <rect x="70" y="20" width="100" height="110" rx="4"/>
            <line x1="120" y1="20" x2="120" y2="130"/>
            <rect x="80" y="32" width="30" height="14"/><rect x="80" y="54" width="30" height="14"/>
            <rect x="130" y="32" width="30" height="14"/><rect x="130" y="54" width="30" height="30"/>
            <circle cx="95" cy="105" r="7"/><circle cx="145" cy="105" r="7"/></g>`
    };
    return `<svg class="plant-thumb" viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg">${base}${desenhos[tipo] || desenhos.unifilar}</svg>`;
}

/* ================================================================
   4. LOGIN / LOGOUT
   ================================================================ */
document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => quickLogin(btn.dataset.perfil));
});

$('#login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    /* >>> BACKEND <<<
       await fetch('/api/auth/login', { method:'POST',
           body: JSON.stringify({ usuario, senha }) })
       No protótipo, o formulário apenas orienta o uso do login rápido. */
    toast('No protótipo, utilize os botões de acesso rápido abaixo. 👇');
});

function quickLogin(perfil) {
    session.perfil = perfil;
    session.user = PERFIS[perfil];
    session.token = 'mock-jwt-' + perfil; // >>> BACKEND <<< : token JWT real

    $('#user-name').textContent = session.user.nome;
    $('#user-role').textContent = session.user.rotulo;
    $('#user-avatar').textContent = session.user.nome.split(' ').map(p => p[0]).slice(0, 2).join('');
    buildSidebar();

    $('#login-screen').classList.add('hidden');
    $('#app').classList.remove('hidden');
    navigate(session.user.homeView);
    toast(`Bem-vindo(a), ${session.user.nome}!`, 'success');
}

$('#btn-logout').addEventListener('click', () => {
    /* >>> BACKEND <<< : POST /api/auth/logout (invalidar token) */
    session.perfil = session.user = session.token = null;
    $('#app').classList.add('hidden');
    $('#login-screen').classList.remove('hidden');
});

/* ================================================================
   5. NAVEGAÇÃO SPA (SIDEBAR)
   ================================================================ */
function buildSidebar() {
    const nav = $('#sidebar-nav');
    nav.innerHTML = session.user.menu.map(item => `
        <button class="nav-item" data-view="${item.id}">
            <span class="nav-icon">${item.icon}</span>${item.label}
        </button>`).join('');
    nav.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            navigate(btn.dataset.view);
            closeSidebarMobile();
        });
    });
}

function navigate(viewId) {
    currentView = viewId;

    // Destrói gráficos da tela anterior (evita vazamento de canvas do Chart.js)
    Object.values(charts).forEach(c => c.destroy());
    charts = {};

    document.querySelectorAll('.nav-item').forEach(b =>
        b.classList.toggle('active', b.dataset.view === viewId));

    const menuItem = session.user.menu.find(m => m.id === viewId);
    $('#topbar-title').textContent = menuItem ? menuItem.label : 'Dashboard';

    const views = {
        'op-home': viewOpHome, 'op-pedido': viewOpPedido,
        'op-equipamentos': viewOpEquipamentos, 'op-horas': viewOpHoras,
        'alm-dashboard': viewAlmDashboard, 'alm-estoque': viewAlmEstoque,
        'alm-pedidos': viewAlmPedidos, 'alm-rastreio': viewAlmRastreio,
        'sup-projetos': viewSupProjetos, 'sup-modelos': viewSupModelos,
        'adm-dashboard': viewAdmDashboard, 'adm-obras': viewAdmObras,
        'adm-funcionarios': viewAdmFuncionarios, 'adm-documentos': viewAdmDocumentos,
        'adm-relatorios': viewAdmRelatorios
    };
    $('#view-container').innerHTML = views[viewId] ? views[viewId]() : '<p>Tela não encontrada.</p>';

    const afterRender = {
        'op-home': hookOpHome, 'op-pedido': hookOpPedido,
        'op-equipamentos': hookOpEquipamentos, 'op-horas': hookOpHoras,
        'alm-estoque': hookAlmEstoque, 'alm-pedidos': hookAlmPedidos,
        'alm-rastreio': hookAlmRastreio,
        'sup-projetos': hookSupProjetos, 'sup-modelos': hookSupModelos,
        'adm-dashboard': hookAdmDashboard, 'adm-funcionarios': hookAdmFuncionarios,
        'adm-documentos': hookAdmDocumentos, 'adm-relatorios': hookAdmRelatorios
    };
    if (afterRender[viewId]) afterRender[viewId]();
    prepararTabelasResponsivas();
    window.scrollTo(0, 0);
}

/* --- Sidebar mobile ---------------------------------------------- */
function closeSidebarMobile() {
    $('#sidebar').classList.remove('open');
    $('#sidebar-overlay').classList.remove('show');
}
$('#btn-menu').addEventListener('click', () => {
    $('#sidebar').classList.add('open');
    $('#sidebar-overlay').classList.add('show');
});
$('#sidebar-overlay').addEventListener('click', closeSidebarMobile);

$('#topbar-date').textContent = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
});

/* Fonte padrão dos gráficos */
if (window.Chart) {
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#68738c';
}

/* ================================================================
   6. PERFIL OPERACIONAL
   ================================================================ */
function viewOpHome() {
    const meusPedidos = DB.pedidosMaterial.filter(p => p.funcionarioId === session.user.funcionarioId);
    const minhasFerr = DB.ferramentas.filter(f => f.funcionarioId === session.user.funcionarioId);
    const func = DB.funcionarios.find(f => f.id === session.user.funcionarioId);
    const obra = DB.obras.find(o => o.id === func.obraId);
    return `
    <div class="cards-grid">
        ${statCard('', '🏗️', 'Obra Atual', obra.nome, obra.cidade)}
        ${statCard('green', '🔧', 'Equipamentos Comigo', minhasFerr.length)}
        ${statCard('yellow', '🛒', 'Pedidos Pendentes', meusPedidos.filter(p => p.status === 'pendente').length)}
    </div>
    <div class="op-actions">
        <button class="op-action-btn" data-goto="op-pedido"><span class="op-icon">🛒</span>
            Pedido de Material<small>Solicitar ferramentas e consumíveis</small></button>
        <button class="op-action-btn" data-goto="op-equipamentos"><span class="op-icon">📷</span>
            Meus Equipamentos<small>Escanear QR Code e ver cautelas</small></button>
        <button class="op-action-btn" data-goto="op-horas"><span class="op-icon">⏱️</span>
            Horas e Holerite<small>Conferir horas do mês e baixar holerite</small></button>
    </div>`;
}
function hookOpHome() {
    document.querySelectorAll('[data-goto]').forEach(b =>
        b.addEventListener('click', () => navigate(b.dataset.goto)));
}

/* --- 6.1 Pedido de Material (compartilhado com Supervisão) -------- */
function viewOpPedido() {
    const meusPedidos = DB.pedidosMaterial
        .filter(p => p.funcionarioId === session.user.funcionarioId)
        .sort((a, b) => b.id - a.id);
    return `
    <div class="panel">
        <div class="panel-header"><div><h3>Novo Pedido de Material</h3>
            <div class="panel-sub">O pedido entra na fila de aprovação do almoxarifado</div></div></div>
        <form id="form-pedido" class="form-grid">
            <div class="form-field full">
                <label>Item / Material *</label>
                <input type="text" id="pedido-item" placeholder="Ex: Furadeira, abraçadeiras, terminal tubular..." required>
            </div>
            <div class="form-field">
                <label>Quantidade *</label>
                <input type="number" id="pedido-qtd" min="1" value="1" required>
            </div>
            <div class="form-field">
                <label>Obra *</label>
                <select id="pedido-obra">
                    ${DB.obras.map(o => `<option value="${o.id}">${o.nome} — ${o.cidade}</option>`).join('')}
                </select>
            </div>
            <div class="form-field full">
                <label>Justificativa</label>
                <textarea id="pedido-just" rows="2" placeholder="Onde e para quê o material será usado"></textarea>
            </div>
            <div class="form-field full">
                <button type="submit" class="btn btn-primary btn-lg btn-block">📨 Enviar Pedido</button>
            </div>
        </form>
    </div>
    <div class="panel">
        <div class="panel-header"><h3>Meus Pedidos</h3></div>
        <div class="table-wrap"><table>
            <thead><tr><th>Data</th><th>Item</th><th>Qtd</th><th>Obra</th><th>Status</th></tr></thead>
            <tbody>
                ${meusPedidos.map(p => `<tr>
                    <td>${dataBR(p.data)}</td><td class="td-strong">${p.item}</td><td>${p.qtd}</td>
                    <td>${obraNome(p.obraId)}</td><td>${badgeStatus(p.status)}</td></tr>`).join('')
                  || '<tr><td colspan="5">Nenhum pedido realizado.</td></tr>'}
            </tbody>
        </table></div>
    </div>`;
}
function hookOpPedido() {
    $('#form-pedido').addEventListener('submit', (e) => {
        e.preventDefault();
        const item = $('#pedido-item').value.trim();
        if (!item) return toast('Informe o item desejado.', 'error');

        const novo = {
            id: Math.max(...DB.pedidosMaterial.map(p => p.id)) + 1,
            funcionarioId: session.user.funcionarioId,
            ferramentaId: null,
            item,
            qtd: parseInt($('#pedido-qtd').value, 10) || 1,
            obraId: parseInt($('#pedido-obra').value, 10),
            justificativa: $('#pedido-just').value.trim(),
            data: new Date().toISOString().slice(0, 10),
            status: 'pendente' // entra direto em "Aguardando Aprovação"
        };
        /* >>> BACKEND <<<
           await fetch('/api/pedidos', { method:'POST', body: JSON.stringify(novo) }) */
        DB.pedidosMaterial.push(novo);
        toast('Pedido enviado! Status: Aguardando Aprovação.', 'success');
        navigate('op-pedido');
    });
}

/* --- 6.2 Meus Equipamentos (QR Code) ------------------------------ */
function viewOpEquipamentos() {
    const minhas = DB.ferramentas.filter(f => f.funcionarioId === session.user.funcionarioId);
    return `
    <div class="panel">
        <div class="panel-header">
            <div><h3>Equipamentos sob minha responsabilidade</h3>
            <div class="panel-sub">${minhas.length} item(ns) em cautela</div></div>
            <button id="btn-scan" class="btn btn-danger btn-lg">📷 Escanear Ferramenta</button>
        </div>
        <div id="lista-equip">
            ${minhas.map(f => `
            <div class="equip-card">
                <div class="equip-icon">🔧</div>
                <div class="equip-info">
                    <strong>${f.nome}</strong>
                    <small>Patrimônio ${f.id} · Obra ${obraNome(f.obraId)}</small>
                </div>
                ${badgeStatus('em-uso')}
            </div>`).join('') || '<p style="color:var(--muted)">Nenhum equipamento em cautela.</p>'}
        </div>
    </div>`;
}
function hookOpEquipamentos() {
    $('#btn-scan').addEventListener('click', abrirScannerQR);
}

function abrirScannerQR() {
    openModal(`
        <h3>📷 Escanear QR Code da Ferramenta</h3>
        <div class="qr-scanner">
            <div class="qr-frame">▣</div>
            <div class="qr-laser"></div>
        </div>
        <p id="qr-status" class="qr-status">Aponte a câmera para o QR Code do equipamento...</p>
        <div class="modal-actions">
            <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
        </div>`);

    // Simula a leitura após 2,5s: pega uma ferramenta disponível no estoque
    setTimeout(() => {
        if ($('#modal-root').classList.contains('hidden')) return; // usuário cancelou
        const disponivel = DB.ferramentas.find(f => f.status === 'estoque' && f.estoque > 0);
        const status = $('#qr-status');
        if (!status) return;
        if (!disponivel) {
            status.textContent = 'Nenhuma ferramenta disponível no estoque.';
            return;
        }
        status.classList.add('ok');
        status.innerHTML = `✅ QR lido: <strong>${disponivel.nome}</strong> (${disponivel.id})`;
        $('#modal-box .modal-actions').innerHTML = `
            <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-success" id="btn-receber">✔ Confirmar Recebimento</button>`;
        $('#btn-receber').addEventListener('click', () => {
            /* >>> BACKEND <<<
               await fetch('/api/ferramentas/' + disponivel.id + '/transferir', {
                   method: 'PATCH',
                   body: JSON.stringify({ funcionarioId: session.user.funcionarioId }) }) */
            const func = DB.funcionarios.find(f => f.id === session.user.funcionarioId);
            disponivel.status = 'em-uso';
            disponivel.funcionarioId = session.user.funcionarioId;
            disponivel.obraId = func.obraId;
            disponivel.estoque = Math.max(0, disponivel.estoque - 1);
            closeModal();
            toast(`${disponivel.nome} adicionada aos seus equipamentos!`, 'success');
            navigate('op-equipamentos');
        });
    }, 2500);
}

/* --- 6.3 Horas e Holerite (compartilhado com Supervisão) ----------- */
function viewOpHoras() {
    const func = DB.funcionarios.find(f => f.id === session.user.funcionarioId);
    const linhas = DB.horasMes.map(h => ({
        ...h, valor: h.normais * func.valorHora + h.extras50 * func.valorHora * 1.5
    }));
    const totNormais = linhas.reduce((s, l) => s + l.normais, 0);
    const totExtras = linhas.reduce((s, l) => s + l.extras50, 0);
    const totValor = linhas.reduce((s, l) => s + l.valor, 0);

    return `
    <div class="cards-grid">
        ${statCard('', '🕐', 'Horas Normais (Jul/26)', totNormais + 'h')}
        ${statCard('yellow', '⏰', 'Horas Extras 50%', totExtras + 'h')}
        ${statCard('green', '💰', 'Valor a Receber', brl(totValor), 'Base: ' + brl(func.valorHora) + '/h')}
    </div>
    <div class="panel">
        <div class="panel-header">
            <h3>Espelho de Ponto — Julho/2026</h3>
            <button id="btn-holerite" class="btn btn-primary">⬇ Baixar Holerite (PDF)</button>
        </div>
        <div class="table-wrap"><table>
            <thead><tr><th>Data</th><th>Entrada</th><th>Saída</th><th>Normais</th><th>Extras 50%</th><th>Obra</th><th>Valor</th></tr></thead>
            <tbody>
                ${linhas.map(l => `<tr>
                    <td>${dataBR(l.data)}</td><td>${l.entrada}</td><td>${l.saida}</td>
                    <td>${l.normais}h</td><td>${l.extras50}h</td>
                    <td>${obraNome(l.obraId)}</td><td class="td-strong">${brl(l.valor)}</td></tr>`).join('')}
            </tbody>
            <tfoot><tr><td colspan="3">TOTAIS</td><td>${totNormais}h</td><td>${totExtras}h</td><td></td><td>${brl(totValor)}</td></tr></tfoot>
        </table></div>
    </div>`;
}
function hookOpHoras() {
    $('#btn-holerite').addEventListener('click', () => {
        /* >>> BACKEND <<<
           O holerite real será um PDF gerado pelo Python (ex: ReportLab):
           window.open('/api/holerites/2026-07/download') */
        const func = DB.funcionarios.find(f => f.id === session.user.funcionarioId);
        const totN = DB.horasMes.reduce((s, h) => s + h.normais, 0);
        const totE = DB.horasMes.reduce((s, h) => s + h.extras50, 0);
        const tot = totN * func.valorHora + totE * func.valorHora * 1.5;
        gerarPDF('holerite_julho_2026.pdf', 'Demonstrativo de Pagamento - Julho/2026', [
            'Funcionario: ' + func.nome,
            'Funcao: ' + func.funcao,
            'Valor hora: ' + brl(func.valorHora),
            'Horas normais: ' + totN + 'h',
            'Horas extras (50%): ' + totE + 'h',
            '',
            'TOTAL BRUTO: ' + brl(tot),
            '',
            '(Documento simulado gerado pelo prototipo)'
        ]);
        toast('Holerite baixado em PDF!', 'success');
    });
}

/* ================================================================
   7. PERFIL ALMOXARIFADO
   ================================================================ */
function viewAlmDashboard() {
    const total = DB.ferramentas.length;
    const emUso = DB.ferramentas.filter(f => f.status === 'em-uso').length;
    const estoque = DB.ferramentas.filter(f => f.status === 'estoque').length;
    const baixoEstoque = DB.ferramentas.filter(f => f.estoque < f.estoqueMin);
    const pendentes = DB.pedidosMaterial.filter(p => p.status === 'pendente').length;

    return `
    <div class="cards-grid">
        ${statCard('', '🗃️', 'Total de Ferramentas', total, 'itens patrimoniados')}
        ${statCard('yellow', '👷', 'Em Uso', emUso, 'em cautela com funcionários')}
        ${statCard('green', '✅', 'No Estoque', estoque, 'disponíveis para retirada')}
        ${statCard('red', '🚨', 'Baixo Estoque', baixoEstoque.length, 'abaixo do mínimo')}
    </div>

    ${baixoEstoque.length ? `
    <div class="panel">
        <div class="panel-header"><h3>🚨 Itens Abaixo do Estoque Mínimo</h3></div>
        <div class="table-wrap"><table>
            <thead><tr><th>Patrimônio</th><th>Item</th><th>Estoque</th><th>Mínimo</th><th>Situação</th></tr></thead>
            <tbody>${baixoEstoque.map(f => `<tr>
                <td>${f.id}</td><td class="td-strong">${f.nome}</td><td>${f.estoque}</td><td>${f.estoqueMin}</td>
                <td><span class="badge badge-red">Repor ${f.estoqueMin - f.estoque} un</span></td></tr>`).join('')}
            </tbody>
        </table></div>
    </div>` : ''}

    <div class="panel">
        <div class="panel-header"><h3>📥 Fila de Pedidos</h3></div>
        <p style="font-size:13.5px">Existem <strong>${pendentes}</strong> pedido(s) aguardando análise em <strong>Gestão de Pedidos</strong>.</p>
    </div>`;
}

/* --- 7.1 Inventário (CRUD de estoque com filtros) ------------------ */
const filtroEstoque = { termo: '', categoria: 'todas', status: 'todos' };

function categoriasFerramentas() {
    return [...new Set(DB.ferramentas.map(f => f.categoria))].sort();
}

function ferramentasFiltradas() {
    return DB.ferramentas.filter(f => {
        const t = filtroEstoque.termo;
        const okTermo = !t || f.nome.toLowerCase().includes(t) || f.id.toLowerCase().includes(t);
        const okCat = filtroEstoque.categoria === 'todas' || f.categoria === filtroEstoque.categoria;
        const okStatus = filtroEstoque.status === 'todos'
            || (filtroEstoque.status === 'baixo' ? f.estoque < f.estoqueMin : f.status === filtroEstoque.status);
        return okTermo && okCat && okStatus;
    });
}

function viewAlmEstoque() {
    filtroEstoque.termo = ''; filtroEstoque.categoria = 'todas'; filtroEstoque.status = 'todos';
    return `
    <div class="panel">
        <div class="panel-header">
            <div><h3>Inventário de Ferramentas e Materiais</h3>
            <div class="panel-sub">Cadastre, edite quantidades e acompanhe mínimos de estoque</div></div>
            <div class="panel-tools">
                <input type="search" id="busca-estoque" class="search-input" placeholder="🔎 Buscar item ou patrimônio...">
                <select id="filtro-status-estoque" class="select-input">
                    <option value="todos">Todos os status</option>
                    <option value="estoque">No estoque</option>
                    <option value="em-uso">Em uso</option>
                    <option value="baixo">Abaixo do mínimo</option>
                </select>
                <button id="btn-novo-item" class="btn btn-primary">➕ Novo Item</button>
            </div>
        </div>
        <div class="chips" id="chips-categoria" style="margin-bottom:16px">
            <button class="chip active" data-cat="todas">Todas</button>
            ${categoriasFerramentas().map(c => `<button class="chip" data-cat="${c}">${c}</button>`).join('')}
        </div>
        <div class="table-wrap"><table>
            <thead><tr><th>Patrimônio</th><th>Item</th><th>Categoria</th><th>Estoque / Mín.</th><th>Status</th><th>Localização</th><th>Ações</th></tr></thead>
            <tbody id="tbody-estoque"></tbody>
        </table></div>
    </div>`;
}

function linhasEstoque() {
    const lista = ferramentasFiltradas();
    if (!lista.length) return '<tr><td colspan="7">Nenhum item encontrado.</td></tr>';
    return lista.map(f => {
        const baixo = f.estoque < f.estoqueMin;
        return `<tr>
        <td>${f.id}</td>
        <td class="td-strong">${f.nome}</td>
        <td><span class="badge badge-gray no-dot">${f.categoria}</span></td>
        <td>${baixo ? `<span class="badge badge-red">${f.estoque} / ${f.estoqueMin}</span>`
                    : `<span class="badge badge-green no-dot">${f.estoque} / ${f.estoqueMin}</span>`}</td>
        <td>${badgeStatus(f.status)}</td>
        <td>${f.status === 'em-uso'
            ? `${obraNome(f.obraId)}<span class="td-sub">${funcNome(f.funcionarioId)}</span>`
            : 'Almoxarifado'}</td>
        <td>
            <button class="btn btn-ghost btn-sm" data-editar-item="${f.id}">✏️ Editar</button>
            ${f.status === 'em-uso'
                ? `<button class="btn btn-soft btn-sm" data-devolver="${f.id}">↩ Devolução</button>` : ''}
            <button class="btn btn-ghost btn-sm" data-excluir-item="${f.id}" style="color:var(--vermelho)">🗑</button>
        </td></tr>`;
    }).join('');
}

function renderTbodyEstoque() {
    $('#tbody-estoque').innerHTML = linhasEstoque();
    document.querySelectorAll('[data-editar-item]').forEach(b =>
        b.addEventListener('click', () => abrirModalItem(b.dataset.editarItem)));
    document.querySelectorAll('[data-devolver]').forEach(b =>
        b.addEventListener('click', () => receberDevolucao(b.dataset.devolver)));
    document.querySelectorAll('[data-excluir-item]').forEach(b =>
        b.addEventListener('click', () => confirmarExclusaoItem(b.dataset.excluirItem)));
    prepararTabelasResponsivas();
}

function hookAlmEstoque() {
    renderTbodyEstoque();
    $('#busca-estoque').addEventListener('input', (e) => {
        filtroEstoque.termo = e.target.value.toLowerCase().trim();
        renderTbodyEstoque();
    });
    $('#filtro-status-estoque').addEventListener('change', (e) => {
        filtroEstoque.status = e.target.value;
        renderTbodyEstoque();
    });
    document.querySelectorAll('#chips-categoria .chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('#chips-categoria .chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            filtroEstoque.categoria = chip.dataset.cat;
            renderTbodyEstoque();
        });
    });
    $('#btn-novo-item').addEventListener('click', () => abrirModalItem(null));
}

function abrirModalItem(id) {
    const item = id ? DB.ferramentas.find(f => f.id === id) : null;
    const cats = categoriasFerramentas();
    openModal(`
        <h3>${item ? '✏️ Editar Item — ' + item.id : '➕ Novo Item de Estoque'}</h3>
        <div class="form-grid">
            <div class="form-field full"><label>Nome do item *</label>
                <input type="text" id="item-nome" value="${item ? item.nome : ''}" placeholder="Ex: Multímetro Digital"></div>
            <div class="form-field"><label>Categoria *</label>
                <select id="item-cat">
                    ${cats.map(c => `<option ${item && item.categoria === c ? 'selected' : ''}>${c}</option>`).join('')}
                </select></div>
            <div class="form-field"><label>Qtd. em estoque *</label>
                <input type="number" id="item-qtd" min="0" value="${item ? item.estoque : 1}"></div>
            <div class="form-field"><label>Estoque mínimo *</label>
                <input type="number" id="item-min" min="0" value="${item ? item.estoqueMin : 1}"></div>
        </div>
        <div class="modal-actions">
            <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" id="btn-salvar-item">💾 Salvar</button>
        </div>`);

    $('#btn-salvar-item').addEventListener('click', () => {
        const nome = $('#item-nome').value.trim();
        const qtd = parseInt($('#item-qtd').value, 10);
        const min = parseInt($('#item-min').value, 10);
        if (!nome || isNaN(qtd) || isNaN(min)) return toast('Preencha todos os campos.', 'error');

        if (item) {
            /* >>> BACKEND <<< : PUT /api/ferramentas/{id} */
            Object.assign(item, { nome, categoria: $('#item-cat').value, estoque: qtd, estoqueMin: min });
            toast('Item atualizado!', 'success');
        } else {
            /* >>> BACKEND <<< : POST /api/ferramentas */
            const prox = Math.max(...DB.ferramentas.map(f => parseInt(f.id.split('-')[1], 10))) + 1;
            DB.ferramentas.push({
                id: 'FER-' + String(prox).padStart(3, '0'),
                nome, categoria: $('#item-cat').value,
                status: 'estoque', funcionarioId: null, obraId: null,
                estoque: qtd, estoqueMin: min
            });
            toast('Item cadastrado no inventário!', 'success');
        }
        closeModal();
        renderTbodyEstoque();
    });
}

function receberDevolucao(id) {
    /* >>> BACKEND <<< : PATCH /api/ferramentas/{id}/devolver */
    const f = DB.ferramentas.find(x => x.id === id);
    const quem = funcNome(f.funcionarioId);
    f.status = 'estoque'; f.funcionarioId = null; f.obraId = null; f.estoque += 1;
    toast(`Devolução de ${quem} registrada. ${f.nome} voltou ao estoque.`, 'success');
    renderTbodyEstoque();
}

function confirmarExclusaoItem(id) {
    const f = DB.ferramentas.find(x => x.id === id);
    openModal(`
        <h3>🗑 Excluir Item</h3>
        <p style="font-size:13.5px">Remover <strong>${f.nome}</strong> (${f.id}) do inventário?
        Esta ação não pode ser desfeita.</p>
        <div class="modal-actions">
            <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-danger" id="btn-confirma-excluir">Excluir</button>
        </div>`);
    $('#btn-confirma-excluir').addEventListener('click', () => {
        /* >>> BACKEND <<< : DELETE /api/ferramentas/{id} */
        DB.ferramentas.splice(DB.ferramentas.indexOf(f), 1);
        closeModal();
        toast(`${f.nome} removido do inventário.`, 'success');
        renderTbodyEstoque();
    });
}

/* --- 7.2 Gestão de Pedidos (com filtro por status) ----------------- */
let filtroPedidos = 'pendente';

function viewAlmPedidos() {
    filtroPedidos = 'pendente';
    return `
    <div class="panel">
        <div class="panel-header">
            <div><h3>Pedidos de Material das Equipes</h3>
            <div class="panel-sub">Aprove para transferir o item ao solicitante e baixar do estoque</div></div>
        </div>
        <div class="chips" id="chips-pedidos" style="margin-bottom:16px">
            <button class="chip active" data-st="pendente">⏳ Pendentes</button>
            <button class="chip" data-st="aprovado">✅ Aprovados</button>
            <button class="chip" data-st="negado">❌ Negados</button>
            <button class="chip" data-st="todos">Todos</button>
        </div>
        <div class="table-wrap"><table>
            <thead><tr><th>#</th><th>Data</th><th>Solicitante</th><th>Item</th><th>Qtd</th><th>Obra</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody id="tbody-pedidos"></tbody>
        </table></div>
    </div>`;
}

function linhasPedidos() {
    const lista = DB.pedidosMaterial
        .filter(p => filtroPedidos === 'todos' || p.status === filtroPedidos)
        .sort((a, b) => b.id - a.id);
    if (!lista.length) return '<tr><td colspan="8">Nenhum pedido nesta categoria. ✅</td></tr>';
    return lista.map(p => `<tr>
        <td>${p.id}</td><td>${dataBR(p.data)}</td><td>${funcNome(p.funcionarioId)}</td>
        <td class="td-strong">${p.item}${p.justificativa ? `<span class="td-sub">${p.justificativa}</span>` : ''}</td>
        <td>${p.qtd}</td><td>${obraNome(p.obraId)}</td><td>${badgeStatus(p.status)}</td>
        <td>${p.status === 'pendente' ? `
            <button class="btn btn-success btn-sm" data-aprovar="${p.id}">✔ Aprovar</button>
            <button class="btn btn-ghost btn-sm" data-negar="${p.id}" style="color:var(--vermelho)">✖ Negar</button>` : '—'}
        </td></tr>`).join('');
}

function renderTbodyPedidos() {
    $('#tbody-pedidos').innerHTML = linhasPedidos();
    document.querySelectorAll('[data-aprovar]').forEach(b =>
        b.addEventListener('click', () => decidirPedido(parseInt(b.dataset.aprovar, 10), 'aprovado')));
    document.querySelectorAll('[data-negar]').forEach(b =>
        b.addEventListener('click', () => decidirPedido(parseInt(b.dataset.negar, 10), 'negado')));
    prepararTabelasResponsivas();
}

function hookAlmPedidos() {
    renderTbodyPedidos();
    document.querySelectorAll('#chips-pedidos .chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('#chips-pedidos .chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            filtroPedidos = chip.dataset.st;
            renderTbodyPedidos();
        });
    });
}

function decidirPedido(id, decisao) {
    /* >>> BACKEND <<<
       await fetch(`/api/pedidos/${id}`, { method:'PATCH',
           body: JSON.stringify({ status: decisao }) }) */
    const pedido = DB.pedidosMaterial.find(p => p.id === id);
    pedido.status = decisao;

    // Ao aprovar, transfere a ferramenta (se patrimoniada) para o funcionário
    if (decisao === 'aprovado' && pedido.ferramentaId) {
        const ferr = DB.ferramentas.find(f => f.id === pedido.ferramentaId);
        if (ferr) {
            ferr.status = 'em-uso';
            ferr.funcionarioId = pedido.funcionarioId;
            ferr.obraId = pedido.obraId;
            ferr.estoque = Math.max(0, ferr.estoque - pedido.qtd);
        }
    }
    toast(decisao === 'aprovado'
        ? `Pedido #${id} aprovado — item transferido para ${funcNome(pedido.funcionarioId)}.`
        : `Pedido #${id} negado.`, decisao === 'aprovado' ? 'success' : 'error');
    renderTbodyPedidos();
}

/* --- 7.3 Rastreabilidade ------------------------------------------- */
const filtroRastreio = { termo: '', obra: 'todas' };

function viewAlmRastreio() {
    filtroRastreio.termo = ''; filtroRastreio.obra = 'todas';
    return `
    <div class="panel">
        <div class="panel-header">
            <div><h3>Rastreabilidade de Ferramentas</h3>
            <div class="panel-sub">Localize qualquer item: com quem está e em qual obra</div></div>
            <div class="panel-tools">
                <select id="rastreio-obra" class="select-input">
                    <option value="todas">Todas as obras</option>
                    ${DB.obras.map(o => `<option value="${o.id}">${o.nome}</option>`).join('')}
                    <option value="almox">Almoxarifado</option>
                </select>
                <input type="search" id="busca-rastreio" class="search-input"
                       placeholder="🔎 Ex: Furadeira, João, Raízen...">
            </div>
        </div>
        <div class="table-wrap"><table>
            <thead><tr><th>Patrimônio</th><th>Ferramenta</th><th>Categoria</th><th>Status</th><th>Obra</th><th>Com o Funcionário</th></tr></thead>
            <tbody id="tbody-rastreio">${linhasRastreio(DB.ferramentas)}</tbody>
        </table></div>
    </div>`;
}
function linhasRastreio(lista) {
    if (!lista.length) return '<tr><td colspan="6">Nenhum item encontrado para a busca.</td></tr>';
    return lista.map(f => `<tr>
        <td>${f.id}</td><td class="td-strong">${f.nome}</td>
        <td><span class="badge badge-gray no-dot">${f.categoria}</span></td>
        <td>${badgeStatus(f.status)}</td>
        <td>${f.obraId ? obraNome(f.obraId) : '<span class="badge badge-gray no-dot">Almoxarifado</span>'}</td>
        <td>${f.funcionarioId ? funcNome(f.funcionarioId) : '—'}</td></tr>`).join('');
}
function aplicarFiltroRastreio() {
    /* >>> BACKEND <<< : em produção, busca server-side com debounce:
       fetch('/api/ferramentas?q=' + encodeURIComponent(termo) + '&obra=' + obra) */
    const t = filtroRastreio.termo;
    const filtradas = DB.ferramentas.filter(f => {
        const okObra = filtroRastreio.obra === 'todas'
            || (filtroRastreio.obra === 'almox' ? !f.obraId : f.obraId === parseInt(filtroRastreio.obra, 10));
        const okTermo = !t
            || f.nome.toLowerCase().includes(t)
            || f.id.toLowerCase().includes(t)
            || f.categoria.toLowerCase().includes(t)
            || (f.obraId && obraNome(f.obraId).toLowerCase().includes(t))
            || (f.funcionarioId && funcNome(f.funcionarioId).toLowerCase().includes(t));
        return okObra && okTermo;
    });
    $('#tbody-rastreio').innerHTML = linhasRastreio(filtradas);
    prepararTabelasResponsivas();
}
function hookAlmRastreio() {
    $('#busca-rastreio').addEventListener('input', (e) => {
        filtroRastreio.termo = e.target.value.toLowerCase().trim();
        aplicarFiltroRastreio();
    });
    $('#rastreio-obra').addEventListener('change', (e) => {
        filtroRastreio.obra = e.target.value;
        aplicarFiltroRastreio();
    });
}

/* ================================================================
   8. PERFIL SUPERVISÃO E SEGURANÇA
   ================================================================ */
function viewSupProjetos() {
    return `
    <div class="panel">
        <div class="panel-header">
            <div><h3>Central de Projetos — Plantas Elétricas</h3>
            <div class="panel-sub">Baixe a planta em PDF para consultar ou editar</div></div>
            <select id="filtro-obra" class="select-input" style="min-width:190px">
                <option value="todas">Todas as obras</option>
                ${DB.obras.map(o => `<option value="${o.id}">${o.nome}</option>`).join('')}
            </select>
        </div>
        <div id="galeria-plantas" class="gallery-grid">${cardsPlantas(DB.plantas)}</div>
    </div>`;
}
function cardsPlantas(lista) {
    if (!lista.length) return '<p style="color:var(--muted)">Nenhuma planta para esta obra.</p>';
    return lista.map(p => `
        <div class="plant-card">
            ${plantaSVG(p.tipo)}
            <div class="plant-body">
                <strong>${p.titulo}</strong>
                <small>${p.id} · ${p.revisao} · Obra ${obraNome(p.obraId)}</small>
                <div class="plant-actions">
                    <button class="btn btn-primary btn-sm" data-baixar-planta="${p.id}">⬇ Baixar PDF</button>
                </div>
            </div>
        </div>`).join('');
}
function bindDownloadPlantas() {
    document.querySelectorAll('[data-baixar-planta]').forEach(b =>
        b.addEventListener('click', () => {
            /* >>> BACKEND <<< : GET /api/plantas/{id}/download (PDF real) */
            const p = DB.plantas.find(x => x.id === b.dataset.baixarPlanta);
            gerarPDF(p.id + '.pdf', p.titulo, [
                'Codigo: ' + p.id,
                'Revisao: ' + p.revisao,
                'Obra: ' + obraNome(p.obraId),
                '',
                '(Planta simulada gerada pelo prototipo -',
                'o arquivo real sera servido pelo backend)'
            ]);
            toast(`${p.id} baixado em PDF.`, 'success');
        }));
}
function hookSupProjetos() {
    bindDownloadPlantas();
    $('#filtro-obra').addEventListener('change', (e) => {
        const val = e.target.value;
        /* >>> BACKEND <<< : fetch('/api/plantas?obra_id=' + val) */
        const filtradas = val === 'todas'
            ? DB.plantas
            : DB.plantas.filter(p => p.obraId === parseInt(val, 10));
        $('#galeria-plantas').innerHTML = cardsPlantas(filtradas);
        bindDownloadPlantas();
    });
}

/* --- 8.1 Modelos e Documentos (download de modelos prontos) -------- */
function viewSupModelos() {
    return `
    <div class="panel">
        <div class="panel-header">
            <div><h3>Modelos Prontos — APR, RDO e Segurança</h3>
            <div class="panel-sub">Baixe o modelo em PDF e edite no Word/Excel conforme a atividade</div></div>
        </div>
        <div class="gallery-grid" style="grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr))">
            ${DB.modelosDocumentos.map(m => `
            <div class="doc-card">
                <div class="doc-icon">${m.icon}</div>
                <div class="doc-body">
                    <strong>${m.nome}</strong>
                    <p>${m.desc}</p>
                    <button class="btn btn-primary btn-sm" data-baixar-modelo="${m.id}">⬇ Baixar Modelo (PDF)</button>
                </div>
            </div>`).join('')}
        </div>
    </div>`;
}
function hookSupModelos() {
    document.querySelectorAll('[data-baixar-modelo]').forEach(b =>
        b.addEventListener('click', () => {
            /* >>> BACKEND <<< : GET /api/modelos/{id}/download
               (o PDF real do modelo ficará armazenado no servidor) */
            const m = DB.modelosDocumentos.find(x => x.id === b.dataset.baixarModelo);
            gerarPDF(m.id + '.pdf', m.nome, [
                'Obra: ______________________________  Data: ____/____/______',
                'Responsavel: _______________________________________________',
                'Equipe: ____________________________________________________',
                '',
                'Descricao da atividade:',
                '____________________________________________________________',
                '____________________________________________________________',
                '',
                '(Modelo simulado - edite no Word/Excel apos o download)'
            ]);
            toast(`Modelo ${m.nome.split('—')[0].trim()} baixado.`, 'success');
        }));
}

/* ================================================================
   9. PERFIL ADMINISTRAÇÃO ("God Mode")
   ================================================================ */
function viewAdmDashboard() {
    const custoTotal = DB.obras.reduce((s, o) => s + o.custoTotal, 0);
    const orcamentoTotal = DB.obras.reduce((s, o) => s + o.orcamento, 0);
    const ativos = DB.funcionarios.filter(f => f.ativo);
    const folha = ativos.reduce((s, f) => s + f.valorHora * 220, 0); // estimativa 220h/mês
    const hoje = new Date('2026-07-10');
    const docsAlerta = DB.docsEmpresa.filter(d => {
        const dias = (new Date(d.validade) - hoje) / 86400000;
        return dias < 30;
    }).length;

    return `
    <div class="cards-grid">
        ${statCard('', '💼', 'Custo Realizado (Obras)', brlK(custoTotal), 'de ' + brlK(orcamentoTotal) + ' orçados')}
        ${statCard('red', '🧾', 'Folha Mensal Estimada', brlK(folha), 'base 220h/funcionário')}
        ${statCard('green', '👥', 'Funcionários Ativos', ativos.length)}
        ${statCard('', '🏗️', 'Obras em Andamento', DB.obras.length)}
        ${statCard('yellow', '📁', 'Documentos em Alerta', docsAlerta, 'vencidos ou vencendo em 30 dias')}
    </div>
    <div class="charts-grid">
        <div class="panel"><div class="panel-header"><h3>💰 Custos por Obra — Orçado × Realizado</h3></div>
            <div class="chart-box"><canvas id="chart-custos"></canvas></div></div>
        <div class="panel"><div class="panel-header"><h3>⏱️ Horas Trabalhadas — Últimos 6 Meses</h3></div>
            <div class="chart-box"><canvas id="chart-horas"></canvas></div></div>
        <div class="panel"><div class="panel-header"><h3>👥 Distribuição da Equipe por Obra</h3></div>
            <div class="chart-box sm"><canvas id="chart-equipe"></canvas></div></div>
        <div class="panel"><div class="panel-header"><h3>🧾 Custo Mensal de Folha por Função</h3></div>
            <div class="chart-box sm"><canvas id="chart-folha"></canvas></div></div>
    </div>`;
}
function hookAdmDashboard() {
    /* >>> BACKEND <<< : os dados dos gráficos virão de
       GET /api/relatorios/custos-por-obra
       GET /api/relatorios/horas-mensais?meses=6
       GET /api/relatorios/equipe-por-obra
       GET /api/relatorios/folha-por-funcao */
    const AZUL = '#1b3f8f', AZUL_CLARO = '#8fa8d9', VERMELHO = '#c62828';

    charts.custos = new Chart($('#chart-custos'), {
        type: 'bar',
        data: {
            labels: DB.obras.map(o => o.nome),
            datasets: [
                { label: 'Orçado',    data: DB.obras.map(o => o.orcamento),  backgroundColor: AZUL_CLARO, borderRadius: 6 },
                { label: 'Realizado', data: DB.obras.map(o => o.custoTotal), backgroundColor: AZUL,       borderRadius: 6 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { ticks: { callback: v => 'R$ ' + v / 1000 + 'k' }, grid: { color: '#eef0f6' } },
                      x: { grid: { display: false } } }
        }
    });

    charts.horas = new Chart($('#chart-horas'), {
        type: 'line',
        data: {
            labels: DB.horasUltimos6Meses.map(m => m.mes),
            datasets: [{
                label: 'Horas trabalhadas',
                data: DB.horasUltimos6Meses.map(m => m.horas),
                borderColor: VERMELHO,
                backgroundColor: 'rgba(198,40,40,.08)',
                fill: true, tension: .35,
                pointBackgroundColor: AZUL, pointRadius: 4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { grid: { color: '#eef0f6' } }, x: { grid: { display: false } } }
        }
    });

    const ativos = DB.funcionarios.filter(f => f.ativo);
    charts.equipe = new Chart($('#chart-equipe'), {
        type: 'doughnut',
        data: {
            labels: DB.obras.map(o => o.nome),
            datasets: [{
                data: DB.obras.map(o => ativos.filter(f => f.obraId === o.id).length),
                backgroundColor: [AZUL, VERMELHO, '#4d76c4'],
                borderWidth: 3, borderColor: '#fff'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '62%',
                   plugins: { legend: { position: 'right' } } }
    });

    const porFuncao = {};
    ativos.forEach(f => {
        const chave = f.funcao.split(' ')[0]; // agrupa: Eletricista, Ajudante, ...
        porFuncao[chave] = (porFuncao[chave] || 0) + f.valorHora * 220;
    });
    charts.folha = new Chart($('#chart-folha'), {
        type: 'bar',
        data: {
            labels: Object.keys(porFuncao),
            datasets: [{ data: Object.values(porFuncao), backgroundColor: AZUL, borderRadius: 6 }]
        },
        options: {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { ticks: { callback: v => 'R$ ' + v / 1000 + 'k' }, grid: { color: '#eef0f6' } },
                      y: { grid: { display: false } } }
        }
    });
}

/* --- 9.1 Visão de Obras --------------------------------------------- */
function viewAdmObras() {
    const hoje = new Date('2026-07-10');
    return `
    <div class="obras-grid">
        ${DB.obras.map(o => {
            const equipe = DB.funcionarios.filter(f => f.ativo && f.obraId === o.id);
            const ferrs = DB.ferramentas.filter(f => f.obraId === o.id).length;
            const consumo = Math.round(o.custoTotal / o.orcamento * 100);
            const corConsumo = consumo >= 90 ? 'red' : consumo >= 70 ? 'yellow' : 'green';
            const diasRestantes = Math.round((new Date(o.prazo) - hoje) / 86400000);
            return `
            <div class="obra-card">
                <div class="obra-head">
                    <h4>${o.nome}</h4>
                    ${badgeStatus(o.status)}
                </div>
                <div class="obra-cliente">${o.cliente} · ${o.cidade}</div>

                <div class="obra-prog-row"><span>Avanço físico</span><span>${o.progresso}%</span></div>
                <div class="progress"><div class="progress-fill" style="width:${o.progresso}%"></div></div>

                <div class="obra-prog-row" style="margin-top:12px"><span>Orçamento consumido</span>
                    <span>${brlK(o.custoTotal)} / ${brlK(o.orcamento)} (${consumo}%)</span></div>
                <div class="progress"><div class="progress-fill ${corConsumo}" style="width:${Math.min(consumo, 100)}%"></div></div>

                <div class="obra-metricas">
                    <div><span class="m-label">Equipe</span><span class="m-value">${equipe.length} 👷</span></div>
                    <div><span class="m-label">Ferramentas</span><span class="m-value">${ferrs} 🔧</span></div>
                    <div><span class="m-label">Prazo</span><span class="m-value">${diasRestantes}d</span></div>
                </div>

                <div style="font-size:12.5px;color:var(--muted)">
                    Responsável: <strong style="color:var(--ink)">${funcNome(o.responsavelId)}</strong><br>
                    Início ${dataBR(o.inicio)} · Entrega ${dataBR(o.prazo)}
                </div>
            </div>`;
        }).join('')}
    </div>`;
}

/* --- 9.2 Gestão de Pessoas (CRUD) ------------------------------------ */
function viewAdmFuncionarios() {
    const ativos = DB.funcionarios.filter(f => f.ativo);
    return `
    <div class="panel">
        <div class="panel-header">
            <div><h3>Quadro de Funcionários</h3>
            <div class="panel-sub">${ativos.length} colaboradores ativos</div></div>
            <div class="panel-tools">
                <input type="search" id="busca-func" class="search-input" placeholder="🔎 Buscar por nome ou função...">
                <button id="btn-add-func" class="btn btn-primary">➕ Adicionar Funcionário</button>
            </div>
        </div>
        <div class="table-wrap"><table>
            <thead><tr><th>Nome</th><th>Função</th><th>Valor/Hora</th><th>Obra</th><th>Admissão</th><th>Ações</th></tr></thead>
            <tbody id="tbody-func"></tbody>
        </table></div>
    </div>`;
}
function linhasFuncionarios(termo = '') {
    const lista = DB.funcionarios.filter(f => f.ativo &&
        (!termo || f.nome.toLowerCase().includes(termo) || f.funcao.toLowerCase().includes(termo)));
    if (!lista.length) return '<tr><td colspan="6">Nenhum funcionário encontrado.</td></tr>';
    return lista.map(f => `<tr>
        <td class="td-strong">${f.nome}</td><td>${f.funcao}</td><td>${brl(f.valorHora)}</td>
        <td>${obraNome(f.obraId)}</td><td>${dataBR(f.admissao)}</td>
        <td>
            <button class="btn btn-ghost btn-sm" data-editar="${f.id}">✏️ Editar</button>
            <button class="btn btn-ghost btn-sm" data-demitir="${f.id}" style="color:var(--vermelho)">🗑 Demitir</button>
        </td></tr>`).join('');
}
function renderTbodyFuncionarios(termo = '') {
    $('#tbody-func').innerHTML = linhasFuncionarios(termo);
    document.querySelectorAll('[data-editar]').forEach(b =>
        b.addEventListener('click', () => abrirModalFuncionario(parseInt(b.dataset.editar, 10))));
    document.querySelectorAll('[data-demitir]').forEach(b =>
        b.addEventListener('click', () => confirmarDemissao(parseInt(b.dataset.demitir, 10))));
    prepararTabelasResponsivas();
}
function hookAdmFuncionarios() {
    renderTbodyFuncionarios();
    $('#btn-add-func').addEventListener('click', () => abrirModalFuncionario(null));
    $('#busca-func').addEventListener('input', (e) =>
        renderTbodyFuncionarios(e.target.value.toLowerCase().trim()));
}

function abrirModalFuncionario(id) {
    const func = id ? DB.funcionarios.find(f => f.id === id) : null;
    openModal(`
        <h3>${func ? '✏️ Editar Funcionário' : '➕ Novo Funcionário'}</h3>
        <div class="form-grid">
            <div class="form-field full"><label>Nome completo *</label>
                <input type="text" id="func-nome" value="${func ? func.nome : ''}"></div>
            <div class="form-field"><label>Função *</label>
                <input type="text" id="func-funcao" value="${func ? func.funcao : ''}" placeholder="Ex: Eletricista"></div>
            <div class="form-field"><label>Valor/Hora (R$) *</label>
                <input type="number" id="func-valor" step="0.50" min="0" value="${func ? func.valorHora : ''}"></div>
            <div class="form-field full"><label>Obra alocada</label>
                <select id="func-obra">
                    ${DB.obras.map(o => `<option value="${o.id}" ${func && func.obraId === o.id ? 'selected' : ''}>${o.nome}</option>`).join('')}
                </select></div>
        </div>
        <div class="modal-actions">
            <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-primary" id="btn-salvar-func">💾 Salvar</button>
        </div>`);

    $('#btn-salvar-func').addEventListener('click', () => {
        const nome = $('#func-nome').value.trim();
        const funcao = $('#func-funcao').value.trim();
        const valor = parseFloat($('#func-valor').value);
        if (!nome || !funcao || !(valor > 0)) return toast('Preencha nome, função e valor/hora.', 'error');

        if (func) {
            /* >>> BACKEND <<< : PUT /api/funcionarios/{id} */
            Object.assign(func, { nome, funcao, valorHora: valor, obraId: parseInt($('#func-obra').value, 10) });
            toast('Dados do funcionário atualizados!', 'success');
        } else {
            /* >>> BACKEND <<< : POST /api/funcionarios */
            DB.funcionarios.push({
                id: Math.max(...DB.funcionarios.map(f => f.id)) + 1,
                nome, funcao, valorHora: valor,
                obraId: parseInt($('#func-obra').value, 10),
                admissao: new Date().toISOString().slice(0, 10),
                ativo: true
            });
            toast(`${nome} admitido(a) com sucesso!`, 'success');
        }
        closeModal();
        navigate('adm-funcionarios');
    });
}

function confirmarDemissao(id) {
    const func = DB.funcionarios.find(f => f.id === id);
    openModal(`
        <h3>⚠️ Confirmar Desligamento</h3>
        <p style="font-size:13.5px">Deseja realmente demitir/remover <strong>${func.nome}</strong> (${func.funcao})?</p>
        <p style="color:var(--muted);font-size:12.5px;margin-top:8px">
            As ferramentas em cautela retornarão automaticamente ao estoque.</p>
        <div class="modal-actions">
            <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
            <button class="btn btn-danger" id="btn-confirma-demissao">🗑 Confirmar Demissão</button>
        </div>`);
    $('#btn-confirma-demissao').addEventListener('click', () => {
        /* >>> BACKEND <<< : DELETE /api/funcionarios/{id}
           (ou PATCH { ativo: false } para manter histórico) */
        func.ativo = false;
        DB.ferramentas.filter(f => f.funcionarioId === id).forEach(f => {
            f.status = 'estoque'; f.funcionarioId = null; f.obraId = null; f.estoque += 1;
        });
        closeModal();
        toast(`${func.nome} removido(a) do quadro. Ferramentas devolvidas ao estoque.`, 'success');
        navigate('adm-funcionarios');
    });
}

/* --- 9.3 Documentação da Empresa ------------------------------------- */
function situacaoDoc(validade) {
    const dias = Math.round((new Date(validade) - new Date('2026-07-10')) / 86400000);
    if (dias < 0) return `<span class="badge badge-red">Vencido há ${-dias}d</span>`;
    if (dias <= 30) return `<span class="badge badge-yellow">Vence em ${dias}d</span>`;
    return `<span class="badge badge-green">Válido</span>`;
}
function viewAdmDocumentos() {
    return `
    <div class="panel">
        <div class="panel-header">
            <div><h3>Documentação da Empresa</h3>
            <div class="panel-sub">Contratos, ARTs, certificados e programas de segurança</div></div>
        </div>
        <div class="chips" id="chips-docs" style="margin-bottom:16px">
            <button class="chip active" data-tipo="todos">Todos</button>
            ${[...new Set(DB.docsEmpresa.map(d => d.tipo))].map(t =>
                `<button class="chip" data-tipo="${t}">${t}</button>`).join('')}
        </div>
        <div class="table-wrap"><table>
            <thead><tr><th>Código</th><th>Documento</th><th>Tipo</th><th>Obra</th><th>Validade</th><th>Situação</th><th></th></tr></thead>
            <tbody id="tbody-docs"></tbody>
        </table></div>
    </div>`;
}
function linhasDocs(tipo = 'todos') {
    const lista = DB.docsEmpresa.filter(d => tipo === 'todos' || d.tipo === tipo);
    return lista.map(d => `<tr>
        <td>${d.id}</td><td class="td-strong">${d.nome}</td>
        <td><span class="badge badge-gray no-dot">${d.tipo}</span></td>
        <td>${d.obraId ? obraNome(d.obraId) : 'Geral'}</td>
        <td>${dataBR(d.validade)}</td><td>${situacaoDoc(d.validade)}</td>
        <td><button class="btn btn-ghost btn-sm" data-baixar-doc="${d.id}">⬇ PDF</button></td></tr>`).join('');
}
function renderTbodyDocs(tipo = 'todos') {
    $('#tbody-docs').innerHTML = linhasDocs(tipo);
    document.querySelectorAll('[data-baixar-doc]').forEach(b =>
        b.addEventListener('click', () => {
            /* >>> BACKEND <<< : GET /api/documentos/{id}/download */
            const d = DB.docsEmpresa.find(x => x.id === b.dataset.baixarDoc);
            gerarPDF(d.id + '.pdf', d.nome, [
                'Codigo: ' + d.id, 'Tipo: ' + d.tipo,
                'Obra: ' + (d.obraId ? obraNome(d.obraId) : 'Geral'),
                'Validade: ' + dataBR(d.validade),
                '', '(Documento simulado gerado pelo prototipo)'
            ]);
            toast(`${d.id} baixado em PDF.`, 'success');
        }));
    prepararTabelasResponsivas();
}
function hookAdmDocumentos() {
    renderTbodyDocs();
    document.querySelectorAll('#chips-docs .chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('#chips-docs .chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            renderTbodyDocs(chip.dataset.tipo);
        });
    });
}

/* --- 9.4 Relatório de Horas + Exportação CSV -------------------------- */
function viewAdmRelatorios() {
    const linhas = DB.funcionarios.filter(f => f.ativo).map(f => {
        const horas = 160 + (f.id * 7) % 40; // horas simuladas do mês
        return { ...f, horas, custo: horas * f.valorHora };
    });
    const totalCusto = linhas.reduce((s, l) => s + l.custo, 0);
    const totalHoras = linhas.reduce((s, l) => s + l.horas, 0);
    return `
    <div class="cards-grid">
        ${statCard('', '⏱️', 'Total de Horas (Jul/26)', totalHoras + 'h')}
        ${statCard('red', '💸', 'Custo Total da Folha', brlK(totalCusto))}
        ${statCard('green', '📊', 'Média por Colaborador', Math.round(totalHoras / linhas.length) + 'h')}
    </div>
    <div class="panel">
        <div class="panel-header">
            <h3>Relatório de Horas — Julho/2026</h3>
            <button id="btn-export-csv" class="btn btn-primary">📊 Exportar Relatório (CSV/Excel)</button>
        </div>
        <div class="table-wrap"><table id="tabela-relatorio">
            <thead><tr><th>Funcionário</th><th>Função</th><th>Obra</th><th>Horas no Mês</th><th>Valor/Hora</th><th>Custo Total</th></tr></thead>
            <tbody>
                ${linhas.map(l => `<tr>
                    <td class="td-strong">${l.nome}</td><td>${l.funcao}</td><td>${obraNome(l.obraId)}</td>
                    <td>${l.horas}h</td><td>${brl(l.valorHora)}</td><td class="td-strong">${brl(l.custo)}</td></tr>`).join('')}
            </tbody>
            <tfoot><tr><td colspan="5">CUSTO TOTAL DA FOLHA</td><td>${brl(totalCusto)}</td></tr></tfoot>
        </table></div>
    </div>`;
}
function hookAdmRelatorios() {
    $('#btn-export-csv').addEventListener('click', () => {
        /* >>> BACKEND <<<
           Em produção o Python (pandas/openpyxl) gera o arquivo:
           window.open('/api/relatorios/horas/export?mes=2026-07&formato=xlsx') */
        const linhas = [['Funcionario;Funcao;Obra;Horas;Valor Hora;Custo Total']];
        DB.funcionarios.filter(f => f.ativo).forEach(f => {
            const horas = 160 + (f.id * 7) % 40;
            linhas.push([`${f.nome};${f.funcao};${obraNome(f.obraId)};${horas};` +
                `${f.valorHora.toFixed(2).replace('.', ',')};${(horas * f.valorHora).toFixed(2).replace('.', ',')}`]);
        });
        downloadArquivo('relatorio_horas_julho_2026.csv', linhas.join('\n'), 'text/csv');
        toast('Relatório CSV exportado! Abra no Excel.', 'success');
    });
}
