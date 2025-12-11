// Função para renderizar produtos COM oldPrice dinâmico
function renderProducts(products) {
    const container = document.getElementById('productsContainer');

    if (!container) return;

    container.innerHTML = '';

    products.forEach(product => {
        // Verificar se tem variações de preço
        const hasVariations = product.priceVariations && product.priceVariations.length > 0;
        
        // Buscar oldPrice inicial (da primeira variação se existir)
        let initialOldPrice = product.oldPrice;
        if (!initialOldPrice && hasVariations) {
            const firstOption = product.priceVariations[0].options[0];
            if (firstOption && firstOption.oldPrice) {
                initialOldPrice = firstOption.oldPrice;
            }
        }
        
        // Texto fixo de parcela
        const installmentText = '6x sem juros';
        
        // Gerar HTML para variações com BOTÕES PILLS em vez de select
        let variationsHTML = '';
        if (hasVariations) {
            variationsHTML = `
                <div class="product-variations">
                    ${product.priceVariations.map(variation => `
                        <div class="variation-group" data-key="${variation.key}">
                            <label class="variation-label">${variation.name}:</label>
                            <div class="variation-badges">
                                ${variation.options.map((option, index) => `
                                    <button 
                                        class="variation-badge ${index === 0 ? 'active' : ''}" 
                                        data-variation-key="${variation.key}"
                                        data-value="${option.value}"
                                        data-price="${option.price}"
                                        data-old-price="${option.oldPrice || ''}"
                                        data-image="${option.image || ''}">
                                        ${option.label}
                                    </button>
                                `).join('')}
                            </div>
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
                         class="product-main-image clickable-image"
                         data-base-image="${product.image}"
                         data-product-id="${product.id}">
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
                            ${initialOldPrice ? `<span class="original-price" data-base-old-price="${initialOldPrice}">${initialOldPrice}</span>` : ''}
                            <div class="installment-text">${installmentText}</div>
                        </div>
                        ${variationsHTML}
                    </div>
                    <div class="product-actions">
                        <button class="btn-quick-view" data-product-id="${product.id}">
                            <i class="fab fa-whatsapp"></i> Comprar
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
    // Configurar eventos de clique nas imagens
    setupImageClickEvents();
}

// Função para configurar eventos de clique nas imagens
function setupImageClickEvents() {
    document.querySelectorAll('.clickable-image').forEach(image => {
        image.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const product = window.productsData.find(p => p.id == productId);

            if (product) {
                openProductModal(product);
            }
        });
        
        // Adicionar cursor pointer para indicar que é clicável
        image.style.cursor = 'pointer';
    });
}

// Função para configurar eventos das variações COM oldPrice dinâmico
function setupVariationEvents() {
    // Para cada botão de variação PILL
    document.querySelectorAll('.variation-badge').forEach(badge => {
        badge.addEventListener('click', function() {
            const productCard = this.closest('.catalog-card');
            const currentPriceElement = productCard.querySelector('.current-price');
            const oldPriceElement = productCard.querySelector('.original-price');
            const productImage = productCard.querySelector('.product-main-image');
            const basePrice = currentPriceElement.dataset.basePrice;
            const baseImage = productImage.dataset.baseImage;
            const baseOldPrice = oldPriceElement?.dataset.baseOldPrice || '';
            
            // Remover 'active' dos outros badges do mesmo grupo
            const variationGroup = this.closest('.variation-group');
            variationGroup.querySelectorAll('.variation-badge').forEach(b => {
                b.classList.remove('active');
            });
            
            // Adicionar 'active' ao badge clicado
            this.classList.add('active');
            
            // Coletar todas as seleções deste produto
            const variations = productCard.querySelectorAll('.variation-group');
            let finalPrice = basePrice;
            let finalOldPrice = baseOldPrice;
            let finalImage = baseImage;
            const selectedOptions = {};
            
            // Encontrar o preço, oldPrice e imagem da opção selecionada
            variations.forEach(variationGroup => {
                const activeBadge = variationGroup.querySelector('.variation-badge.active');
                if (activeBadge) {
                    const key = activeBadge.dataset.variationKey;
                    const value = activeBadge.dataset.value;
                    const selectedPrice = activeBadge.dataset.price;
                    const selectedOldPrice = activeBadge.dataset.oldPrice;
                    const selectedImage = activeBadge.dataset.image;
                    
                    // Salvar seleção
                    selectedOptions[key] = {
                        value: value,
                        price: selectedPrice,
                        oldPrice: selectedOldPrice,
                        image: selectedImage
                    };
                    
                    if (selectedPrice) {
                        finalPrice = selectedPrice;
                    }
                    if (selectedOldPrice) {
                        finalOldPrice = selectedOldPrice;
                    }
                    if (selectedImage) {
                        finalImage = selectedImage;
                    }
                }
            });
            
            // Atualizar o preço exibido
            currentPriceElement.textContent = finalPrice;
            
            // Atualizar o oldPrice (criar se não existir)
            if (finalOldPrice) {
                if (oldPriceElement) {
                    oldPriceElement.textContent = finalOldPrice;
                    oldPriceElement.style.display = '';
                } else {
                    // Criar elemento oldPrice se não existir
                    const newOldPrice = document.createElement('span');
                    newOldPrice.className = 'original-price';
                    newOldPrice.dataset.baseOldPrice = baseOldPrice;
                    newOldPrice.textContent = finalOldPrice;
                    currentPriceElement.parentNode.appendChild(newOldPrice);
                }
            } else {
                // Esconder oldPrice se não houver
                if (oldPriceElement) {
                    oldPriceElement.style.display = 'none';
                }
            }
            
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
                        
                        // Atualizar o oldPrice no modal
                        const modalOldPrice = modal.querySelector('.modal-old-price');
                        if (finalOldPrice) {
                            if (modalOldPrice) {
                                modalOldPrice.textContent = finalOldPrice;
                                modalOldPrice.style.display = '';
                            }
                        } else {
                            if (modalOldPrice) {
                                modalOldPrice.style.display = 'none';
                            }
                        }
                        
                        // Atualizar a imagem no modal
                        const modalImage = modal.querySelector('#modalMainImage');
                        if (modalImage) modalImage.src = finalImage;
                    }
                }
            }
        });
    });
}

