function openProductModal(product) {
    // Gerar especificações principais
    let mainSpecsHTML = '';
    if (product.height || product.width || product.depth || product.capacity || product.thickness) {
        mainSpecsHTML = `
            <table class="specs-table">
                ${product.height ? `<tr><td>Altura:</td><td><strong>${product.height} cm</strong></td></tr>` : ''}
                ${product.width ? `<tr><td>Largura:</td><td><strong>${product.width} cm</strong></td></tr>` : ''}
                ${product.depth && product.depth > 0 ? `<tr><td>Profundidade:</td><td><strong>${product.depth} cm</strong></td></tr>` : ''}
                ${product.length ? `<tr><td>Comprimento:</td><td><strong>${product.length} cm</strong></td></tr>` : ''}
                ${product.thickness ? `<tr><td>Espessura:</td><td><strong>${product.thickness} mm</strong></td></tr>` : ''}
                ${product.capacity && product.capacity > 0 ? `<tr><td>Capacidade:</td><td><strong>${product.capacity} unidades</strong></td></tr>` : ''}
            </table>
        `;
    }
    
    // Gerar peças do kit
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
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Adicionar badge se existir (igual aos cards)
    const badgeHTML = product.badge ? 
        `<div class="modal-badge-container">
            <span class="product-badge ${product.badge.toLowerCase().replace(' ', '-')}">${product.badge}</span>
        </div>` : 
        '';
    
    // Montar modal
    const modalHTML = `
        <div class="product-modal-overlay" id="productModal">
            <div class="product-modal">
                <div class="modal-header">
                    <h3>${product.title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="modal-image">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    
                    <!-- PREÇOS E BADGE -->
                    <div class="modal-price-badge-section">
                        <div class="price-section">
                            <span class="current-price">${product.price}</span>
                            ${product.oldPrice ? `<span class="original-price">${product.oldPrice}</span>` : ''}
                        </div>
                        ${badgeHTML}
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