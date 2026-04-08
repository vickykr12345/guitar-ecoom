/**
 * GLOBAL CART HELPER FUNCTIONS
 */
function getCart() {
    return JSON.parse(localStorage.getItem('gt-cart')) || [];
}

function setCart(cart) {
    localStorage.setItem('gt-cart', JSON.stringify(cart));
}

// Update only the navbar badge count
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.innerText = totalItems;
        // Optional: Hide badge if count is 0
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

/**
 * CART UI LOGIC
 */
const getCartElements = () => ({
    drawer: document.getElementById('cart-drawer'),
    overlay: document.getElementById('cart-overlay'),
    itemsContainer: document.getElementById('cart-items'),
    subtotalEl: document.getElementById('cart-subtotal'),
    totalEl: document.getElementById('cart-total'),
    closeBtn: document.getElementById('close-cart')
});

function toggleCart(isOpen) {
    const { drawer, overlay } = getCartElements();
    if (!drawer || !overlay) return;

    if (isOpen) {
        drawer.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.add('opacity-100'), 10);
        document.body.style.overflow = 'hidden';
        renderCart(); // Refresh drawer content when opening
    } else {
        drawer.classList.add('translate-x-full');
        overlay.classList.remove('opacity-100');
        setTimeout(() => overlay.classList.add('hidden'), 500);
        document.body.style.overflow = '';
    }
}

function renderCart() {
    const { itemsContainer, subtotalEl, totalEl } = getCartElements();
    const cart = getCart();
    
    if (!itemsContainer) return;

    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="text-center py-20 text-white/40">
                <i class="bi bi-cart-x text-5xl mb-4 block"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        subtotalEl.innerText = '$0.00';
        totalEl.innerText = '$0.00';
        updateCartCount();
        return;
    }

    let subtotal = 0;
    itemsContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <div class="flex gap-4 group">
                <div class="w-20 h-20 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="text-white font-bold text-sm truncate">${item.name}</h4>
                    <p class="text-red-400 font-semibold text-xs mt-1">$${item.price.toLocaleString()}</p>
                    <div class="flex items-center justify-between mt-3">
                        <div class="flex items-center bg-white/5 rounded-full border border-white/10 px-2 py-1">
                            <button onclick="updateItemQuantity('${item.id}', ${item.quantity - 1})" class="text-white/40 hover:text-white px-2 text-lg">-</button>
                            <span class="text-white text-xs font-bold px-2">${item.quantity}</span>
                            <button onclick="updateItemQuantity('${item.id}', ${item.quantity + 1})" class="text-white/40 hover:text-white px-2 text-lg">+</button>
                        </div>
                        <button onclick="removeCartItem('${item.id}')" class="text-white/20 hover:text-red-500 transition-colors">
                            <i class="bi bi-trash3 text-sm"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="h-[1px] bg-white/5 my-4"></div>
        `;
    }).join('');

    subtotalEl.innerText = `$${subtotal.toLocaleString()}`;
    totalEl.innerText = `$${subtotal.toLocaleString()}`;
    updateCartCount();
}

/**
 * EXPOSED ACTIONS
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
    updateCartCount();
    toggleCart(true);
    showToast(`Added ${product.name} to cart`);
};

window.updateItemQuantity = function(id, qty) {
    let cart = getCart();
    if (qty < 1) {
        removeCartItem(id);
        return;
    }
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = qty;
        setCart(cart);
        renderCart();
    }
};

window.removeCartItem = function(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    setCart(cart);
    renderCart();
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
 * INITIALIZATION & SYNC
 */
const initCart = () => {
    updateCartCount();
    // Also render drawer if it's already open for some reason
    if (document.getElementById('cart-drawer') && !document.getElementById('cart-drawer').classList.contains('translate-x-full')) {
        renderCart();
    }
};

// Run on page load
document.addEventListener('DOMContentLoaded', initCart);

// Run when header is dynamically loaded
document.addEventListener('headerLoaded', updateCartCount);

// Sync across tabs
window.addEventListener('storage', (e) => {
    if (e.key === 'gt-cart') {
        updateCartCount();
        renderCart();
    }
});

// Global click handlers for cart UI
document.addEventListener('click', (e) => {
    if (e.target.closest('.cart-trigger')) toggleCart(true);
    if (e.target.closest('#close-cart')) toggleCart(false);
    if (e.target.closest('#cart-overlay')) toggleCart(false);
});
