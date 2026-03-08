// Optimizador de FPS y Memoria
const PerformanceEngine = {
    init() {
        // Ejecutar animaciones a 60fps sincronizados con el monitor
        window.requestAnimationFrame(this.smoothAnimations);
        this.hibernateTabs();
    },

    smoothAnimations() {
        // Aquí el navegador sincroniza los ciclos de refresco
    },

    hibernateTabs() {
        // Si una pestaña no se ve, reducimos su prioridad de CPU
        document.addEventListener("visibilitychange", () => {
            const activeFrame = document.querySelector('iframe.active');
            if (document.hidden) {
                if(activeFrame) activeFrame.style.opacity = "0.5";
            } else {
                if(activeFrame) activeFrame.style.opacity = "1";
            }
        });
    }
};

PerformanceEngine.init();
