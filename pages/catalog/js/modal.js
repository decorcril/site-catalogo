// FUNÇÃO PARA ABRIR O MODAL DE PRODUTO - VERSÃO COMPLETA ATUALIZADA
function openProductModal(product) {
    // Remover modal existente
    const existingModal = document.getElementById('productModal');
    if (existingModal) existingModal.remove();

    // Inicializar dados
    const savedSelections = window.modalSelections?.[product.id] || {};
    const data = initializeModalData(product, savedSelections);

    // Gerar HTML do modal
    const modalHTML = createModalHTML(product, data);

    // Adicionar ao DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Configurar eventos
    setupModalEvents(product, data);
}

// Função auxiliar 1: Inicializar dados do modal
function initializeModalData(product, savedSelections) {
    const data = {
        price: product.price,
        oldPrice: product.oldPrice || null,
        image: product.image,
        thickness: product.thickness,
        height: product.height,
        width: product.width,
        depth: product.depth,
        length: product.length,
        diameter: product.diameter,
        capacity: product.capacity,
        footHeight: product.footHeight,
        voltage: product.voltage || null,
        kitPieces: product.kitPieces || [],
        customSpecs: product.customSpecs || null,
        paymentType: null,
        installmentPrice: null
    };

    // Verificar variações e seleções salvas
    if (product.priceVariations) {
        if (Object.keys(savedSelections).length > 0) {
            // Usar seleções salvas
            product.priceVariations.forEach(variation => {
                const savedSelection = savedSelections[variation.key];
                if (savedSelection) {
                    const option = variation.options.find(opt => opt.value === savedSelection.value);
                    if (option) {
                        updateDataFromOption(data, option);
                    }
                }
            });
        } else if (product.priceVariations.length > 0) {
            // Usar primeira opção como padrão
            updateDataFromOption(data, product.priceVariations[0].options[0]);
        }
    }

    return data;
}

// Função auxiliar 2: Atualizar dados a partir de uma opção
function updateDataFromOption(data, option) {
    if (!option) return;

    const properties = [
        'price', 'oldPrice', 'image', 'thickness', 'height', 'width',
        'depth', 'length', 'diameter', 'capacity', 'footHeight',
        'paymentType', 'installmentPrice', 'voltage'
    ];

    properties.forEach(prop => {
        if (option[prop] !== undefined) {
            data[prop] = option[prop];
        }
    });

    if (option.kitPieces && option.kitPieces.length > 0) {
        data.kitPieces = option.kitPieces;
    }

    // Copiar especificações customizadas
    if (option.customSpecs) {
        data.customSpecs = option.customSpecs;
    }
}