// Função para atualizar o card com base nas seleções do modal (COM oldPrice)
function updateCardFromModalSelections(productId) {
    const productCard = document.querySelector(`.btn-quick-view[data-product-id="${productId}"]`)?.closest('.catalog-card');
    
    if (!productCard || !window.modalSelections?.[productId]) return;
    
    const selectedOptions = window.modalSelections[productId];
    const currentPriceElement = productCard.querySelector('.current-price');
    const oldPriceElement = productCard.querySelector('.original-price');
    const productImage = productCard.querySelector('.product-main-image');
    const basePrice = currentPriceElement.dataset.basePrice;
    const baseImage = productImage.dataset.baseImage;
    const baseOldPrice = oldPriceElement?.dataset.baseOldPrice || '';
    
    let finalPrice = basePrice;
    let finalOldPrice = baseOldPrice;
    let finalImage = baseImage;
    
    // Atualizar cada grupo de badges no card
    productCard.querySelectorAll('.variation-group').forEach(group => {
        const variationKey = group.dataset.key;
        if (selectedOptions[variationKey]) {
            // Remover active de todos
            group.querySelectorAll('.variation-badge').forEach(b => b.classList.remove('active'));
            
            // Adicionar active ao badge correto
            const selectedBadge = group.querySelector(
                `.variation-badge[data-value="${selectedOptions[variationKey].value}"]`
            );
            if (selectedBadge) {
                selectedBadge.classList.add('active');
                
                // Verificar se há preço, oldPrice ou imagem específicos
                if (selectedOptions[variationKey].price) {
                    finalPrice = selectedOptions[variationKey].price;
                }
                if (selectedOptions[variationKey].oldPrice) {
                    finalOldPrice = selectedOptions[variationKey].oldPrice;
                }
                if (selectedOptions[variationKey].image) {
                    finalImage = selectedOptions[variationKey].image;
                }
            }
        }
    });
    
    // Atualizar preço, oldPrice e imagem no card
    currentPriceElement.textContent = finalPrice;
    
    if (finalOldPrice) {
        if (oldPriceElement) {
            oldPriceElement.textContent = finalOldPrice;
            oldPriceElement.style.display = '';
        }
    } else {
        if (oldPriceElement) {
            oldPriceElement.style.display = 'none';
        }
    }
    
    productImage.src = finalImage;
}

