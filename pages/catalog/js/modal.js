function openProductModal(product) {
    // Gerar especificações principais - AGORA COM VOLTAGEM
    let mainSpecsHTML = '';
    const hasMainSpecs = product.height || product.width || product.depth || product.capacity || product.thickness || product.voltage;
    
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
                                <img src="${product.image}" alt="${product.title}">
                            </div>
                        </div>
                        
                        <!-- COLUNA DAS INFORMAÇÕES -->
                        <div class="modal-info-column">
                            <!-- PREÇOS COM BADGE DE URGÊNCIA -->
                            <div class="price-section">
                                <span class="current-price">${product.price}</span>
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
    
    // Configurar eventos
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