// Função auxiliar 3: Criar especificações HTML - COM SUPORTE A CUSTOMSPECS
function createSpecsHTML(data, product) {
    let specsHTML = '';
    
    // Primeiro, verificar se temos kitPieces
    const hasKitPieces = (data.kitPieces && data.kitPieces.length > 0) || 
                         (product.kitPieces && product.kitPieces.length > 0);
    
    if (hasKitPieces) {
        // Se temos kitPieces, NÃO mostrar a tabela geral aqui
        return '';
    }
    // CASOS ESPECIAIS PARA MESAS
    else if (data.diameter && data.thickness && data.footHeight) {
        specsHTML = `
            <table class="specs-table">
                <tr><td colspan="2"><strong>Tampo Redondo:</strong></td></tr>
                <tr><td>Diâmetro:</td><td><strong>${data.diameter} cm</strong></td></tr>
                <tr><td>Espessura:</td><td><strong>${data.thickness} mm</strong></td></tr>
                <tr><td colspan="2"><strong>Pés:</strong></td></tr>
                <tr><td>Altura:</td><td><strong>${data.footHeight} cm</strong></td></tr>
                <tr><td>Espessura:</td><td><strong>${data.thickness} mm</strong></td></tr>
            </table>
        `;
    }
    else if (data.length && data.width && data.thickness && data.footHeight) {
        specsHTML = `
            <table class="specs-table">
                <tr><td colspan="2"><strong>Tampo:</strong></td></tr>
                <tr><td>Comprimento:</td><td><strong>${data.length} cm</strong></td></tr>
                <tr><td>Largura:</td><td><strong>${data.width} cm</strong></td></tr>
                <tr><td>Espessura:</td><td><strong>${data.thickness} mm</strong></td></tr>
                <tr><td colspan="2"><strong>Pés:</strong></td></tr>
                <tr><td>Altura:</td><td><strong>${data.footHeight} cm</strong></td></tr>
                <tr><td>Espessura:</td><td><strong>${data.thickness} mm</strong></td></tr>
            </table>
        `;
    }
    // CASO GERAL
    else {
        const currentVoltage = data.voltage || product.voltage;
        const hasMainSpecs = data.height || data.width || data.depth ||
            data.capacity || data.thickness || data.length ||
            data.diameter || currentVoltage;

        if (hasMainSpecs) {
            specsHTML = `
                <table class="specs-table">
                    ${data.height && !data.footHeight ? `<tr><td>Altura:</td><td><strong>${data.height} cm</strong></td></tr>` : ''}
                    ${data.diameter ? `<tr><td>Diâmetro:</td><td><strong>${data.diameter} cm</strong></td></tr>` : ''}
                    ${data.width ? `<tr><td>Largura:</td><td><strong>${data.width} cm</strong></td></tr>` : ''}
                    ${data.depth && data.depth > 0 ? `<tr><td>Profundidade:</td><td><strong>${data.depth} cm</strong></td></tr>` : ''}
                    ${data.length ? `<tr><td>Comprimento:</td><td><strong>${data.length} cm</strong></td></tr>` : ''}
                    ${data.thickness ? `<tr><td>Espessura:</td><td><strong>${data.thickness} mm</strong></td></tr>` : ''}
                    ${data.capacity && data.capacity > 0 ? `<tr><td>Capacidade:</td><td><strong>${data.capacity} unidades</strong></td></tr>` : ''}
                    ${data.footHeight ? `<tr><td>Altura dos pés:</td><td><strong>${data.footHeight} cm</strong></td></tr>` : ''}
                    ${currentVoltage ? `<tr><td>Voltagem:</td><td><strong>${currentVoltage}</strong></td></tr>` : ''}
                </table>
            `;
        }
    }

    // ADICIONAR ESPECIFICAÇÕES CUSTOMIZADAS
    const customSpecs = data.customSpecs || product.customSpecs;
    if (customSpecs && Array.isArray(customSpecs) && customSpecs.length > 0) {
        specsHTML += `
            <table class="specs-table">
                ${customSpecs.map(spec => `
                    <tr>
                        <td>${spec.label}:</td>
                        <td><strong>${spec.value}${spec.unit || ''}</strong></td>
                    </tr>
                `).join('')}
            </table>
        `;
    }

    return specsHTML;
}

