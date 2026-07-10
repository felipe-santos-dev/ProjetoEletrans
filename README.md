# ELETRANS — Sistema de Gestão Interna

Protótipo front-end (HTML + CSS + Vanilla JavaScript) do sistema web interno da
**ELETRANS Automação e Elétrica Industrial** (Araraquara-SP), empresa de montagem de
infraestrutura elétrica (leitos, calhas, eletrodutos) e ligação de painéis de força
e controle em plantas industriais (Sylvamo, Raízen, Piracanjuba).

## Como rodar

Abra o `index.html` direto no navegador, ou sirva a pasta com:

```bash
python -m http.server 8734
```

e acesse `http://localhost:8734`.

## Perfis de acesso (login rápido na tela inicial)

| Perfil | Funcionalidades |
|---|---|
| **Operacional** | Pedido de material, equipamentos em cautela com leitura de QR Code (simulada), espelho de ponto e holerite em PDF |
| **Almoxarifado** | Dashboard de estoque, inventário com CRUD e filtros por categoria/status, aprovação de pedidos, rastreabilidade de ferramentas |
| **Supervisão** | Central de projetos (plantas em PDF), modelos prontos de APR/RDO/checklists NR para download, pedidos e horas |
| **Administração** | Gráficos financeiros (Chart.js), visão de obras com orçado × realizado, CRUD de funcionários, documentação com controle de validade, relatório de horas com exportação CSV |

## Estrutura

- `index.html` — tela de login e shell da SPA
- `style.css` — design system (cores institucionais: branco, azul e vermelho)
- `script.js` — banco de dados simulado (objeto `DB`), navegação SPA e lógica das telas

## Integração futura (backend Python)

Todos os pontos onde entrarão as chamadas reais à API estão marcados no `script.js`
com o comentário `>>> BACKEND <<<`, incluindo o endpoint sugerido
(ex: `POST /api/pedidos`, `PATCH /api/ferramentas/{id}/transferir`).