// FUNÇÃO PARA ABRIR O MODAL DE PRODUTO - COM oldPrice dinâmico
function openProductModal(product) {
    // Verificar se há seleções salvas para este produto
    const savedSelections = window.modalSelections?.[product.id] || {};
    
    // DADOS INICIAIS
    let currentPrice = product.price;
    let currentOldPrice = product.oldPrice || '';
    let currentImage = product.image;
    let currentThickness = product.thickness;
    let currentHeight = product.height;
    let currentWidth = product.width;
    let currentDepth = product.depth;
    let currentLength = product.length;
    let currentCapacity = product.capacity;
    let currentKitPieces = product.kitPieces || [];
    
    // Texto fixo de parcela
    const installmentText = '6x sem juros';
    
    // SE HOUVER VARIAÇÕES, buscar oldPrice da primeira opção se não existir
    if (product.priceVariations && !currentOldPrice) {
        const firstOption = product.priceVariations[0].options[0];
        if (firstOption && firstOption.oldPrice) {
            currentOldPrice = firstOption.oldPrice;
        }
    }
    
    // SE HOUVER VARIAÇÕES E SELEÇÕES SALVAS, USAR ELAS
    if (product.priceVariations && Object.keys(savedSelections).length > 0) {
        product.priceVariations.forEach(variation => {
            const savedSelection = savedSelections[variation.key];
            if (savedSelection) {
                const selectedOption = variation.options.find(opt => opt.value === savedSelection.value);
                
                if (selectedOption) {
                    // ATUALIZAR VALORES COM BASE NA OPÇÃO
                    if (selectedOption.price) currentPrice = selectedOption.price;
                    if (selectedOption.oldPrice) currentOldPrice = selectedOption.oldPrice;
                    if (selectedOption.image) currentImage = selectedOption.image;
                    if (selectedOption.thickness !== undefined) currentThickness = selectedOption.thickness;
                    if (selectedOption.height !== undefined) currentHeight = selectedOption.height;
                    if (selectedOption.width !== undefined) currentWidth = selectedOption.width;
                    if (selectedOption.depth !== undefined) currentDepth = selectedOption.depth;
                    if (selectedOption.length !== undefined) currentLength = selectedOption.length;
                    if (selectedOption.capacity !== undefined) currentCapacity = selectedOption.capacity;
                    
                    if (selectedOption.kitPieces && selectedOption.kitPieces.length > 0) {
                        currentKitPieces = selectedOption.kitPieces;
                    }
                }
            }
        });
    } 
    // SE NÃO HOUVER SELEÇÕES SALVAS, USAR O PADRÃO DAS PRIMEIRAS VARIAÇÕES
    else if (product.priceVariations && product.priceVariations.length > 0) {
        const firstVariation = product.priceVariations[0];
        const firstOption = firstVariation.options[0];
        
        if (firstOption.price) currentPrice = firstOption.price;
        if (firstOption.oldPrice) currentOldPrice = firstOption.oldPrice;
        if (firstOption.image) currentImage = firstOption.image;
        if (firstOption.thickness !== undefined) currentThickness = firstOption.thickness;
        if (firstOption.height !== undefined) currentHeight = firstOption.height;
        if (firstOption.width !== undefined) currentWidth = firstOption.width;
        if (firstOption.depth !== undefined) currentDepth = firstOption.depth;
        if (firstOption.length !== undefined) currentLength = firstOption.length;
        if (firstOption.capacity !== undefined) currentCapacity = firstOption.capacity;
        
        if (firstOption.kitPieces && firstOption.kitPieces.length > 0) {
            currentKitPieces = firstOption.kitPieces;
        }
    }
    
    // Gerar especificações principais
    let mainSpecsHTML = '';
    const hasMainSpecs = currentHeight || currentWidth || currentDepth || 
                        currentCapacity || currentThickness || currentLength || product.voltage;
    
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
    
    // Gerar peças do kit
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
                            ${piece.footThickness ? `<span>Espessura dos Pés: <strong>${piece.footThickness} mm</strong></span>` : ''}
                            ${piece.voltage ? `<span>Voltagem: <strong>${piece.voltage}</strong></span>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // BADGE DE URGÊNCIA
    const showUrgencyBadge = product.stock && product.stock <= 5;
    const urgencyBadgeHTML = showUrgencyBadge ? `
        <div class="urgency-badge-container">
            <span class="urgency-badge">ÚLTIMAS PEÇAS</span>
        </div>
    ` : '';
    
    // Gerar HTML para variações no modal COM PILLS e data-old-price
    let modalVariationsHTML = '';
    if (product.priceVariations && product.priceVariations.length > 0) {
        modalVariationsHTML = `
            <div class="modal-variations">
                ${product.priceVariations.map(variation => {
                    let selectedValue = savedSelections[variation.key]?.value || variation.options[0].value;
                    
                    return `
                        <div class="variation-group" data-key="${variation.key}">
                            <label class="variation-label">${variation.name}:</label>
                            <div class="variation-badges">
                                ${variation.options.map(option => {
                                    const isSelected = option.value === selectedValue;
                                    return `
                                        <button 
                                            class="variation-badge modal-variation-badge ${isSelected ? 'active' : ''}" 
                                            data-variation-key="${variation.key}"
                                            data-value="${option.value}"
                                            data-price="${option.price}"
                                            data-old-price="${option.oldPrice || ''}"
                                            data-image="${option.image || ''}"
                                            data-product-id="${product.id}">
                                            ${option.label}
                                        </button>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    // Montar modal COM oldPrice dinâmico e 6x sem juros (AGORA ABAIXO DO OLD PRICE)
    const modalHTML = `
        <div class="product-modal-overlay" id="productModal">
            <div class="product-modal">
                <div class="modal-header">
                    <h3>${product.title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="modal-image-info">
                        <div class="modal-image-column">
                            <div class="modal-image">
                                <img src="${currentImage}" alt="${product.title}" id="modalMainImage">
                            </div>
                        </div>
                        
                        <div class="modal-info-column">
                            <div class="price-section">
                                <span class="current-price" id="dynamicPrice">${currentPrice}</span>
                                ${currentOldPrice ? `<span class="original-price modal-old-price">${currentOldPrice}</span>` : ''}
                                <div class="installment-text">${installmentText}</div>
                                ${urgencyBadgeHTML}
                            </div>
                            
                            ${modalVariationsHTML}
                            
                            ${product.longDescription ? `
                                <div class="description-section">
                                    <h4>Descrição</h4>
                                    <div class="long-description">
                                        ${product.longDescription}
                                    </div>
                                </div>
                            ` : ''}
                            
                            <div class="modal-actions">
                                <button class="btn-whatsapp-buy" data-product-id="${product.id}">
                                    <i class="fab fa-whatsapp"></i> Comprar
                                </button>
                            </div>
                            
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
    
    const modal = document.getElementById('productModal');
    
    // Configurar eventos das variações no modal COM oldPrice
    modal.querySelectorAll('.modal-variation-badge').forEach(badge => {
        badge.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            const variationKey = this.dataset.variationKey;
            const selectedPrice = this.dataset.price;
            const selectedOldPrice = this.dataset.oldPrice;
            const selectedImage = this.dataset.image;
            const selectedValue = this.dataset.value;
            
            const product = window.productsData.find(p => p.id === productId);
            if (!product || !product.priceVariations) return;
            
            const variation = product.priceVariations.find(v => v.key === variationKey);
            const selectedOption = variation?.options.find(opt => opt.value === selectedValue);
            
            // Remover 'active' dos outros badges do mesmo grupo
            const variationGroup = this.closest('.variation-group');
            variationGroup.querySelectorAll('.modal-variation-badge').forEach(b => {
                b.classList.remove('active');
            });
            
            this.classList.add('active');
            
            // Salvar a seleção
            if (!window.modalSelections) {
                window.modalSelections = {};
            }
            if (!window.modalSelections[productId]) {
                window.modalSelections[productId] = {};
            }
            
            window.modalSelections[productId][variationKey] = {
                value: selectedValue,
                price: selectedPrice,
                oldPrice: selectedOldPrice,
                image: selectedImage,
                kitPieces: selectedOption?.kitPieces || []
            };
            
            // Atualizar preço no modal
            if (selectedPrice) {
                const dynamicPrice = modal.querySelector('#dynamicPrice');
                if (dynamicPrice) dynamicPrice.textContent = selectedPrice;
            }
            
            // Atualizar oldPrice no modal
            const modalOldPrice = modal.querySelector('.modal-old-price');
            if (selectedOldPrice) {
                if (modalOldPrice) {
                    modalOldPrice.textContent = selectedOldPrice;
                    modalOldPrice.style.display = '';
                } else {
                    // Criar elemento se não existir
                    const priceSection = modal.querySelector('.price-section');
                    const newOldPrice = document.createElement('span');
                    newOldPrice.className = 'original-price modal-old-price';
                    newOldPrice.textContent = selectedOldPrice;
                    // Inserir após o preço atual e antes do 6x sem juros
                    const installmentElement = modal.querySelector('.installment-text');
                    if (installmentElement) {
                        installmentElement.insertAdjacentElement('beforebegin', newOldPrice);
                    } else {
                        priceSection.querySelector('#dynamicPrice').after(newOldPrice);
                    }
                }
            } else {
                if (modalOldPrice) {
                    modalOldPrice.style.display = 'none';
                }
            }
            
            // Atualizar imagem
            if (selectedImage) {
                const modalImage = modal.querySelector('#modalMainImage');
                if (modalImage) modalImage.src = selectedImage;
            }
            
            // Atualizar especificações
            if (selectedOption) {
                updateModalSpecs(modal, selectedOption, product);
            }
        });
    });
    
    // Configurar botão WhatsApp
    setupWhatsAppButton(modal, product);
    
    // Configurar eventos de fechar
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
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

// Funções auxiliares
function setupWhatsAppButton(modal, product) {
    const whatsappButton = modal.querySelector('.btn-whatsapp-buy');
    
    if (!whatsappButton) return;
    
    whatsappButton.addEventListener('click', function() {
        const productTitle = product.title;
        const dynamicPrice = modal.querySelector('#dynamicPrice')?.textContent || product.price;
        
        const selectedOptions = {};
        let optionsText = '';
        
        modal.querySelectorAll('.modal-variation-badge.active').forEach(badge => {
            const variationKey = badge.dataset.variationKey;
            const label = badge.textContent.trim();
            
            selectedOptions[variationKey] = { label: label };
            optionsText += `• ${variationKey}: ${label}\n`;
        });
        
        const message = encodeURIComponent(
            `Olá! Gostaria de comprar:\n\n` +
            `*${productTitle}*\n` +
            `Preço: ${dynamicPrice}\n` +
            `Parcelamento: 6x sem juros\n` +
            `${optionsText ? `Opções:\n${optionsText}` : ''}` +
            `\nCódigo: ${product.productCode || 'N/A'}\n\n` +
            `Poderia me ajudar com essa compra?`
        );
        
        const phoneNumber = '5511999999999';
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        
        const originalText = whatsappButton.innerHTML;
        whatsappButton.innerHTML = '<i class="fas fa-check"></i> Redirecionando...';
        whatsappButton.style.backgroundColor = '#128C7E';
        
        setTimeout(() => {
            whatsappButton.innerHTML = originalText;
            whatsappButton.style.backgroundColor = '#25D366';
        }, 1500);
    });
}

function updateModalSpecs(modal, selectedOption, originalProduct) {
    const currentHeight = selectedOption.height || originalProduct.height;
    const currentWidth = selectedOption.width || originalProduct.width;
    const currentDepth = selectedOption.depth || originalProduct.depth;
    const currentLength = selectedOption.length || originalProduct.length;
    const currentThickness = selectedOption.thickness || originalProduct.thickness;
    const currentCapacity = selectedOption.capacity || originalProduct.capacity;
    const currentKitPieces = selectedOption.kitPieces || originalProduct.kitPieces || [];
    
    let mainSpecsHTML = '';
    const hasMainSpecs = currentHeight || currentWidth || currentDepth || 
                        currentCapacity || currentThickness || currentLength || originalProduct.voltage;
    
    if (hasMainSpecs) {
        mainSpecsHTML = `
            <table class="specs-table">
                ${currentHeight ? `<tr><td>Altura:</td><td><strong>${currentHeight} cm</strong></td></tr>` : ''}
                ${currentWidth ? `<tr><td>Largura:</td><td><strong>${currentWidth} cm</strong></td></tr>` : ''}
                ${currentDepth && currentDepth > 0 ? `<tr><td>Profundidade:</td><td><strong>${currentDepth} cm</strong></td></tr>` : ''}
                ${currentLength ? `<tr><td>Comprimento:</td><td><strong>${currentLength} cm</strong></td></tr>` : ''}
                ${currentThickness ? `<tr><td>Espessura:</td><td><strong>${currentThickness} mm</strong></td></tr>` : ''}
                ${currentCapacity && currentCapacity > 0 ? `<tr><td>Capacidade:</td><td><strong>${currentCapacity} unidades</strong></td></tr>` : ''}
                ${originalProduct.voltage ? `<tr><td>Voltagem:</td><td><strong>${originalProduct.voltage}</strong></td></tr>` : ''}
            </table>
        `;
    }
    
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
                            ${piece.footThickness ? `<span>Espessura dos Pés: <strong>${piece.footThickness} mm</strong></span>` : ''}
                            ${piece.voltage ? `<span>Voltagem: <strong>${piece.voltage}</strong></span>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    const specsSection = modal.querySelector('.specs-section');
    if (specsSection) {
        specsSection.innerHTML = `
            <h4>Especificações</h4>
            ${mainSpecsHTML}
            ${kitPiecesHTML}
            ${originalProduct.productCode ? `
                <div class="product-code">
                    <strong>Código:</strong> ${originalProduct.productCode}
                </div>
            ` : ''}
        `;
    }
}

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

document.addEventListener('DOMContentLoaded', function () {
    loadProducts().then(() => {
        checkUrlFilterOnLoad();
    });
    
    if (typeof setupMobileFilters === 'function') {
        setupMobileFilters();
    }
    
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.filter) {
            applyFilter(event.state.filter);
            updateActiveFilterButtons(event.state.filter);
        } else {
            applyFilter('all');
            updateActiveFilterButtons('all');
        }
    });
});

// Funções de filtragem e carregamento (mantidas)
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');

        if (response.ok) {
            const products = await response.json();
            window.productsData = products;
            renderProducts(products);
            setupFilters();
            return products;
        } else {
            if (typeof productsData !== 'undefined') {
                window.productsData = productsData;
                renderProducts(productsData);
                setupFilters();
                return productsData;
            } else {
                console.error('Não foi possível carregar os produtos');
                return [];
            }
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        return [];
    }
}

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const mobileFilterBtns = document.querySelectorAll('.mobile-filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;
            applyFilter(filter);
        });
    });

    mobileFilterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const filter = this.dataset.filter;
            applyFilter(filter);

            filterBtns.forEach(b => {
                b.classList.toggle('active', b.dataset.filter === filter);
            });
            
            updateMobileFilterButton(filter);
        });
    });
}

function checkUrlFilterOnLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    const filterFromUrl = urlParams.get('filter');
    
    if (filterFromUrl) {
        console.log('Filtro da URL detectado:', filterFromUrl);
        
        if (typeof applyFilter === 'function') {
            setTimeout(() => {
                applyFilter(filterFromUrl);
                updateActiveFilterButtons(filterFromUrl);
                updateMobileFilterButton(filterFromUrl);
            }, 300);
        }
    }
}

function applyFilter(filter) {
    console.log('DEBUG applyFilter chamado com:', filter);
    console.log('DEBUG productsData existe?', !!window.productsData);
    
    if (!window.productsData) {
        console.log('Aguardando productsData...');
        setTimeout(() => applyFilter(filter), 100);
        return;
    }
    
    console.log('Aplicando filtro:', filter);
    
    if (filter === 'all') {
        renderProducts(window.productsData);
    } else {
        const filteredProducts = window.productsData.filter(product =>
            product.category === filter
        );
        console.log('Produtos filtrados:', filteredProducts.length);
        renderProducts(filteredProducts);
    }
    
    updateUrlFilter(filter);
}

function updateUrlFilter(filter) {
    const currentUrl = new URL(window.location);
    
    if (filter === 'all') {
        currentUrl.searchParams.delete('filter');
    } else {
        currentUrl.searchParams.set('filter', filter);
    }
    
    window.history.pushState({ filter: filter }, '', currentUrl.toString());
}

function updateActiveFilterButtons(filter) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function updateMobileFilterButton(filter) {
    const mobileFilterToggle = document.getElementById('mobileFilterToggle');
    const mobileFilterBtns = document.querySelectorAll('.mobile-filter-btn');
    
    if (!mobileFilterToggle || !mobileFilterBtns.length) return;
    
    const correspondingBtn = Array.from(mobileFilterBtns).find(btn => 
        btn.dataset.filter === filter
    );
    
    if (correspondingBtn && mobileFilterToggle.querySelector('.filter-label')) {
        mobileFilterToggle.querySelector('.filter-label').textContent = 
            correspondingBtn.textContent.trim();
        
        mobileFilterBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.filter === filter);
        });
    }
}