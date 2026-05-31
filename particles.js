(function () {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const mouse = { x: null, y: null };

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    class Particle {
        constructor() { this.reset(true); }
        reset(init) {
            this.x  = init ? Math.random() * W : (Math.random() < 0.5 ? 0 : W);
            this.y  = init ? Math.random() * H : Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.45;
            this.vy = (Math.random() - 0.5) * 0.45;
            this.r  = Math.random() * 1.4 + 0.4;
            this.a  = Math.random() * 0.35 + 0.08;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < -5 || this.x > W + 5 || this.y < -5 || this.y > H + 5) this.reset(false);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,229,255,${this.a})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 130; i++) particles.push(new Particle());

    function drawLines() {
        const DIST = 110, MD = 190;
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const d = Math.hypot(p.x - q.x, p.y - q.y);
                if (d < DIST) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(0,229,255,${0.07 * (1 - d / DIST)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
            if (mouse.x !== null) {
                const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                if (d < MD) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(0,229,255,${0.18 * (1 - d / MD)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        drawLines();
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    }
    loop();
})();