// Função auxiliar 4: Criar HTML das peças do kit
function createKitPiecesHTML(kitPieces) {
    if (!kitPieces || kitPieces.length === 0) return '';

    return `
        <div class="kit-pieces">
            <h5>Peças do Kit (${kitPieces.length})</h5>
            ${kitPieces.map(piece => {
        const isMesaComPes = (piece.footHeight && piece.width);
        
        if (isMesaComPes) {
            return `
                        <div class="kit-piece">
                            <div class="kit-piece-name">${piece.name}</div>
                            <div class="kit-piece-specs">
                                <div class="specs-group">
                                    <strong>Tampo:</strong><br>
                                    ${piece.height ? `<span>Comprimento: <strong>${piece.height} cm</strong></span><br>` : ''}
                                    ${piece.width ? `<span>Largura: <strong>${piece.width} cm</strong></span><br>` : ''}
                                    ${piece.thickness ? `<span>Espessura: <strong>${piece.thickness} mm</strong></span>` : ''}
                                </div>
                                <div class="specs-group">
                                    <strong>Pés:</strong><br>
                                    <span>Altura: <strong>${piece.footHeight} cm</strong></span><br>
                                    <span>Espessura: <strong>${piece.footThickness || piece.thickness} mm</strong></span>
                                </div>
                            </div>
                        </div>
                    `;
        } else {
            return `
                        <div class="kit-piece">
                            <div class="kit-piece-name">${piece.name}</div>
                            <div class="kit-piece-specs">
                                ${piece.height ? `<span>Altura: <strong>${piece.height} cm</strong></span><br>` : ''}
                                ${piece.length ? `<span>Comprimento: <strong>${piece.length} cm</strong></span><br>` : ''}
                                ${piece.width ? `<span>Largura: <strong>${piece.width} cm</strong></span><br>` : ''}
                                ${piece.diameter ? `<span>Diâmetro: <strong>${piece.diameter} cm</strong></span><br>` : ''}
                                ${piece.depth && piece.depth > 0 ? `<span>Profundidade: <strong>${piece.depth} cm</strong></span><br>` : ''}
                                ${piece.thickness ? `<span>Espessura: <strong>${piece.thickness} mm</strong></span><br>` : ''}
                                ${piece.capacity && piece.capacity > 0 ? `<span>Capacidade: <strong>${piece.capacity} un</strong></span><br>` : ''}
                                ${piece.footHeight ? `<span>Pés: <strong>${piece.footHeight} cm</strong></span><br>` : ''}
                                ${piece.footThickness ? `<span>Espessura dos Pés: <strong>${piece.footThickness} mm</strong></span><br>` : ''}
                                ${piece.voltage ? `<span>Voltagem: <strong>${piece.voltage}</strong></span>` : ''}
                            </div>
                        </div>
                    `;
        }
    }).join('')}
        </div>
    `;
}

