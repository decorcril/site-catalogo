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
                    ${product.priceVariations.map(variation => {
                        // Determinar valor padrão
                        const defaultValue = variation.default || variation.options[0].value;
                        
                        return `
                            <div class="variation-group" data-key="${variation.key}">
                                <label class="variation-label">${variation.name}:</label>
                                <select class="variation-select" data-variation-key="${variation.key}">
                                    ${variation.options.map(option => {
                                        // Converter kitPieces para string JSON se existir
                                        const kitPiecesStr = option.kitPieces ? JSON.stringify(option.kitPieces) : '';
                                        
                                        return `
                                            <option value="${option.value}" 
                                                    data-price="${option.price || ''}"
                                                    data-image="${option.image || ''}"
                                                    data-thickness="${option.thickness || ''}"
                                                    data-height="${option.height || ''}"
                                                    data-width="${option.width || ''}"
                                                    data-depth="${option.depth || ''}"
                                                    data-length="${option.length || ''}"
                                                    data-capacity="${option.capacity || ''}"
                                                    data-kitpieces="${kitPiecesStr}"
                                                    ${option.value === defaultValue ? 'selected' : ''}>
                                                ${option.label}
                                            </option>
                                        `;
                                    }).join('')}
                                </select>
                            </div>
                        `;
                    }).join('')}
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
                    ${product.priceVariations.map(variation => {
                        // Determinar valor padrão
                        const defaultValue = variation.default || variation.options[0].value;
                        
                        return `
                            <div class="variation-group" data-key="${variation.key}">
                                <label class="variation-label">${variation.name}:</label>
                                <select class="variation-select" data-variation-key="${variation.key}">
                                    ${variation.options.map(option => {
                                        // Converter kitPieces para string JSON se existir
                                        const kitPiecesStr = option.kitPieces ? JSON.stringify(option.kitPieces) : '';
                                        
                                        return `
                                            <option value="${option.value}" 
                                                    data-price="${option.price || ''}"
                                                    data-image="${option.image || ''}"
                                                    data-thickness="${option.thickness || ''}"
                                                    data-height="${option.height || ''}"
                                                    data-width="${option.width || ''}"
                                                    data-depth="${option.depth || ''}"
                                                    data-length="${option.length || ''}"
                                                    data-capacity="${option.capacity || ''}"
                                                    data-kitpieces="${kitPiecesStr}"
                                                    ${option.value === defaultValue ? 'selected' : ''}>
                                                ${option.label}
                                            </option>
                                        `;
                                    }).join('')}
                                </select>
                            </div>
                        `;
                    }).join('')}
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

