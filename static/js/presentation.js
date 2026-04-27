document.addEventListener("DOMContentLoaded", () => {
    const revealables = document.querySelectorAll(".reveal");
    const counters = document.querySelectorAll(".metric-value[data-count]");

    // Hace aparecer los bloques conforme entran al viewport.
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.18 }
    );

    revealables.forEach((node) => revealObserver.observe(node));

    // Anima los números de la sección de métricas una sola vez.
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const node = entry.target;
                const target = Number(node.dataset.count || 0);
                const duration = 1100;
                const start = performance.now();

                const tick = (timestamp) => {
                    const progress = Math.min((timestamp - start) / duration, 1);
                    node.textContent = String(Math.round(target * progress));
                    if (progress < 1) {
                        requestAnimationFrame(tick);
                    }
                };

                requestAnimationFrame(tick);
                counterObserver.unobserve(node);
            });
        },
        { threshold: 0.35 }
    );

    counters.forEach((node) => counterObserver.observe(node));
});