// Função auxiliar 5: Criar HTML das variações
function createVariationsHTML(product, savedSelections) {
    if (!product.priceVariations || product.priceVariations.length === 0) return '';

    return `
        <div class="modal-variations">
            ${product.priceVariations.map(variation => {
        const selectedValue = savedSelections[variation.key]?.value || variation.options[0].value;

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
                                        data-payment-type="${option.paymentType || ''}"
                                        data-installment-price="${option.installmentPrice || ''}"
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

// Função auxiliar 6: Criar HTML da seção de preços
function createPriceSectionHTML(data, product) {
    const showUrgencyBadge = product.stock && product.stock <= 5;

    return `
        <div class="price-section">
            ${data.paymentType ? `
                <div class="payment-option-pix">
                    <span class="payment-type">${data.paymentType}</span>
                    <span class="payment-value" id="dynamicPrice">${data.price}</span>
                </div>
            ` : `
                <div class="simple-price">
                    <span class="current-price" id="dynamicPrice">${data.price}</span>
                </div>
            `}
            
            ${!data.installmentPrice ? `
                <div class="simple-installment-text">
                    Em até 6x sem juros
                </div>
            ` : ''}
            
            ${data.installmentPrice ? `
                <div class="payment-option-installment">
                    <span class="payment-label">ou em</span>
                    <span class="payment-value" id="dynamicInstallmentPrice">${data.installmentPrice}</span>
                    <span class="installment-text">Em até 6x sem juros</span>
                </div>
            ` : ''}
            
            ${data.oldPrice ? `<span class="original-price" id="dynamicOldPrice">${data.oldPrice}</span>` : ''}
            
            ${showUrgencyBadge ? `
                <div class="urgency-badge-container">
                    <span class="urgency-badge">ÚLTIMAS PEÇAS</span>
                </div>
            ` : ''}
        </div>
    `;
}

// Função auxiliar 7: Criar HTML completo do modal
function createModalHTML(product, data) {
    const specsHTML = createSpecsHTML(data, product);
    const kitPiecesHTML = createKitPiecesHTML(data.kitPieces);
    const variationsHTML = createVariationsHTML(product, window.modalSelections?.[product.id] || {});
    const priceSectionHTML = createPriceSectionHTML(data, product);

    return `
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
                                <img src="${data.image}" alt="${product.title}" id="modalMainImage">
                            </div>
                        </div>
                        
                        <div class="modal-info-column">
                            ${priceSectionHTML}
                            ${variationsHTML}
                            
                            <div class="modal-actions">
                                <button class="btn-whatsapp-buy" data-product-id="${product.id}">
                                    <i class="fab fa-whatsapp"></i> Comprar
                                </button>
                            </div>
                            
                            ${product.longDescription ? `
                                <div class="description-section">
                                    <h4>Descrição</h4>
                                    <div class="long-description">
                                        ${product.longDescription}
                                    </div>
                                </div>
                            ` : ''}

                            ${(specsHTML || kitPiecesHTML || product.productCode) ? `
                                <div class="specs-section">
                                    <h4>Especificações</h4>
                                    ${specsHTML}
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
}

// Função auxiliar 8: Configurar eventos do modal
function setupModalEvents(product, initialData) {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    // Evento de clique nas variações
    modal.querySelectorAll('.modal-variation-badge').forEach(badge => {
        badge.addEventListener('click', function () {
            handleVariationClick(this, product, modal);
        });
    });

    // Evento do botão WhatsApp
    modal.querySelector('.btn-whatsapp-buy').addEventListener('click', function () {
        handleWhatsAppClick(parseInt(this.dataset.productId));
    });

    // Eventos de fechamento
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => closeModal(product.id, modal));

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(product.id, modal);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal) closeModal(product.id, modal);
    });
}

// Função auxiliar 9: Lidar com clique na variação
function handleVariationClick(badge, product, modal) {
    const productId = parseInt(badge.dataset.productId);
    const variationKey = badge.dataset.variationKey;
    const selectedValue = badge.dataset.value;
    const selectedPrice = badge.dataset.price;
    const selectedOldPrice = badge.dataset.oldPrice || null;
    const selectedImage = badge.dataset.image;
    const selectedPaymentType = badge.dataset.paymentType || '';
    const selectedInstallmentPrice = badge.dataset.installmentPrice || '';

    const variation = product.priceVariations?.find(v => v.key === variationKey);
    const selectedOption = variation?.options.find(opt => opt.value === selectedValue);

    // Atualizar seleção ativa
    const variationGroup = badge.closest('.variation-group');
    variationGroup.querySelectorAll('.modal-variation-badge').forEach(b => {
        b.classList.remove('active');
    });
    badge.classList.add('active');

    // Salvar seleção
    if (!window.modalSelections) window.modalSelections = {};
    if (!window.modalSelections[productId]) window.modalSelections[productId] = {};

    window.modalSelections[productId][variationKey] = {
        value: selectedValue,
        price: selectedPrice,
        oldPrice: selectedOldPrice,
        image: selectedImage,
        paymentType: selectedPaymentType,
        installmentPrice: selectedInstallmentPrice,
        thickness: selectedOption?.thickness,
        height: selectedOption?.height,
        width: selectedOption?.width,
        length: selectedOption?.length,
        diameter: selectedOption?.diameter,
        footHeight: selectedOption?.footHeight,
        voltage: selectedOption?.voltage,
        kitPieces: selectedOption?.kitPieces || [],
        customSpecs: selectedOption?.customSpecs || null
    };

    // Atualizar UI
    updateModalUI(modal, {
        price: selectedPrice,
        oldPrice: selectedOldPrice,
        image: selectedImage,
        paymentType: selectedPaymentType,
        installmentPrice: selectedInstallmentPrice
    });

    // Atualizar especificações
    if (selectedOption) {
        updateModalSpecs(modal, selectedOption, product);
    }
}

// Função auxiliar 10: Atualizar UI do modal
function updateModalUI(modal, data) {
    // Atualizar preço
    const dynamicPrice = modal.querySelector('#dynamicPrice');
    if (dynamicPrice && data.price) dynamicPrice.textContent = data.price;

    // Atualizar preço antigo
    const oldPriceElement = modal.querySelector('#dynamicOldPrice');
    if (oldPriceElement) {
        if (data.oldPrice) {
            oldPriceElement.textContent = data.oldPrice;
            oldPriceElement.style.display = 'inline';
        } else {
            oldPriceElement.style.display = 'none';
        }
    }

    // Atualizar imagem
    if (data.image) {
        const modalImage = modal.querySelector('#modalMainImage');
        if (modalImage) modalImage.src = data.image;
    }

    // Atualizar seção de preços completa
    const priceSection = modal.querySelector('.price-section');
    if (priceSection) {
        const showUrgencyBadge = priceSection.querySelector('.urgency-badge-container');

        let newPriceHTML = '';

        if (data.paymentType) {
            newPriceHTML += `
                <div class="payment-option-pix">
                    <span class="payment-type">${data.paymentType}</span>
                    <span class="payment-value">${data.price}</span>
                </div>
            `;
        } else {
            newPriceHTML += `
                <div class="simple-price">
                    <span class="current-price">${data.price}</span>
                </div>
            `;
        }

        if (!data.installmentPrice) {
            newPriceHTML += `
                <div class="simple-installment-text">
                    Em até 6x sem juros
                </div>
            `;
        }

        if (data.installmentPrice) {
            newPriceHTML += `
                <div class="payment-option-installment">
                    <span class="payment-label">ou</span>
                    <span class="payment-value">${data.installmentPrice}</span>
                    <span class="installment-text">Em até 6x sem juros</span>
                </div>
            `;
        }

        if (data.oldPrice) {
            newPriceHTML += `<span class="original-price">${data.oldPrice}</span>`;
        }

        if (showUrgencyBadge) {
            newPriceHTML += showUrgencyBadge.outerHTML;
        }

        priceSection.innerHTML = newPriceHTML;
    }
}

// Função auxiliar 11: Fechar modal
function closeModal(productId, modal) {
    updateCardFromModalSelections(productId);
    if (modal) modal.remove();
}

// FUNÇÃO PARA ATUALIZAR ESPECIFICAÇÕES NO MODAL - COM CUSTOMSPECS
function updateModalSpecs(modal, selectedOption, originalProduct) {
    // Atualizar especificações com base na opção selecionada
    const currentHeight = selectedOption.height || originalProduct.height;
    const currentWidth = selectedOption.width || originalProduct.width;
    const currentDepth = selectedOption.depth || originalProduct.depth;
    const currentLength = selectedOption.length || originalProduct.length;
    const currentDiameter = selectedOption.diameter || originalProduct.diameter;
    const currentThickness = selectedOption.thickness || originalProduct.thickness;
    const currentCapacity = selectedOption.capacity || originalProduct.capacity;
    const currentKitPieces = selectedOption.kitPieces || originalProduct.kitPieces || [];
    const currentFootHeight = selectedOption.footHeight || originalProduct.footHeight;
    const currentVoltage = selectedOption.voltage || originalProduct.voltage;
    const currentCustomSpecs = selectedOption.customSpecs || originalProduct.customSpecs;

    // Verificar se temos kitPieces
    const hasKitPieces = (currentKitPieces && currentKitPieces.length > 0) || 
                         (originalProduct.kitPieces && originalProduct.kitPieces.length > 0);
    
    // Gerar especificações atualizadas
    let mainSpecsHTML = '';

    // SE TEM KITPIECES, NÃO MOSTRAR TABELA GERAL
    if (hasKitPieces) {
        mainSpecsHTML = '';
    }
    // VERIFICAR SE É UMA MESA REDONDA COM PÉS
    else if (currentDiameter && currentThickness && currentFootHeight) {
        mainSpecsHTML = `
            <table class="specs-table">
                <tr><td colspan="2"><strong>Tampo Redondo:</strong></td></tr>
                <tr><td>Diâmetro:</td><td><strong>${currentDiameter} cm</strong></td></tr>
                <tr><td>Espessura:</td><td><strong>${currentThickness} mm</strong></td></tr>
                <tr><td colspan="2"><strong>Pés:</strong></td></tr>
                <tr><td>Altura:</td><td><strong>${currentFootHeight} cm</strong></td></tr>
                <tr><td>Espessura:</td><td><strong>${currentThickness} mm</strong></td></tr>
            </table>
        `;
    }
    // VERIFICAR SE É UMA MESA RETANGULAR COM PÉS
    else if (currentLength && currentWidth && currentThickness && currentFootHeight) {
        mainSpecsHTML = `
            <table class="specs-table">
                <tr><td colspan="2"><strong>Tampo:</strong></td></tr>
                <tr><td>Comprimento:</td><td><strong>${currentLength} cm</strong></td></tr>
                <tr><td>Largura:</td><td><strong>${currentWidth} cm</strong></td></tr>
                <tr><td>Espessura:</td><td><strong>${currentThickness} mm</strong></td></tr>
                <tr><td colspan="2"><strong>Pés:</strong></td></tr>
                <tr><td>Altura:</td><td><strong>${currentFootHeight} cm</strong></td></tr>
                <tr><td>Espessura:</td><td><strong>${currentThickness} mm</strong></td></tr>
            </table>
        `;
    } else {
        const hasMainSpecs = currentHeight || currentWidth || currentDepth ||
            currentCapacity || currentThickness || currentLength ||
            currentDiameter || currentVoltage;

        if (hasMainSpecs) {
            mainSpecsHTML = `
                <table class="specs-table">
                    ${currentHeight && !currentFootHeight ? `<tr><td>Altura:</td><td><strong>${currentHeight} cm</strong></td></tr>` : ''}
                    ${currentDiameter ? `<tr><td>Diâmetro:</td><td><strong>${currentDiameter} cm</strong></td></tr>` : ''}
                    ${currentWidth ? `<tr><td>Largura:</td><td><strong>${currentWidth} cm</strong></td></tr>` : ''}
                    ${currentDepth && currentDepth > 0 ? `<tr><td>Profundidade:</td><td><strong>${currentDepth} cm</strong></td></tr>` : ''}
                    ${currentLength ? `<tr><td>Comprimento:</td><td><strong>${currentLength} cm</strong></td></tr>` : ''}
                    ${currentThickness ? `<tr><td>Espessura:</td><td><strong>${currentThickness} mm</strong></td></tr>` : ''}
                    ${currentCapacity && currentCapacity > 0 ? `<tr><td>Capacidade:</td><td><strong>${currentCapacity} unidades</strong></td></tr>` : ''}
                    ${currentFootHeight ? `<tr><td>Altura dos pés:</td><td><strong>${currentFootHeight} cm</strong></td></tr>` : ''}
                    ${currentVoltage ? `<tr><td>Voltagem:</td><td><strong>${currentVoltage}</strong></td></tr>` : ''}
                </table>
            `;
        }
    }

    // ADICIONAR ESPECIFICAÇÕES CUSTOMIZADAS
    if (currentCustomSpecs && Array.isArray(currentCustomSpecs) && currentCustomSpecs.length > 0) {
        mainSpecsHTML += `
            <table class="specs-table">
                ${currentCustomSpecs.map(spec => `
                    <tr>
                        <td>${spec.label}:</td>
                        <td><strong>${spec.value}${spec.unit || ''}</strong></td>
                    </tr>
                `).join('')}
            </table>
        `;
    }

    // Gerar peças do kit atualizadas
    let kitPiecesHTML = '';
    if (currentKitPieces && currentKitPieces.length > 0) {
        kitPiecesHTML = createKitPiecesHTML(currentKitPieces);
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

// CONFIGURAÇÃO DO WHATSAPP
const WHATSAPP_NUMBER = '5511943510247';

// FUNÇÃO PARA LIDAR COM CLIQUE NO BOTÃO WHATSAPP
function handleWhatsAppClick(productId) {
    // Criar link do WhatsApp SEM mensagem
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}`;
    
    // Abrir WhatsApp em nova aba
    window.open(whatsappURL, '_blank');
}