// FUNÇÃO PARA ABRIR O MODAL DE PRODUTO
function openProductModal(product) {
    // Verificar se há seleções salvas para este produto
    const savedSelections = window.modalSelections?.[product.id] || {};
    
    // DEBUG: Verificar o que está sendo salvo
    console.log('Produto:', product.id, 'Seleções salvas:', savedSelections);
    
    // VALORES PADRÃO DO PRODUTO
    let currentPrice = product.price;
    let currentImage = product.image;
    let currentThickness = product.thickness;
    let currentHeight = product.height;
    let currentWidth = product.width;
    let currentDepth = product.depth;
    let currentLength = product.length;
    let currentCapacity = product.capacity;
    let currentKitPieces = product.kitPieces || [];
    
    // VERIFICAR SE HÁ VARIAÇÕES E SE HÁ SELEÇÕES SALVAS
    let foundVariationData = false;
    
    if (product.priceVariations && Object.keys(savedSelections).length > 0) {
        // Para CADA variação no produto
        product.priceVariations.forEach(variation => {
            const savedSelection = savedSelections[variation.key];
            if (savedSelection) {
                // Encontrar a opção que foi selecionada
                const selectedOption = variation.options.find(opt => opt.value === savedSelection.value);
                
                if (selectedOption) {
                    foundVariationData = true;
                    
                    // DEBUG: Verificar opção encontrada
                    console.log('Opção selecionada encontrada:', selectedOption);
                    
                    // ATUALIZAR TODOS OS VALORES COM BASE NA OPÇÃO SELECIONADA
                    if (selectedOption.price) currentPrice = selectedOption.price;
                    if (selectedOption.image) currentImage = selectedOption.image;
                    
                    // ATUALIZAR AS ESPECIFICAÇÕES TÉCNICAS
                    if (selectedOption.thickness !== undefined) currentThickness = selectedOption.thickness;
                    if (selectedOption.height !== undefined) currentHeight = selectedOption.height;
                    if (selectedOption.width !== undefined) currentWidth = selectedOption.width;
                    if (selectedOption.depth !== undefined) currentDepth = selectedOption.depth;
                    if (selectedOption.length !== undefined) currentLength = selectedOption.length;
                    if (selectedOption.capacity !== undefined) currentCapacity = selectedOption.capacity;
                    
                    // ATUALIZAR AS PEÇAS DO KIT (se existirem na variação)
                    if (selectedOption.kitPieces) {
                        currentKitPieces = selectedOption.kitPieces;
                    }
                }
            }
        });
    }
    
    // Se NÃO encontrou dados de variação, usar os dados padrão do produto
    if (!foundVariationData && product.kitPieces) {
        currentKitPieces = product.kitPieces;
    }
    
    // DEBUG: Verificar valores finais
    console.log('Valores finais para o modal:');
    console.log('- Preço:', currentPrice);
    console.log('- Imagem:', currentImage);
    console.log('- Espessura:', currentThickness);
    console.log('- Altura:', currentHeight);
    console.log('- Largura:', currentWidth);
    console.log('- KitPieces:', currentKitPieces);
    
    // Gerar especificações principais COM OS VALORES ATUALIZADOS
    let mainSpecsHTML = '';
    const hasMainSpecs = currentHeight || currentWidth || currentDepth || 
                        currentCapacity || currentThickness || product.voltage;
    
    if (hasMainSpecs) {
        mainSpecsHTML = `
            <table class="specs-table">
                ${currentHeight ? `<tr><td>Altura:</td><td><strong>${currentHeight} cm</strong></td></tr>` : ''}
                ${currentWidth ? `<tr><td>Largura:</td><td><strong>${currentWidth} cm</strong></td></tr>` : ''}
                ${currentDepth && currentDepth > 0 ? `<tr><td>Profundidade:</td><td><strong>${currentDepth} cm</strong></td></tr>` : ''}
                ${currentLength ? `<tr><td>Comprimento:</td><td><strong>${currentLength} cm</strong></td></tr>` : ''}
                ${currentThickness ? `<tr><td>Espessura:</td><td><strong>${currentThickness} mm</strong></td></tr>` : ''}
                ${currentCapacity && currentCapacity > 0 ? `<tr><td>Capacidade:</td><td><strong>${currentCapacity} unidades</strong></td></tr>` : ''}
                ${product.voltage ? `<tr><td>Voltagem:</td><td><strong>${product.voltage}</strong></td></tr>` : ''}
            </table>
        `;
    }
    
    // Gerar peças do kit COM AS PEÇAS ATUALIZADAS
    let kitPiecesHTML = '';
    if (currentKitPieces && currentKitPieces.length > 0) {
        kitPiecesHTML = `
            <div class="kit-pieces">
                <h5>Peças do Kit (${currentKitPieces.length})</h5>
                ${currentKitPieces.map(piece => `
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
    
    // BADGE DE URGÊNCIA DISCRETA - "Últimas Peças"
    const showUrgencyBadge = product.stock && product.stock <= 5;
    const urgencyBadgeHTML = showUrgencyBadge ? `
        <div class="urgency-badge-container">
            <span class="urgency-badge">ÚLTIMAS PEÇAS</span>
        </div>
    ` : '';
    
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
                                <img src="${currentImage}" alt="${product.title}">
                            </div>
                        </div>
                        
                        <!-- COLUNA DAS INFORMAÇÕES -->
                        <div class="modal-info-column">
                            <!-- PREÇOS -->
                            <div class="price-section">
                                <span class="current-price">${currentPrice}</span>
                                ${product.oldPrice ? `<span class="original-price">${product.oldPrice}</span>` : ''}
                                ${urgencyBadgeHTML}
                            </div>
                            
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
    
    // Configurar eventos do modal (fechar)
    const modal = document.getElementById('productModal');
    const closeBtn = modal.querySelector('.close-modal');
    
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal) modal.remove();
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