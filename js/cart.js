// Cart State
let cart = JSON.parse(localStorage.getItem('gt-cart')) || [];

// UI Elements
const getElements = () => ({
    drawer: document.getElementById('cart-drawer'),
    overlay: document.getElementById('cart-overlay'),
    countBadge: document.getElementById('cart-count'),
    itemsContainer: document.getElementById('cart-items'),
    subtotalEl: document.getElementById('cart-subtotal'),
    totalEl: document.getElementById('cart-total'),
    triggers: document.querySelectorAll('.cart-trigger'),
    closeBtn: document.getElementById('close-cart')
});

// Toggle Cart Drawer
function toggleCart(isOpen) {
    const { drawer, overlay } = getElements();
    if (!drawer || !overlay) return;

    if (isOpen) {
        drawer.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.add('opacity-100'), 10);
        document.body.style.overflow = 'hidden';
    } else {
        drawer.classList.add('translate-x-full');
        overlay.classList.remove('opacity-100');
        setTimeout(() => overlay.classList.add('hidden'), 500);
        document.body.style.overflow = '';
    }
}

// Render Cart Items
function renderCart() {
    const { itemsContainer, countBadge, subtotalEl, totalEl } = getElements();
    if (!itemsContainer) return;

    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="text-center py-20 text-white/40">
                <i class="bi bi-cart-x text-5xl mb-4 block"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        countBadge.innerText = '0';
        subtotalEl.innerText = '$0.00';
        totalEl.innerText = '$0.00';
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
                            <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" class="text-white/40 hover:text-white px-2 text-lg">-</button>
                            <span class="text-white text-xs font-bold px-2">${item.quantity}</span>
                            <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" class="text-white/40 hover:text-white px-2 text-lg">+</button>
                        </div>
                        <button onclick="removeItem('${item.id}')" class="text-white/20 hover:text-red-500 transition-colors">
                            <i class="bi bi-trash3 text-sm"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="h-[1px] bg-white/5 my-4"></div>
        `;
    }).join('');

    countBadge.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
    subtotalEl.innerText = `$${subtotal.toLocaleString()}`;
    totalEl.innerText = `$${subtotal.toLocaleString()}`;
}

// Actions
window.addToCart = function(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    toggleCart(true);
    showToast(`Added ${product.name} to cart`);
};

window.updateQuantity = function(id, qty) {
    if (qty < 1) {
        removeItem(id);
        return;
    }
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = qty;
        saveCart();
    }
};

window.removeItem = function(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
};

function saveCart() {
    localStorage.setItem('gt-cart', JSON.stringify(cart));
    renderCart();
}

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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const els = getElements();
    
    // Add Event Listeners for trigger (re-check after header load)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.cart-trigger')) toggleCart(true);
        if (e.target.closest('#close-cart')) toggleCart(false);
        if (e.target.closest('#cart-overlay')) toggleCart(false);
    });

    renderCart();
});
