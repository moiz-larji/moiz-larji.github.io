const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

function updateScrollProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    const percent = Math.min(100, Math.max(0, Math.round(ratio * 100)));

    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${percent}%`;
}

function typeText(element, speed = 18) {
    if (element.dataset.typed === 'true') return;

    const fullText = element.textContent.trim().replace(/\s+/g, ' ');
    element.dataset.typed = 'true';

    const cursor = document.createElement('span');
    cursor.className = 'type-cursor';

    let index = 0;
    const paint = () => {
        const current = fullText.slice(0, index);
        element.textContent = current;
        element.appendChild(cursor);

        if (index < fullText.length) {
            index += 1;
            setTimeout(paint, speed);
            return;
        }

        cursor.remove();
    };

    paint();
}

function setupStoryAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const blocks = document.querySelectorAll('.block');

    if (prefersReducedMotion) {
        blocks.forEach((block) => {
            block.classList.add('in-view');
            block.querySelectorAll('[data-type]').forEach((el) => {
                el.dataset.typed = 'true';
            });
        });
        return;
    }

    document.body.classList.add('js-anim');

    blocks.forEach((block) => {
        const staged = block.querySelectorAll(
            ':scope > .entry, :scope > .skill-grid > article, :scope > ul > li, :scope > .certs, :scope > .quick-links a'
        );

        staged.forEach((item, index) => {
            item.classList.add('stage-item');
            item.style.setProperty('--delay', `${index * 90}ms`);
        });
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const block = entry.target;
                block.classList.add('in-view');

                block.querySelectorAll('[data-type]').forEach((el, idx) => {
                    const speed = el.tagName === 'H1' ? 22 : 16;
                    setTimeout(() => typeText(el, speed), idx * 120);
                });

                observer.unobserve(block);
            });
        },
        { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    blocks.forEach((block) => observer.observe(block));
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
window.addEventListener('DOMContentLoaded', () => {
    updateScrollProgress();
    setupStoryAnimations();
});
