function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (hasHalfStar && i === fullStars + 1) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Função para renderizar produtos
function renderProducts(products) {
    const container = document.getElementById('productsContainer');

    if (!container) return;

    container.innerHTML = '';

    products.forEach(product => {
        const productHTML = `
            <article class="catalog-card" data-category="${product.category}">
                <div class="catalog-card-image">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                    <button class="wishlist-btn" aria-label="Adicionar aos favoritos">
                        <i class="far fa-heart"></i>
                    </button>
                    ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase().replace(' ', '-')}">${product.badge}</span>` : ''}
                </div>
                <div class="catalog-card-content">
                    <div class="product-meta">
                        <div class="product-rating">
                            <div class="stars">
                                ${generateStars(product.rating)}
                            </div>
                            <span class="review-count">(${product.reviews})</span>
                        </div>
                        <div class="product-info">
                            <h3 class="product-title">${product.title}</h3>
                            <p class="product-description">${product.shortDescription}</p>
                        </div>
                        <div class="product-price">
                            <span class="current-price">${product.price}</span>
                            ${product.oldPrice ? `<span class="original-price">${product.oldPrice}</span>` : ''}
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="btn-quick-view" data-product-id="${product.id}">
                            <i class="fas fa-eye"></i> Ver Detalhes
                        </button>
                        <button class="btn-add-cart">
                            <i class="fas fa-shopping-cart"></i> Comprar
                        </button>
                    </div>
                </div>
            </article>
        `;

        container.innerHTML += productHTML;
    });

    // Reatachar eventos dos botões "Visualizar"
    attachQuickViewEvents();
}

// Função para carregar produtos do JSON
async function loadProducts() {
    try {
        // Tenta carregar do arquivo JSON
        const response = await fetch('data/products.json');

        if (response.ok) {
            const products = await response.json();
            window.productsData = products; // Salva globalmente para os filtros
            renderProducts(products);
            setupFilters();
        } else {
            // Fallback: usar dados embutidos no catalogData.js
            if (typeof productsData !== 'undefined') {
                window.productsData = productsData;
                renderProducts(productsData);
                setupFilters();
            } else {
                console.error('Não foi possível carregar os produtos');
            }
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

// Configuração dos filtros
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const mobileFilterBtns = document.querySelectorAll('.mobile-filter-btn');

    // Filtros desktop
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove classe active de todos
            filterBtns.forEach(b => b.classList.remove('active'));
            // Adiciona ao clicado
            this.classList.add('active');

            const filter = this.dataset.filter;
            applyFilter(filter);
        });
    });

    // Filtros mobile
    mobileFilterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const filter = this.dataset.filter;
            applyFilter(filter);

            // Atualiza botões desktop também
            filterBtns.forEach(b => {
                b.classList.toggle('active', b.dataset.filter === filter);
            });
        });
    });
}

// Aplicar filtro
function applyFilter(filter) {
    if (filter === 'all') {
        renderProducts(window.productsData);
    } else {
        const filteredProducts = window.productsData.filter(product =>
            product.category === filter
        );
        renderProducts(filteredProducts);
    }
}

// Eventos para o modal (próxima etapa)
function attachQuickViewEvents() {
    document.querySelectorAll('.btn-quick-view').forEach(btn => {
        btn.addEventListener('click', function () {
            const productId = this.dataset.productId;
            const product = window.productsData.find(p => p.id == productId);

            if (product) {
                openProductModal(product);
            }
        });
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    loadProducts();

    // Seus filtros mobile continuam funcionando
    if (typeof setupMobileFilters === 'function') {
        setupMobileFilters();
    }
});