/**
 * CART SYSTEM (Global)
 */

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    window.dispatchEvent(new CustomEvent('cartUpdated'));
}

function addToCart(product) {
    let cart = getCart();
    const existing = cart.find(p => p.id === product.id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    setCart(cart);
    if (window.showToast) showToast(`${product.name} added to cart`);
}

function updateQuantity(id, qty) {
    let cart = getCart();
    if (qty < 1) return removeItem(id);
    const item = cart.find(p => p.id === id);
    if (item) {
        item.quantity = qty;
        setCart(cart);
    }
}

function removeItem(id) {
    let cart = getCart();
    cart = cart.filter(p => p.id !== id);
    setCart(cart);
}

function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, i) => sum + i.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.innerText = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    }
}

// Global Initialization
document.addEventListener('DOMContentLoaded', updateCartCount);
document.addEventListener('headerLoaded', updateCartCount);
window.addEventListener('storage', updateCartCount);
