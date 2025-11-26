/**
 * BIOTESTE SOLUS - MOTOR DE LAYOUT
 * Controla Menu Lateral, Cabeçalho, Segurança e UI Global.
 */

const BiotesteLayout = {
    
    // Configurações
    apiNotificacoes: "https://script.google.com/macros/s/AKfycbxIDx14MW6mkhoGLm77DiuPUlH9R3MDdF_MFdLoW0JYo6wLeaMe9kA9AyxNBr8DWhBh1w/exec",

    menuItems: [
        { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', link: 'painel.solus.bioteste.html' },
        { id: 'novo', icon: 'add_circle', label: 'Novo Atendimento', link: 'adicionar.atendimento.html' },
        { id: 'listar', icon: 'list_alt', label: 'Listar Atendimentos', link: 'lista.atendimentos.html' },
        { id: 'relatorios', icon: 'assessment', label: 'Relatórios', link: 'relatorios.html' }
    ],

    helpItems: [
        { id: 'manual', icon: 'menu_book', label: 'Manual do Sistema', link: 'manual.html' },
        { id: 'video', icon: 'smart_display', label: 'Vídeo de Uso', link: 'video.aula.html' }
    ],

    user: null,

    init: function(activePageId) {
        this.checkAuth();
        this.injectStyles();
        this.renderSidebar(activePageId);
        this.renderHeader();
        
        // Carrega notificações automaticamente
        this.carregarNotificacoes();

        // Fecha dropdown se clicar fora
        document.addEventListener('click', (e) => {
            const drop = document.getElementById('dropdown-notificacoes');
            const btn = e.target.closest('#btn-notificacoes');
            if (!btn && drop && !drop.classList.contains('hidden') && !e.target.closest('#dropdown-notificacoes')) {
                drop.classList.add('hidden');
            }
        });

        document.body.classList.add('loaded');
    },

    checkAuth: function() {
        try {
            const user = localStorage.getItem('bioteste_user');
            if (!user) { window.stop(); window.location.href = 'index.html'; }
            this.user = JSON.parse(user);
        } catch (e) { window.location.href = 'index.html'; }
    },

    toggleNotificacoes: function() {
        const drop = document.getElementById('dropdown-notificacoes');
        if(drop) drop.classList.toggle('hidden');
    },

    renderSidebar: function(activeId) {
        const sidebar = document.getElementById('app-sidebar');
        if (!sidebar) return;

        const createLink = (item) => {
            const isActive = activeId === item.id;
            const activeClass = "bg-bioteste-primary/10 text-bioteste-primary font-semibold shadow-sm ring-1 ring-bioteste-primary/20";
            const inactiveClass = "text-bioteste-text-body hover:bg-gray-50 hover:text-bioteste-primary transition-all";
            
            return `
                <a href="${item.link}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 ${isActive ? activeClass : inactiveClass}">
                    <span class="material-symbols-outlined ${isActive ? 'text-bioteste-primary' : 'text-gray-400 group-hover:text-bioteste-primary'}">${item.icon}</span>
                    <p class="text-sm leading-normal ${isActive ? '' : 'font-medium'}">${item.label}</p>
                </a>
            `;
        };

        sidebar.innerHTML = `
            <div class="flex h-full flex-col p-4">
                <div class="flex items-center gap-3 p-3 mb-6 border-b border-gray-100 pb-6">
                    <div class="flex items-center justify-center rounded-xl bg-gradient-to-br from-bioteste-primary to-bioteste-secondary p-2 text-white shadow-lg shadow-blue-200">
                        <span class="material-symbols-outlined text-2xl">science</span>
                    </div>
                    <div class="flex flex-col">
                        <h1 class="text-bioteste-text-heading text-lg font-bold leading-tight tracking-tight">Bioteste</h1>
                        <p class="text-bioteste-text-body text-[10px] uppercase font-bold tracking-wider">Sistema Solus</p>
                    </div>
                </div>
                <nav class="flex flex-1 flex-col overflow-y-auto no-scrollbar">
                    <div class="mb-6">
                        <p class="px-3 text-[10px] uppercase text-gray-400 font-bold mb-2 tracking-wider">Principal</p>
                        ${this.menuItems.map(createLink).join('')}
                    </div>
                    <div>
                        <p class="px-3 text-[10px] uppercase text-gray-400 font-bold mb-2 tracking-wider">Suporte</p>
                        ${this.helpItems.map(createLink).join('')}
                    </div>
                </nav>
                <div class="flex flex-col gap-1 pt-4 border-t border-gray-100 mt-2">
                    <a href="minha.conta.html" class="flex items-center gap-3 px-3 py-2 rounded-lg text-bioteste-text-body hover:bg-gray-50 transition-colors">
                        <span class="material-symbols-outlined">account_circle</span>
                        <p class="text-sm font-medium">Minha Conta</p>
                    </a>
                    <button onclick="BiotesteLayout.logout()" class="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors text-left">
                        <span class="material-symbols-outlined">logout</span>
                        <p class="text-sm font-medium">Sair</p>
                    </button>
                </div>
            </div>
        `;
    },

    renderHeader: function() {
        const header = document.getElementById('app-header');
        if (!header) return;

        const nome = this.user.nome || 'Usuário';
        const unidade = this.user.unidade || 'Matriz';
        const iniciais = nome.substring(0, 2).toUpperCase();

        header.innerHTML = `
            <div class="flex items-center gap-4">
                <button onclick="document.getElementById('app-sidebar').classList.toggle('-translate-x-full')" class="lg:hidden text-gray-500 hover:text-primary p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <span class="material-symbols-outlined">menu</span>
                </button>
                <div class="text-bioteste-text-heading">
                    <h2 class="text-sm font-bold leading-tight">Olá, ${nome}</h2>
                    <div class="flex items-center gap-1 text-xs text-gray-500">
                        <span class="material-symbols-outlined text-[10px]">domain</span>
                        <span>${unidade}</span>
                    </div>
                </div>
            </div>
            
            <div class="flex items-center gap-3 relative">
                <!-- Container de Notificações -->
                <div class="relative">
                    <button id="btn-notificacoes" onclick="BiotesteLayout.toggleNotificacoes()" class="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-primary transition-all border border-transparent hover:border-blue-100" title="Notificações">
                        <span class="material-symbols-outlined text-xl">notifications</span>
                        <!-- Badge (Oculto por padrão) -->
                        <span id="notificacao-badge" class="absolute top-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white hidden bg-red-500"></span>
                    </button>

                    <!-- Dropdown -->
                    <div id="dropdown-notificacoes" class="hidden absolute top-12 right-0 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                        <div class="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <span class="font-bold text-sm text-gray-700">Notificações</span>
                            <button onclick="BiotesteLayout.carregarNotificacoes()" class="text-xs text-bioteste-primary hover:underline flex items-center gap-1">
                                <span class="material-symbols-outlined text-[10px]">refresh</span> Atualizar
                            </button>
                        </div>
                        <div id="lista-notificacoes" class="max-h-80 overflow-y-auto">
                            <div class="p-4 text-center text-gray-400 text-sm">Carregando...</div>
                        </div>
                    </div>
                </div>

                <!-- Avatar -->
                <div class="h-9 w-9 rounded-full bg-gradient-to-br from-bioteste-primary to-bioteste-secondary p-[2px]">
                    <div class="h-full w-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-bioteste-primary">
                        ${iniciais}
                    </div>
                </div>
            </div>
        `;
    },

    // Lógica Centralizada de Notificações
    carregarNotificacoes: async function() {
        const container = document.getElementById('lista-notificacoes');
        const badge = document.getElementById('notificacao-badge');
        const dropdown = document.getElementById('dropdown-notificacoes');
        
        if(!container || !badge) return;

        const unidadeUsuario = (this.user.unidade || '').toLowerCase().trim();

        try {
            const url = `${this.apiNotificacoes}?action=get`; 
            const response = await fetch(url);
            const result = await response.json();
            const dados = result.data || [];

            container.innerHTML = '';
            
            const filtrados = dados.filter(n => {
                const u = (n.unidade || '').toLowerCase().trim();
                return u === unidadeUsuario || u === 'todos' || u === 'todas';
            });

            let temRecente = false;
            const hoje = new Date(); hoje.setHours(0,0,0,0);
            const ontem = new Date(); ontem.setDate(hoje.getDate() - 1); ontem.setHours(0,0,0,0);

            if (filtrados.length > 0) {
                badge.classList.remove('hidden');
                
                filtrados.forEach(n => {
                    const dataObj = this._converterData(n.criado_em);
                    let isHojeOuOntem = false;

                    if(dataObj) {
                        const dCheck = new Date(dataObj);
                        dCheck.setHours(0,0,0,0);
                        if(dCheck.getTime() === hoje.getTime() || dCheck.getTime() === ontem.getTime()) {
                            temRecente = true;
                            isHojeOuOntem = true;
                        }
                    }

                    // Lógica de URL e Layout
                    const temUrl = n.url_direcionamento && n.url_direcionamento.trim().length > 5;
                    const tag = temUrl ? 'a' : 'div';
                    const href = temUrl ? `href="${n.url_direcionamento}" target="_blank"` : '';
                    const hoverClass = temUrl ? 'hover:bg-blue-50 cursor-pointer group' : 'hover:bg-gray-50';
                    const iconLink = temUrl ? '<span class="material-symbols-outlined text-bioteste-primary text-sm mt-0.5">open_in_new</span>' : '';
                    const textoLink = temUrl ? '<span class="text-[10px] font-bold text-bioteste-primary uppercase mt-2 block tracking-wide">Acessar Link Relacionado</span>' : '';

                    const html = `
                        <${tag} ${href} class="block p-4 border-b border-gray-100 ${hoverClass} transition-colors">
                            <div class="flex gap-3 items-start">
                                <div class="flex-1 min-w-0">
                                    <!-- Texto com quebra de linha correta -->
                                    <p class="text-sm text-gray-700 leading-snug break-words whitespace-normal text-left">
                                        ${n.texto_notificacao}
                                    </p>
                                    ${textoLink}
                                    <p class="text-[10px] text-gray-400 mt-1 text-right">${n.criado_em || ''}</p>
                                </div>
                                ${iconLink}
                            </div>
                        </${tag}>
                    `;
                    container.insertAdjacentHTML('beforeend', html);
                });

                // Define cor do badge
                badge.className = temRecente 
                    ? "absolute top-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-yellow-500 animate-pulse"
                    : "absolute top-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500";

                // AUTO OPEN: Abre o dropdown se tiver notificação de hoje ou ontem
                if (temRecente && dropdown) {
                    dropdown.classList.remove('hidden');
                }

            } else {
                badge.classList.add('hidden');
                container.innerHTML = `
                    <div class="flex flex-col items-center justify-center p-8 text-gray-400">
                        <span class="material-symbols-outlined text-3xl mb-2 opacity-50">notifications_off</span>
                        <p class="text-xs">Tudo limpo por aqui.</p>
                    </div>
                `;
            }
        } catch (e) { 
            console.warn(e); 
            container.innerHTML = '<div class="p-4 text-center text-red-400 text-xs">Erro ao atualizar.</div>';
        }
    },

    // Utilitário interno para data
    _converterData: function(dataString) {
        if (!dataString) return null;
        // Tenta formato ISO
        if (dataString.includes('-') && dataString.length > 10) return new Date(dataString);
        // Tenta formato BR (dd/mm/yyyy)
        if (dataString.includes('/')) {
            const partes = dataString.split('/');
            if(partes.length === 3) {
                // Remove hora se houver
                const ano = partes[2].split(' ')[0];
                return new Date(ano, partes[1]-1, partes[0]);
            }
        }
        return null;
    },

    logout: function() {
        if(confirm("Deseja realmente sair do sistema?")) {
            localStorage.removeItem('bioteste_user');
            window.location.href = 'index.html';
        }
    },

    injectStyles: function() {
        const style = document.createElement('style');
        style.innerHTML = `
            body { visibility: hidden; opacity: 0; transition: opacity 0.4s ease-in-out; }
            body.loaded { visibility: visible; opacity: 1; }
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `;
        document.head.appendChild(style);
    }
};