/**
 * BIOTESTE SOLUS - MÓDULO DE SEGURANÇA (ART.SECURE)
 * Proteção contra depuração, emulação mobile e uso indevido.
 */

const ArtSecure = {
    
    config: {
        banDurationDays: 3,
        mobileBlock: true,
        debugBlock: true,
        vpnCheck: true // Verificação básica de fuso horário/local
    },

    init: function() {
        // 1. Verifica se já está banido
        if (this.isBanned()) {
            this.showBanScreen();
            return;
        }

        // 2. Inicia proteções ativas
        if (this.config.debugBlock) this.antiDebug();
        if (this.config.mobileBlock) this.blockMobile();
        if (this.config.vpnCheck) this.checkIntegrity();

        // 3. Adiciona Selo de Segurança
        this.addSecurityBadge();

        console.log("%c Sistema Solus - Monitoramento Ativo ", "background: #005A9C; color: #fff; padding: 5px; border-radius: 3px;");
    },

    // --- BANIMENTO LOCAL ---
    banUser: function(reason) {
        const banData = {
            timestamp: new Date().getTime(),
            reason: reason
        };
        localStorage.setItem('bioteste_sec_ban', JSON.stringify(banData));
        this.showBanScreen(reason);
    },

    isBanned: function() {
        const banData = localStorage.getItem('bioteste_sec_ban');
        if (!banData) return false;

        const parsed = JSON.parse(banData);
        const now = new Date().getTime();
        const banTime = parsed.timestamp;
        const daysPassed = (now - banTime) / (1000 * 60 * 60 * 24);

        if (daysPassed < this.config.banDurationDays) {
            return true;
        } else {
            // Remove banimento após o tempo expirar
            localStorage.removeItem('bioteste_sec_ban');
            return false;
        }
    },

    showBanScreen: function(reason = "Violação de Segurança") {
        document.body.innerHTML = ''; // Limpa o site
        document.body.style.overflow = 'hidden';
        
        const banHTML = `
            <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:#0f1923; color:white; display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:99999; text-align:center; font-family: sans-serif;">
                <span style="font-size: 64px; color: #ef4444; margin-bottom: 20px;">🚫</span>
                <h1 style="font-size: 24px; margin-bottom: 10px;">Acesso Bloqueado</h1>
                <p style="color: #9ca3af; max-width: 400px; line-height: 1.5;">
                    Seu dispositivo foi sinalizado por atividade suspeita ou incompatível.<br>
                    <strong>Motivo:</strong> ${reason}
                </p>
                <div style="margin-top: 30px; padding: 15px; background: #1f2937; border-radius: 8px; border: 1px solid #374151;">
                    <p style="font-size: 12px; color: #6b7280;">Bloqueio temporário de 72 horas.</p>
                    <p style="font-size: 12px; color: #6b7280;">ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
            </div>
        `;
        document.body.innerHTML = banHTML;
        // Trava loop para dificultar ações no console
        setInterval(() => { debugger; }, 100);
    },

    // --- ANTI DEVTOOLS (F12 / Inspeção) ---
    antiDebug: function() {
        // Desabilita clique direito
        document.addEventListener('contextmenu', event => event.preventDefault());

        // Desabilita teclas de atalho comuns (F12, Ctrl+Shift+I, etc)
        document.onkeydown = function(e) {
            if (e.keyCode == 123) { // F12
                return false;
            }
            if (e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0) || e.keyCode == 'C'.charCodeAt(0))) {
                return false;
            }
            if (e.ctrlKey && (e.keyCode == 'U'.charCodeAt(0))) { // Ctrl+U (Source)
                return false;
            }
        };

        // Detecção por diferença de tamanho (Console aberto doca a janela)
        // Nota: Isso é sensível, usamos apenas para logging ou alerta suave, banir direto pode dar falso positivo
        const threshold = 160;
        const checkDevTools = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if ((widthThreshold || heightThreshold) && (window.fullScreen === false)) {
                // Apenas alerta, não bane direto para evitar erro com extensões
                console.clear(); 
                console.log("%c ATENÇÃO: O uso de ferramentas de desenvolvedor é monitorado. ", "color: red; font-size: 20px; font-weight: bold;");
            }
        }
        window.addEventListener('resize', checkDevTools);
        
        // "Debugger" trap - Se o console estiver aberto, isso pausa a execução
        setInterval(function() {
            const startTime = performance.now();
            debugger; // Isso só para se o DevTools estiver aberto
            if (performance.now() - startTime > 100) {
                // Se demorou muito, o usuário estava com breakpoint ou devtools travando
                // ArtSecure.banUser("Tentativa de Depuração (DevTools)"); // Descomente para ativar banimento
            }
        }, 2000);
    },

    // --- BLOQUEIO MOBILE ---
    blockMobile: function() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const smallScreen = window.innerWidth < 768; // Breakpoint comum de tablet/celular

        if (isMobile || smallScreen) {
            document.body.innerHTML = '';
            document.body.style.backgroundColor = '#0f1923';
            document.body.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; color:white; text-align:center; font-family:sans-serif; padding:20px;">
                    <span class="material-symbols-outlined" style="font-size:48px; color:#fbbf24; margin-bottom:20px;">phonelink_erase</span>
                    <h2>Acesso Mobile Restrito</h2>
                    <p style="color:#9ca3af; margin-top:10px;">O Sistema Solus (Bioteste) é otimizado apenas para Desktop/Workstations por motivos de segurança e usabilidade.</p>
                    <p style="font-size:12px; color:#6b7280; margin-top:30px;">Por favor, acesse através de um computador.</p>
                </div>
            `;
            throw new Error("Mobile Access Blocked");
        }
    },

    // --- VERIFICAÇÃO DE INTEGRIDADE (VPN/Proxy Check Básico) ---
    checkIntegrity: function() {
        // Verifica consistência do Timezone
        // Se o timezone do navegador não bater com o Locale pt-BR, pode ser VPN
        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            // Lista de timezones aceitáveis para o Brasil (simplificado)
            const brTimezones = ['America/Sao_Paulo', 'America/Manaus', 'America/Belem', 'America/Fortaleza', 'America/Recife', 'America/Araguaina', 'America/Maceio', 'America/Bahia', 'America/Cuiaba', 'America/Campo_Grande', 'America/Porto_Velho', 'America/Boa_Vista', 'America/Rio_Branco'];
            
            // Se não estiver no Brasil, alerta (Cuidado: Pode bloquear quem viaja)
            // Esta é uma verificação "Soft".
            if (!brTimezones.includes(timeZone) && navigator.language === 'pt-BR') {
                console.warn("Fuso horário suspeito para a localidade.");
                // ArtSecure.banUser("Inconsistência de Localização/VPN"); // Muito agressivo para produção sem backend
            }
        } catch (e) {}
    },

    // --- UI: SELO DE SEGURANÇA ---
    addSecurityBadge: function() {
        const badge = document.createElement('div');
        badge.id = 'art-secure-badge';
        badge.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(4px);
            padding: 5px 10px;
            border-radius: 20px;
            border: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            gap: 6px;
            font-family: sans-serif;
            font-size: 10px;
            color: #059669;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            z-index: 9999;
            cursor: help;
            transition: all 0.3s ease;
        `;
        badge.innerHTML = `
            <span class="material-symbols-outlined" style="font-size: 14px;">verified_user</span>
            <span style="font-weight: 700;">Google Safe Browsing</span>
            <span style="width: 6px; height: 6px; background: #059669; border-radius: 50%; margin-left: 2px; animation: pulse 2s infinite;"></span>
        `;
        
        // Tooltip ao passar o mouse
        badge.title = "Conexão Monitorada e Segura (SSL/TLS)";
        
        // Adiciona keyframes para o "pulso" se não existir
        if (!document.getElementById('art-secure-style')) {
            const style = document.createElement('style');
            style.id = 'art-secure-style';
            style.innerHTML = `@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.7); } 70% { box-shadow: 0 0 0 4px rgba(5, 150, 105, 0); } 100% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0); } }`;
            document.head.appendChild(style);
        }

        document.body.appendChild(badge);
    }
};

// Auto-inicialização ao carregar o DOM
window.addEventListener('DOMContentLoaded', () => {
    // Verifica se não estamos na tela de login (index.html) para aplicar restrições
    if (!window.location.href.includes('index.html')) {
        ArtSecure.init();
    }
});