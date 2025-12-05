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
        // Verificar se tem variações de preço
        const hasVariations = product.priceVariations && product.priceVariations.length > 0;
        
        // Gerar HTML para variações se existirem
        let variationsHTML = '';
        if (hasVariations) {
            variationsHTML = `
                <div class="product-variations">
                    ${product.priceVariations.map(variation => `
                        <div class="variation-group" data-key="${variation.key}">
                            <label class="variation-label">${variation.name}:</label>
                            <select class="variation-select" data-variation-key="${variation.key}">
                                ${variation.options.map(option => `
                                    <option value="${option.value}" 
                                            data-price="${option.price}"
                                            data-image="${option.image || ''}">
                                        ${option.label}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        const productHTML = `
            <article class="catalog-card" data-category="${product.category}">
                <div class="catalog-card-image">
                    <img src="${product.image}" 
                         alt="${product.title}" 
                         loading="lazy"
                         class="product-main-image"
                         data-base-image="${product.image}">
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
                            <span class="current-price" data-base-price="${product.price}">${product.price}</span>
                            ${product.oldPrice ? `<span class="original-price">${product.oldPrice}</span>` : ''}
                        </div>
                        ${variationsHTML}
                    </div>
                    <div class="product-actions">
                        <button class="btn-quick-view" data-product-id="${product.id}">
                            <i class="fas fa-eye"></i> Ver Detalhes
                        </button>
                        <button class="btn-add-cart" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Comprar
                        </button>
                    </div>
                </div>
            </article>
        `;

        container.innerHTML += productHTML;
    });

    // Configurar eventos das variações
    setupVariationEvents();
    // Reatachar eventos dos botões "Visualizar"
    attachQuickViewEvents();
}

// Função para configurar eventos das variações de preço E IMAGEM
function setupVariationEvents() {
    // Para cada select de variação
    document.querySelectorAll('.variation-select').forEach(select => {
        select.addEventListener('change', function() {
            const productCard = this.closest('.catalog-card');
            const currentPriceElement = productCard.querySelector('.current-price');
            const productImage = productCard.querySelector('.product-main-image');
            const basePrice = currentPriceElement.dataset.basePrice;
            const baseImage = productImage.dataset.baseImage;
            
            // Coletar todas as seleções deste produto
            const variations = productCard.querySelectorAll('.variation-select');
            let finalPrice = basePrice;
            let finalImage = baseImage;
            const selectedOptions = {};
            
            // Encontrar o preço e imagem da opção selecionada
            variations.forEach(variation => {
                const selectedOption = variation.options[variation.selectedIndex];
                const selectedPrice = selectedOption.dataset.price;
                const selectedImage = selectedOption.dataset.image;
                const key = variation.dataset.variationKey;
                const value = variation.value;
                
                // Salvar seleção
                selectedOptions[key] = {
                    value: value,
                    price: selectedPrice,
                    image: selectedImage
                };
                
                if (selectedPrice) {
                    finalPrice = selectedPrice;
                }
                if (selectedImage) {
                    finalImage = selectedImage;
                }
            });
            
            // Atualizar o preço exibido
            currentPriceElement.textContent = finalPrice;
            
            // Atualizar a imagem exibida
            productImage.src = finalImage;
            
            // Salvar as seleções para usar no modal
            const productId = productCard.querySelector('.btn-quick-view')?.dataset.productId;
            if (productId) {
                if (!window.modalSelections) {
                    window.modalSelections = {};
                }
                window.modalSelections[productId] = selectedOptions;
                
                // ATUALIZAR O MODAL SE ESTIVER ABERTO PARA ESTE PRODUTO
                const modal = document.getElementById('productModal');
                if (modal) {
                    const modalProductId = modal.querySelector('.btn-quick-view')?.dataset.productId;
                    if (modalProductId === productId) {
                        // Atualizar o preço no modal
                        const dynamicPrice = modal.querySelector('#dynamicPrice');
                        if (dynamicPrice) dynamicPrice.textContent = finalPrice;
                        
                        // Atualizar a imagem no modal
                        const modalImage = modal.querySelector('.modal-image img');
                        if (modalImage) modalImage.src = finalImage;
                    }
                }
            }
        });
    });
    
    // Configurar eventos dos botões de compra
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const productCard = this.closest('.catalog-card');
            const currentPrice = productCard.querySelector('.current-price').textContent;
            
            // Coletar opções selecionadas
            const selectedOptions = {};
            const variations = productCard.querySelectorAll('.variation-select');
            
            variations.forEach(variation => {
                const key = variation.dataset.variationKey;
                const value = variation.value;
                const selectedOption = variation.options[variation.selectedIndex];
                const price = selectedOption.dataset.price;
                const image = selectedOption.dataset.image;
                
                selectedOptions[key] = {
                    value: value,
                    price: price,
                    image: image
                };
            });
            
            // Aqui você pode adicionar ao carrinho
            addToCart(productId, currentPrice, selectedOptions);
        });
    });
}

// Função para atualizar o card com base nas seleções do modal
function updateCardFromModalSelections(productId) {
    const productCard = document.querySelector(`.btn-quick-view[data-product-id="${productId}"]`)?.closest('.catalog-card');
    
    if (!productCard || !window.modalSelections?.[productId]) return;
    
    const selectedOptions = window.modalSelections[productId];
    const currentPriceElement = productCard.querySelector('.current-price');
    const productImage = productCard.querySelector('.product-main-image');
    const basePrice = currentPriceElement.dataset.basePrice;
    const baseImage = productImage.dataset.baseImage;
    
    let finalPrice = basePrice;
    let finalImage = baseImage;
    
    // Atualizar cada select no card
    productCard.querySelectorAll('.variation-select').forEach(select => {
        const variationKey = select.dataset.variationKey;
        if (selectedOptions[variationKey]) {
            // Definir o valor selecionado
            select.value = selectedOptions[variationKey].value;
            
            // Verificar se há preço ou imagem específicos
            if (selectedOptions[variationKey].price) {
                finalPrice = selectedOptions[variationKey].price;
            }
            if (selectedOptions[variationKey].image) {
                finalImage = selectedOptions[variationKey].image;
            }
        }
    });
    
    // Atualizar preço e imagem no card
    currentPriceElement.textContent = finalPrice;
    productImage.src = finalImage;
}

// FUNÇÃO PARA ABRIR O MODAL DE PRODUTO
function openProductModal(product) {
    // Verificar se há seleções salvas para este produto
    const savedSelections = window.modalSelections?.[product.id] || {};
    
    // Gerar especificações principais - AGORA COM VOLTAGEM
    let mainSpecsHTML = '';
    const hasMainSpecs = product.height || product.width || product.depth || 
                        product.capacity || product.thickness || product.voltage;
    
    if (hasMainSpecs) {
        mainSpecsHTML = `
            <table class="specs-table">
                ${product.height ? `<tr><td>Altura:</td><td><strong>${product.height} cm</strong></td></tr>` : ''}
                ${product.width ? `<tr><td>Largura:</td><td><strong>${product.width} cm</strong></td></tr>` : ''}
                ${product.depth && product.depth > 0 ? `<tr><td>Profundidade:</td><td><strong>${product.depth} cm</strong></td></tr>` : ''}
                ${product.length ? `<tr><td>Comprimento:</td><td><strong>${product.length} cm</strong></td></tr>` : ''}
                ${product.thickness ? `<tr><td>Espessura:</td><td><strong>${product.thickness} mm</strong></td></tr>` : ''}
                ${product.capacity && product.capacity > 0 ? `<tr><td>Capacidade:</td><td><strong>${product.capacity} unidades</strong></td></tr>` : ''}
                ${product.voltage ? `<tr><td>Voltagem:</td><td><strong>${product.voltage}</strong></td></tr>` : ''}
            </table>
        `;
    }
    
    // Gerar peças do kit - AGORA COM VOLTAGEM NAS PEÇAS
    let kitPiecesHTML = '';
    if (product.kitPieces && product.kitPieces.length > 0) {
        kitPiecesHTML = `
            <div class="kit-pieces">
                <h5>Peças do Kit (${product.kitPieces.length})</h5>
                ${product.kitPieces.map(piece => `
                    <div class="kit-piece">
                        <div class="kit-piece-name">${piece.name}</div>
                        <div class="kit-piece-specs">
                            ${piece.height ? `<span>Altura: <strong>${piece.height} cm</strong></span>` : ''}
                            ${piece.width ? `<span>Largura: <strong>${piece.width} cm</strong></span>` : ''}
                            ${piece.depth && piece.depth > 0 ? `<span>Profundidade: <strong>${piece.depth} cm</strong></span>` : ''}
                            ${piece.capacity && piece.capacity > 0 ? `<span>Capacidade: <strong>${piece.capacity} un</strong></span>` : ''}
                            ${piece.thickness ? `<span>Espessura: <strong>${piece.thickness} mm</strong></span>` : ''}
                            ${piece.footHeight ? `<span>Pés: <strong>${piece.footHeight} cm</strong></span>` : ''}
                            ${piece.voltage ? `<span>Voltagem: <strong>${piece.voltage}</strong></span>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Pegar o preço e imagem selecionados nos cards ou usar os valores base
    let currentPrice = product.price;
    let currentImage = product.image;
    
    // Se houver seleções salvas, calcular o preço e imagem baseado nelas
    if (product.priceVariations && Object.keys(savedSelections).length > 0) {
        // Percorrer as variações para encontrar o preço e imagem corretos
        product.priceVariations.forEach(variation => {
            const savedSelection = savedSelections[variation.key];
            if (savedSelection) {
                // Encontrar a opção correspondente
                const selectedOption = variation.options.find(opt => opt.value === savedSelection.value);
                if (selectedOption) {
                    if (selectedOption.price) {
                        currentPrice = selectedOption.price;
                    }
                    if (selectedOption.image) {
                        currentImage = selectedOption.image;
                    }
                }
            }
        });
    }
    
    // BADGE DE URGÊNCIA DISCRETA - "Últimas Peças"
    const showUrgencyBadge = product.stock && product.stock <= 5;
    const urgencyBadgeHTML = showUrgencyBadge ? `
        <div class="urgency-badge-container">
            <span class="urgency-badge">ÚLTIMAS PEÇAS</span>
        </div>
    ` : '';
    
    // Gerar HTML para variações no modal
    let modalVariationsHTML = '';
    if (product.priceVariations && product.priceVariations.length > 0) {
        modalVariationsHTML = `
            <div class="modal-variations">
                ${product.priceVariations.map(variation => `
                    <div class="variation-group" data-key="${variation.key}">
                        <label class="variation-label">${variation.name}:</label>
                        <select class="modal-variation-select" data-variation-key="${variation.key}" data-product-id="${product.id}">
                            ${variation.options.map(option => {
                                // Verificar se esta opção está salva como selecionada
                                const isSelected = savedSelections[variation.key]?.value === option.value;
                                return `
                                    <option value="${option.value}" 
                                            data-price="${option.price}"
                                            data-image="${option.image || ''}"
                                            ${isSelected ? 'selected' : ''}>
                                        ${option.label}
                                    </option>
                                `;
                            }).join('')}
                        </select>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Montar modal COM LAYOUT DE DUAS COLUNAS
    const modalHTML = `
        <div class="product-modal-overlay" id="productModal">
            <div class="product-modal">
                <div class="modal-header">
                    <h3>${product.title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="modal-image-info">
                        <!-- COLUNA DA IMAGEM -->
                        <div class="modal-image-column">
                            <div class="modal-image">
                                <img src="${currentImage}" alt="${product.title}" id="modalMainImage">
                            </div>
                        </div>
                        
                        <!-- COLUNA DAS INFORMAÇÕES -->
                        <div class="modal-info-column">
                            <!-- PREÇOS -->
                            <div class="price-section">
                                <span class="current-price" id="dynamicPrice">${currentPrice}</span>
                                ${product.oldPrice ? `<span class="original-price">${product.oldPrice}</span>` : ''}
                                ${urgencyBadgeHTML}
                            </div>
                            
                            <!-- VARIAÇÕES NO MODAL -->
                            ${modalVariationsHTML}
                            
                            <!-- DESCRIÇÃO COMPLETA -->
                            ${product.longDescription ? `
                                <div class="description-section">
                                    <h4>Descrição</h4>
                                    <div class="long-description">
                                        ${product.longDescription}
                                    </div>
                                </div>
                            ` : ''}
                            
                            <!-- ESPECIFICAÇÕES -->
                            ${(mainSpecsHTML || kitPiecesHTML) ? `
                                <div class="specs-section">
                                    <h4>Especificações</h4>
                                    ${mainSpecsHTML}
                                    ${kitPiecesHTML}
                                    ${product.productCode ? `
                                        <div class="product-code">
                                            <strong>Código:</strong> ${product.productCode}
                                        </div>
                                    ` : ''}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar ao DOM
    const existingModal = document.getElementById('productModal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // ⭐ DEFINIR A VARIÁVEL MODAL AQUI
    const modal = document.getElementById('productModal');
    
    // Configurar eventos das variações no modal
    modal.querySelectorAll('.modal-variation-select').forEach(select => {
        select.addEventListener('change', function() {
            const productId = this.dataset.productId;
            const variationKey = this.dataset.variationKey;
            const selectedOption = this.options[this.selectedIndex];
            const selectedPrice = selectedOption.dataset.price;
            const selectedImage = selectedOption.dataset.image;
            
            // Salvar a seleção
            if (!window.modalSelections) {
                window.modalSelections = {};
            }
            if (!window.modalSelections[productId]) {
                window.modalSelections[productId] = {};
            }
            
            window.modalSelections[productId][variationKey] = {
                value: this.value,
                price: selectedPrice,
                image: selectedImage
            };
            
            // Atualizar preço e imagem no modal
            if (selectedPrice) {
                const dynamicPrice = modal.querySelector('#dynamicPrice');
                if (dynamicPrice) dynamicPrice.textContent = selectedPrice;
            }
            
            if (selectedImage) {
                const modalImage = modal.querySelector('#modalMainImage');
                if (modalImage) modalImage.src = selectedImage;
            }
        });
    });
    
    // Configurar eventos do modal (fechar) E ATUALIZAR CARD AO FECHAR
    const closeBtn = modal.querySelector('.close-modal');
    
    closeBtn.addEventListener('click', () => {
        // Atualizar o card antes de remover o modal
        updateCardFromModalSelections(product.id);
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            updateCardFromModalSelections(product.id);
            modal.remove();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal) {
            updateCardFromModalSelections(product.id);
            modal.remove();
        }
    });
}

// Função para adicionar ao carrinho (placeholder)
function addToCart(productId, price, options) {
    console.log('Adicionando ao carrinho:', {
        productId: productId,
        price: price,
        options: options
    });
    
    // Aqui você implementaria a lógica real do carrinho
    alert(`Produto ${productId} adicionado ao carrinho!\nPreço: ${price}\nOpções: ${JSON.stringify(options)}`);
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

// Eventos para o modal
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