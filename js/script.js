/**
 * NOTE: To see the Header and Footer (which use fetch), 
 * you MUST run this project on a local server (e.g., Live Server in VS Code, 
 * or "python -m http.server" in the terminal). 
 * Browsers block fetch requests from the "file://" protocol.
 */

async function loadComponent(id, file) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        
        if (id === 'header-placeholder') {
            el.outerHTML = `<header id="header-main">${html}</header>`;
            initHeaderScroll();
            // Dispatch event so other scripts know header is ready
            document.dispatchEvent(new CustomEvent('headerLoaded'));
        } else {
            el.innerHTML = html;
        }
    } catch (err) {
        console.error(`Failed to load ${file}:`, err);
        // Fallback for header if fetch fails (local file:// protocol)
        if (id === 'header-placeholder') {
            el.innerHTML = `<div style="padding: 2rem; background: #000; text-align: center; border: 1px dashed #444;">
                <p>⚠️ Run on a Local Server to see the Header & Footer.</p>
                <nav><a href="index.html" style="color:red">Home</a> | <a href="shop.html" style="color:red">Shop</a></nav>
            </div>`;
        }
    }
}

// Header Scroll Logic
function initHeaderScroll() {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });
}

// Swiper Carousels
function initSwipers() {
    // The Vault (Shop)
    try {
        if (document.querySelector('.shop-carousel')) {
            new Swiper('.shop-carousel', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: { delay: 4000, disableOnInteraction: false },
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                breakpoints: {
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }
            });
        }
    } catch (e) { console.error("Shop Carousel Error:", e); }

    // Global Partners (Brands)
    try {
        if (document.querySelector('.brands-carousel')) {
            new Swiper('.brands-carousel', {
                slidesPerView: 2,
                spaceBetween: 20,
                loop: true,
                autoplay: { delay: 2500, disableOnInteraction: false },
                breakpoints: {
                    640: { slidesPerView: 3 },
                    1024: { slidesPerView: 5 },
                }
            });
        }
    } catch (e) { console.error("Brands Carousel Error:", e); }
}

// Number Counter Logic
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const startCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const count = +el.innerText;
        const inc = target / speed;

        if (count < target) {
            el.innerText = Math.ceil(count + inc);
            setTimeout(() => startCounter(el), 1);
        } else {
            el.innerText = target.toLocaleString() + (target === 15 ? '+' : '+');
        }
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 1 });

    counters.forEach(counter => counterObserver.observe(counter));
}

// Reveal Animations
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.glass-card, .section-title, .hero h1, .product-card').forEach(el => {
        observer.observe(el);
    });
}

// Magnetic Buttons
function initMagnetic() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0, 0)`;
        });
    });
}

// DOM Load
document.addEventListener('DOMContentLoaded', async () => {
    await loadComponent('header-placeholder', 'header.html');
    await loadComponent('footer-placeholder', 'footer.html');
    
    initSwipers();
    initCounters();
    initReveal();
    initMagnetic();
});
