/**
 * PRODUCT DATA & RENDERING
 */

const products = [
    { id: 'obsidian-strat', name: 'The Obsidian Strat', price: 3499, category: 'electric', image: 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?auto=format&fit=crop&q=80' },
    { id: 'solar-flare', name: 'Solar Flare Flame', price: 2999, category: 'electric', image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&q=80' },
    { id: 'vintage-amber', name: 'Vintage Amber LP', price: 3899, category: 'electric', image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?auto=format&fit=crop&q=80' },
    { id: 'celestial-acoustic', name: 'Celestial Acoustic', price: 5200, category: 'acoustic', image: 'https://images.unsplash.com/photo-1525201548942-d8b8967d0f5c?auto=format&fit=crop&q=80' },
    { id: 'neon-beat', name: 'Neon Beat Kit', price: 4200, category: 'drums', image: 'https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?auto=format&fit=crop&q=80' },
    { id: 'shadow-cello', name: 'Shadow Cello', price: 5800, category: 'orchestral', image: 'https://images.unsplash.com/photo-1612225215414-936934301b4d?auto=format&fit=crop&q=80' }
];

function initFiltering() {
    const tabs = document.querySelectorAll('.tab-btn');
    const productGrid = document.getElementById('product-grid') || document.getElementById('index-product-grid');
    if (!tabs.length || !productGrid) return;

    tabs.forEach(tab => {
        tab.onclick = () => {
            const category = tab.dataset.category;
            
            // UI
            tabs.forEach(t => t.classList.remove('bg-red-500', 'text-white'));
            tab.classList.add('bg-red-500', 'text-white');

            // Filter
            document.querySelectorAll('.product-card').forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        };
    });
}

document.addEventListener('DOMContentLoaded', initFiltering);
