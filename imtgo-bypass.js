// imtgo-bypass.js - Bypass automático para IMTGo / Lazarus
(function() {
    const BLOCK_KEYWORDS = [
        "acceso denegado",
        "access denied",
        "blocked by",
        "imtlazarus",
        "imtgo",
        "lazarus",
        "conexión rechazada",
        "site blocked",
        "forbidden",
        "403",
        "proxy blocked"
    ];

    function isBlocked() {
        const bodyText = document.body.innerText.toLowerCase();
        const title = document.title.toLowerCase();
        
        return BLOCK_KEYWORDS.some(keyword => 
            bodyText.includes(keyword) || title.includes(keyword)
        );
    }

    function applyBypass() {
        console.log("🚀 Waevo detectó bloqueo IMTGo/Lazarus → Activando bypass...");

        // 1. Intentar con proxy integrado de Waevo (si ya tienes el motor)
        if (typeof window.useProxy === 'function') {
            window.useProxy("https://waevo.vercel.app");
        }

        // 2. Fallback: Redirigir con un proxy público rápido (puedes cambiar o rotar)
        const proxies = [
            "https://corsproxy.io/?",
            "https://api.allorigins.win/raw?url=",
            "https://proxy.waevo.workers.dev/?url="   // ← aquí puedes poner tu propio worker si creas uno
        ];

        const currentUrl = encodeURIComponent(window.location.href);
        let attempt = 0;

        function tryNextProxy() {
            if (attempt >= proxies.length) {
                console.error("❌ Todos los proxies fallaron");
                return;
            }
            window.location.href = proxies[attempt] + currentUrl;
            attempt++;
        }

        tryNextProxy();

        // Retry automático cada 3 segundos si sigue bloqueado
        setTimeout(() => {
            if (isBlocked()) tryNextProxy();
        }, 3000);
    }

    // Ejecutar al cargar
    window.addEventListener('load', () => {
        if (isBlocked()) {
            applyBypass();
        }
    });

    // También comprobar cada vez que cambie el contenido (útil si carga dinámico)
    const observer = new MutationObserver(() => {
        if (isBlocked()) {
            observer.disconnect();
            applyBypass();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
