🧬 Bioteste Solus - Sistema de Gestão Laboratorial v2.0

Bem-vindo ao Bioteste Solus, uma plataforma web progressiva (PWA) projetada para otimizar o fluxo de atendimento laboratorial e a gestão de qualidade (NPS). O sistema foca em velocidade, operação offline-first, segurança de dados e inteligência de negócio.

🚀 Visão Geral

O sistema é dividido em dois módulos principais com base no nível de acesso do utilizador:

Módulo Operacional (Funcionários): Focado na velocidade de cadastro, gestão da fila de espera, consulta rápida de resultados e treino.

Módulo Administrativo (Gestão/Qualidade): Focado em inteligência de dados, análise de NPS (Net Promoter Score), gestão de utilizadores, relatórios gerenciais e auditoria.

✨ Funcionalidades Principais

🏥 Operacional (Frente de Loja)

Fila Inteligente (Offline-First): Permite cadastrar pacientes mesmo sem internet. Os dados são armazenados localmente (localStorage) e sincronizados automaticamente com a API Google Apps Script quando a conexão é restabelecida.

Dashboard Diário: Visualização imediata de metas do dia, atendimentos realizados e alertas de resultados pendentes de entrega ("Para Hoje").

Alertas Sonoros: Notificações em tempo real com áudio para avisos importantes da administração ou atualizações de sistema.

Central de Treino: Página dedicada com vídeo-aulas e guias passo a passo integrados.

Lista de Atendimentos: Filtros avançados por data, nome, número Astra e unidade com visualização de status colorida.

📊 Administrativo & Qualidade

Cruzamento de Dados (B.I.): O sistema compara automaticamente o volume de Atendimentos Realizados (API Produção) com as Pesquisas Respondidas (API Qualidade) para gerar taxas de conversão reais por unidade.

Análise de NPS: Cálculo automático de satisfação, gráficos de barras por quesito (Recepção, Coleta, Espera, Prazo) e distribuição por unidade.

Voz do Cliente: Aba dedicada para feedbacks textuais e clientes que se identificaram na pesquisa, permitindo ação rápida sobre críticas.

Gestão de Utilizadores: CRUD completo (Criar, Ler, Atualizar, Apagar) de utilizadores com controle de nível de acesso (ADM vs Funcionário) e reset de senha.

Relatórios Formais: Geração de PDFs limpos (layout A4) e exportação para CSV (Excel) com um clique, incluindo cabeçalhos e rodapés automáticos.

🛡️ Segurança (Módulo ArtSecure)

O sistema conta com um módulo de segurança ativo (art.secure.js) que implementa:

Bloqueio Mobile: Restringe o acesso apenas a computadores/desktops para garantir a segurança dos dados e a integridade do layout.

Anti-Debug: Bloqueia tentativas de inspeção de código (F12, Botão Direito, Atalhos de DevTools).

Validação de Dispositivo: Sistema de Token via E-mail para autorizar novos dispositivos (2FA).

Banimento Automático: Bloqueio temporário (3 dias) em caso de detecção de comportamento suspeito.

Selo de Segurança: Indicador visual de "Google Safe Browsing" para tranquilidade do operador.

📂 Estrutura do Projeto

O projeto é composto por ficheiros HTML estáticos potencializados por JavaScript moderno e Tailwind CSS, organizados para fácil manutenção.

Raiz (Acesso Público/Operacional)

Ficheiro

Descrição

index.html

Tela de Login principal.

verificar.token.html

Validação de segurança (2FA) para novos dispositivos.

boas.vindas.html

Landing page do funcionário (apresentação de novidades).

painel.solus.bioteste.html

Dashboard Principal do funcionário.

adicionar.atendimento.html

Formulário de cadastro com Fila Offline e Sincronização.

lista.atendimentos.html

Listagem e busca de pacientes com filtros.

relatorios.html

Relatórios operacionais básicos da unidade.

video.aula.html

Central de ajuda com player de áudio/vídeo e guias.

minha.conta.html

Perfil do utilizador e logout.

Pasta admqualidade/ (Acesso Restrito - Gestão)

Ficheiro

Descrição

boasvindasadm.html

Landing page do gestor (apresentação v2.0).

painel.qualidade.html

Dashboard de NPS e cruzamento de dados (BI).

pesquisa.qualidade.html

Detalhamento das pesquisas, feedbacks e gráficos específicos.

relatorio.pesquisa.html

Gerador de PDF oficial de qualidade (Layout A4).

relatorios.gerais.html

Relatórios gerenciais com filtros avançados e exclusão em massa.

gerenciar.usuarios.html

Painel de controle de acessos, criação e edição de utilizadores.

manual.html

Documentação técnica e operacional para o gestor.

minha.conta.html

Perfil do administrador (versão roxa).

Núcleo (Scripts & Config)

Ficheiro

Descrição

layout.js

Motor de layout para o módulo Operacional (Menu Azul/Header).

layout.adm.js

Motor de layout para o módulo Administrativo (Menu Roxo/Header).

art.secure.js

Módulo de segurança, proteção e validação de ambiente.

logo.png

Favicon e Logótipo do sistema.

LICENSE

Arquivo de licença MIT.

🛠️ Tecnologias Utilizadas

Frontend: HTML5 Semântico, JavaScript (ES6+).

Estilização: Tailwind CSS (via CDN) para design responsivo e moderno.

Backend (Serverless): Google Apps Script (Executáveis Web para API).

Base de Dados: Google Sheets (conectado via API JSON GET/POST).

Ícones: Google Material Symbols (Outlined).

Fontes: Inter (Google Fonts).

🚀 Como Utilizar

Login: Aceda a index.html. Utilize as credenciais fornecidas pelo administrador.

Primeiro Acesso: Se for um novo dispositivo, o sistema enviará um Token de 4 dígitos para o e-mail cadastrado. Insira-o em verificar.token.html.

Navegação Automática:

Funcionários: Serão direcionados ao fluxo azul (painel.solus...) após verem a tela de boas-vindas.

Administradores: Serão direcionados ao fluxo roxo (admqualidade/...) para gestão estratégica.

📄 Licença

Este projeto está licenciado sob a licença MIT. Consulte o ficheiro LICENSE para mais detalhes sobre direitos de uso e distribuição.

Desenvolvido por Artificial Ribeiro © 2025