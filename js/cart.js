/**
 * GLOBAL STATE HELPERS
 */
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.innerText = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    }
}

/**
 * AUTH SYSTEM
 */
function checkUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authLinks = document.getElementById('authLinks');
    const userLinks = document.getElementById('userLinks');
    const userName = document.getElementById('userName');

    if (user && authLinks && userLinks && userName) {
        authLinks.classList.add('hidden');
        userLinks.classList.remove('hidden');
        userName.innerText = user.name;
        userName.classList.remove('hidden');
    }
}

window.logout = function() {
    localStorage.removeItem('user');
    location.reload();
};

/**
 * UI CONTROLS (NAVBAR)
 */
function initNavbar() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const userBtn = document.getElementById('userBtn');
    const userMenu = document.getElementById('userMenu');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            searchInput.classList.toggle('w-64');
            searchInput.classList.toggle('px-4');
            searchInput.classList.toggle('opacity-100');
            if (searchInput.classList.contains('w-64')) {
                searchInput.focus();
            }
        });

        searchInput.addEventListener('input', () => {
            const value = searchInput.value.toLowerCase();
            document.querySelectorAll('.product-card').forEach(card => {
                const name = (card.dataset.name || card.querySelector('h3')?.innerText || '').toLowerCase();
                if (name.includes(value)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }

    if (userBtn && userMenu) {
        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('hidden');
        });
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (userMenu && !userMenu.contains(e.target) && !userBtn.contains(e.target)) {
            userMenu.classList.add('hidden');
        }
        if (searchInput && !searchInput.contains(e.target) && !searchBtn.contains(e.target)) {
            if (searchInput.value === '') {
                searchInput.classList.remove('w-64', 'px-4', 'opacity-100');
            }
        }
    });
}

/**
 * ACTIONS
 */
window.addToCart = function(product) {
    let cart = getCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    setCart(cart);
    showToast(`Added ${product.name} to cart`);
};

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 left-8 bg-red-500 text-white px-6 py-3 rounded-full shadow-2xl z-[200] animate-fade-in-up flex items-center gap-3 font-bold text-sm uppercase tracking-widest';
    toast.innerHTML = `<i class="bi bi-check2-circle text-lg"></i> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

/**
 * INITIALIZATION
 */
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    checkUser();
    // Re-run after header load
    document.addEventListener('headerLoaded', () => {
        updateCartCount();
        checkUser();
        initNavbar();
    });
});
