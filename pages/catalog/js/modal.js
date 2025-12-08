// FUNÇÃO PARA ABRIR O MODAL DE PRODUTO - VERSÃO CORRIGIDA
function openProductModal(product) {
    // Verificar se há seleções salvas para este produto
    const savedSelections = window.modalSelections?.[product.id] || {};
    
    // DADOS INICIAIS
    let currentPrice = product.price;
    let currentImage = product.image;
    let currentThickness = product.thickness;
    let currentHeight = product.height;
    let currentWidth = product.width;
    let currentDepth = product.depth;
    let currentLength = product.length;
    let currentCapacity = product.capacity;
    let currentKitPieces = product.kitPieces || [];
    
    console.log('Abrindo modal para:', product.title);
    console.log('KitPieces no produto (raiz):', product.kitPieces);
    console.log('Seleções salvas:', savedSelections);
    
    // SE HOUVER VARIAÇÕES E SELEÇÕES SALVAS, USAR ELAS
    if (product.priceVariations && Object.keys(savedSelections).length > 0) {
        console.log('Tem variações e seleções salvas');
        
        product.priceVariations.forEach(variation => {
            const savedSelection = savedSelections[variation.key];
            if (savedSelection) {
                const selectedOption = variation.options.find(opt => opt.value === savedSelection.value);
                
                if (selectedOption) {
                    console.log('Opção selecionada:', selectedOption);
                    
                    // ATUALIZAR VALORES COM BASE NA OPÇÃO
                    if (selectedOption.price) currentPrice = selectedOption.price;
                    if (selectedOption.image) currentImage = selectedOption.image;
                    if (selectedOption.thickness !== undefined) currentThickness = selectedOption.thickness;
                    if (selectedOption.height !== undefined) currentHeight = selectedOption.height;
                    if (selectedOption.width !== undefined) currentWidth = selectedOption.width;
                    if (selectedOption.depth !== undefined) currentDepth = selectedOption.depth;
                    if (selectedOption.length !== undefined) currentLength = selectedOption.length;
                    if (selectedOption.capacity !== undefined) currentCapacity = selectedOption.capacity;
                    
                    // IMPORTANTE: Se a opção tiver kitPieces, usar eles!
                    if (selectedOption.kitPieces && selectedOption.kitPieces.length > 0) {
                        console.log('Usando kitPieces da variação:', selectedOption.kitPieces);
                        currentKitPieces = selectedOption.kitPieces;
                    }
                }
            }
        });
    } 
    // SE NÃO HOUVER SELEÇÕES SALVAS, USAR O PADRÃO DAS PRIMEIRAS VARIAÇÕES
    else if (product.priceVariations && product.priceVariations.length > 0) {
        console.log('Usando valores padrão da primeira variação');
        
        const firstVariation = product.priceVariations[0];
        const firstOption = firstVariation.options[0];
        
        // Usar valores da primeira opção como padrão
        if (firstOption.price) currentPrice = firstOption.price;
        if (firstOption.image) currentImage = firstOption.image;
        if (firstOption.thickness !== undefined) currentThickness = firstOption.thickness;
        if (firstOption.height !== undefined) currentHeight = firstOption.height;
        if (firstOption.width !== undefined) currentWidth = firstOption.width;
        if (firstOption.depth !== undefined) currentDepth = firstOption.depth;
        if (firstOption.length !== undefined) currentLength = firstOption.length;
        if (firstOption.capacity !== undefined) currentCapacity = firstOption.capacity;
        
        // IMPORTANTE: Se a primeira opção tiver kitPieces, usar eles!
        if (firstOption.kitPieces && firstOption.kitPieces.length > 0) {
            console.log('Usando kitPieces da primeira opção:', firstOption.kitPieces);
            currentKitPieces = firstOption.kitPieces;
        }
    }
    
    // Gerar especificações principais - USANDO OS VALORES ATUALIZADOS
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
    
    // Gerar peças do kit - USANDO AS PEÇAS ATUALIZADAS
    let kitPiecesHTML = '';
    if (currentKitPieces && currentKitPieces.length > 0) {
        console.log('Gerando HTML para kitPieces:', currentKitPieces);
        
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
    
    // Gerar HTML para variações no modal COM PILLS
    let modalVariationsHTML = '';
    if (product.priceVariations && product.priceVariations.length > 0) {
        modalVariationsHTML = `
            <div class="modal-variations">
                ${product.priceVariations.map(variation => {
                    // Determinar qual opção está selecionada
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
                            
                            <!-- ADICIONE O BOTÃO AQUI (depois da descrição e antes das especificações) -->
<div class="modal-actions">
    <button class="btn-whatsapp-buy" data-product-id="${product.id}">
        <i class="fab fa-whatsapp"></i> Comprar
    </button>
</div>

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
    
    // Configurar eventos das variações no modal COM PILLS
    modal.querySelectorAll('.modal-variation-badge').forEach(badge => {
        badge.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            const variationKey = this.dataset.variationKey;
            const selectedPrice = this.dataset.price;
            const selectedImage = this.dataset.image;
            const selectedValue = this.dataset.value;
            
            // Encontrar o produto original
            const product = window.productsData.find(p => p.id === productId);
            if (!product || !product.priceVariations) return;
            
            // Encontrar a opção completa
            const variation = product.priceVariations.find(v => v.key === variationKey);
            const selectedOption = variation?.options.find(opt => opt.value === selectedValue);
            
            // Remover 'active' dos outros badges do mesmo grupo
            const variationGroup = this.closest('.variation-group');
            variationGroup.querySelectorAll('.modal-variation-badge').forEach(b => {
                b.classList.remove('active');
            });
            
            // Adicionar 'active' ao badge clicado
            this.classList.add('active');
            
            // Salvar a seleção
            if (!window.modalSelections) {
                window.modalSelections = {};
            }
            if (!window.modalSelections[productId]) {
                window.modalSelections[productId] = {};
            }
            
            // Salvar TODOS os dados da opção, incluindo kitPieces
            window.modalSelections[productId][variationKey] = {
                value: selectedValue,
                price: selectedPrice,
                image: selectedImage,
                kitPieces: selectedOption?.kitPieces || []
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
            
            // ATUALIZAR ESPECIFICAÇÕES NO MODAL
            if (selectedOption) {
                // Atualizar especificações na mesma tela
                updateModalSpecs(modal, selectedOption, product);
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

// NOVA FUNÇÃO PARA ATUALIZAR ESPECIFICAÇÕES NO MODAL
function updateModalSpecs(modal, selectedOption, originalProduct) {
    // Atualizar especificações com base na opção selecionada
    const currentHeight = selectedOption.height || originalProduct.height;
    const currentWidth = selectedOption.width || originalProduct.width;
    const currentDepth = selectedOption.depth || originalProduct.depth;
    const currentLength = selectedOption.length || originalProduct.length;
    const currentThickness = selectedOption.thickness || originalProduct.thickness;
    const currentCapacity = selectedOption.capacity || originalProduct.capacity;
    const currentKitPieces = selectedOption.kitPieces || originalProduct.kitPieces || [];
    
    // Gerar especificações atualizadas
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
    
    // Gerar peças do kit atualizadas
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
    
    // Atualizar a seção de especificações no modal
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