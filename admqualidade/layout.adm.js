/**
 * BIOTESTE SOLUS - MOTOR DE LAYOUT ADMINISTRATIVO (ADM/QUALIDADE)
 * Menu específico para gestores e qualidade.
 */

const BiotesteLayoutAdm = {
    
    // --- MENU ESPECÍFICO PARA ADM ---
    menuItems: [
        { id: 'dashboard', icon: 'analytics', label: 'Dashboard Qualidade', link: 'painel.qualidade.html' },
        { id: 'pesquisa', icon: 'content_paste_search', label: 'Pesquisa de Qualidade', link: 'pesquisa.qualidade.html' },
        { id: 'relatorio_pesquisa', icon: 'summarize', label: 'Relat. Pesquisa', link: 'relatorio.pesquisa.html' },
        { id: 'relatorios_gerais', icon: 'folder_shared', label: 'Relatórios Gerais', link: 'relatorios.html' }, // Volta um nível se estiver em pasta
        { id: 'usuarios', icon: 'manage_accounts', label: 'Gerenciar Usuários', link: 'gerenciar.usuarios.html' }
    ],

    helpItems: [
        { id: 'manual', icon: 'menu_book', label: 'Manual do Sistema', link: 'manual.html' }
    ],

    user: null,

    init: function(activePageId) {
        this.checkAuth();
        this.injectStyles();
        this.renderSidebar(activePageId);
        this.renderHeader();
        document.body.classList.add('loaded');
    },

    checkAuth: function() {
        try {
            const user = localStorage.getItem('bioteste_user');
            if (!user) { window.stop(); window.location.href = '../index.html'; }
            this.user = JSON.parse(user);
            
            // Verificação Extra de Segurança (Apenas ADM)
            if (this.user.acesso !== 'adm') {
                alert("Acesso negado. Área restrita.");
                window.location.href = '../boas.vindas.html';
            }
        } catch (e) { window.location.href = '../index.html'; }
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
                    <div class="flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-bioteste-primary p-2 text-white shadow-lg">
                        <span class="material-symbols-outlined text-2xl">admin_panel_settings</span>
                    </div>
                    <div class="flex flex-col">
                        <h1 class="text-bioteste-text-heading text-lg font-bold leading-tight tracking-tight">Gestão Solus</h1>
                        <p class="text-bioteste-text-body text-[10px] uppercase font-bold tracking-wider">Painel Administrativo</p>
                    </div>
                </div>
                <nav class="flex flex-1 flex-col overflow-y-auto no-scrollbar">
                    <div class="mb-6">
                        <p class="px-3 text-[10px] uppercase text-gray-400 font-bold mb-2 tracking-wider">Gestão</p>
                        ${this.menuItems.map(createLink).join('')}
                    </div>
                    <div>
                        <p class="px-3 text-[10px] uppercase text-gray-400 font-bold mb-2 tracking-wider">Sistema</p>
                        ${this.helpItems.map(createLink).join('')}
                    </div>
                </nav>
                <div class="flex flex-col gap-1 pt-4 border-t border-gray-100 mt-2">
                    <a href="minha.conta.html" class="flex items-center gap-3 px-3 py-2 rounded-lg text-bioteste-text-body hover:bg-gray-50 transition-colors">
                        <span class="material-symbols-outlined">account_circle</span>
                        <p class="text-sm font-medium">Minha Conta</p>
                    </a>
                    <button onclick="BiotesteLayoutAdm.logout()" class="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors text-left">
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

        const nome = this.user.nome || 'Administrador';
        const iniciais = nome.substring(0, 2).toUpperCase();

        header.innerHTML = `
            <div class="flex items-center gap-4">
                <button onclick="document.getElementById('app-sidebar').classList.toggle('-translate-x-full')" class="lg:hidden text-gray-500 hover:text-primary p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <span class="material-symbols-outlined">menu</span>
                </button>
                <div class="text-bioteste-text-heading">
                    <h2 class="text-sm font-bold leading-tight">Olá, ${nome}</h2>
                    <div class="flex items-center gap-1 text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full w-fit mt-0.5">
                        <span class="material-symbols-outlined text-[10px]">verified</span>
                        <span>Administrador</span>
                    </div>
                </div>
            </div>
            
            <div class="flex items-center gap-3 relative">
                <div class="h-9 w-9 rounded-full bg-gradient-to-br from-purple-600 to-bioteste-primary p-[2px]">
                    <div class="h-full w-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-bioteste-primary">
                        ${iniciais}
                    </div>
                </div>
            </div>
        `;
    },

    logout: function() {
        if(confirm("Sair do Painel Administrativo?")) {
            localStorage.removeItem('bioteste_user');
            window.location.href = '../index.html';
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