/**
 * UI & NOTIFICATIONS
 */

function showToast(msg) {
    const toast = document.createElement('div');
    toast.innerText = msg;
    toast.className = "fixed bottom-5 right-5 bg-red-500 text-white px-6 py-3 rounded-full shadow-2xl z-[100] animate-fade-in-up font-bold text-xs uppercase tracking-widest";
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

function initNavbarToggles() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const userBtn = document.getElementById('userBtn');
    const userMenu = document.getElementById('userMenu');

    if (searchBtn && searchInput) {
        searchBtn.onclick = (e) => {
            e.stopPropagation();
            searchInput.classList.toggle('w-64');
            searchInput.classList.toggle('px-4');
            searchInput.classList.toggle('opacity-100');
            if (searchInput.classList.contains('w-64')) searchInput.focus();
        };
    }

    if (userBtn && userMenu) {
        userBtn.onclick = (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('hidden');
        };
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (userMenu && !userMenu.contains(e.target) && !userBtn?.contains(e.target)) {
            userMenu.classList.add('hidden');
        }
        if (searchInput && !searchInput.contains(e.target) && !searchBtn?.contains(e.target)) {
            if (searchInput.value === '') {
                searchInput.classList.remove('w-64', 'px-4', 'opacity-100');
            }
        }
    });
}

// Auth State Check
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

document.addEventListener('headerLoaded', () => {
    initNavbarToggles();
    checkUser();
});
