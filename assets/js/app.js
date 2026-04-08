/**
 * GLOBAL INIT & COMPONENT LOADING
 */

async function loadComponent(id, file) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
        const res = await fetch(file);
        if (!res.ok) throw new Error(`Failed to load ${file}`);
        const html = await res.text();
        el.innerHTML = html;
        
        // Dispatch specific events
        if (id === 'navbar') document.dispatchEvent(new CustomEvent('headerLoaded'));
        if (id === 'footer') document.dispatchEvent(new CustomEvent('footerLoaded'));
    } catch (err) {
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('navbar', 'components/navbar.html');
    loadComponent('footer', 'components/footer.html');
});
