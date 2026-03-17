// ============================================================
// CONFIGURAÇÃO
// ============================================================

const WHATSAPP_NUMBER = '5511943510247';

/**
 * Mapeamento dinâmico de specs.
 * Para adicionar um novo campo no futuro, basta incluir uma linha aqui.
 * A ordem das entradas define a ordem de exibição na tabela.
 */
const SPEC_MAP = {
  height:    { label: 'Altura',         unit: 'cm',       skipIf: (d) => !!d.footHeight },
  diameter:  { label: 'Diâmetro',       unit: 'cm'        },
  width:     { label: 'Largura',        unit: 'cm'        },
  depth:     { label: 'Profundidade',   unit: 'cm',       skipIfZero: true },
  length:    { label: 'Comprimento',    unit: 'cm'        },
  curvatura: { label: 'Curvatura',      unit: 'cm'        },
  thickness: { label: 'Espessura',      unit: 'mm'        },
  capacity:  { label: 'Capacidade',     unit: 'unidades', skipIfZero: true },
  footHeight:{ label: 'Altura dos pés', unit: 'cm'        },
  voltage:   { label: 'Voltagem',       unit: ''          },
};

// Propriedades copiadas de uma opção para o objeto de dados do modal
const OPTION_PROPS = [
  'price', 'oldPrice', 'image',
  'paymentType', 'installmentPrice',
  ...Object.keys(SPEC_MAP),
];

// ============================================================
// HELPERS DE SPECS
// ============================================================

/**
 * Gera linhas <tr> da tabela de specs a partir de qualquer objeto de dados,
 * usando SPEC_MAP. Totalmente dinâmico — nenhuma prop hardcoded.
 */
function buildSpecRows(source) {
  return Object.entries(SPEC_MAP)
    .filter(([key, cfg]) => {
      const val = source[key];
      if (val === undefined || val === null || val === '') return false;
      if (cfg.skipIfZero && val === 0) return false;
      if (cfg.skipIf && cfg.skipIf(source)) return false;
      return true;
    })
    .map(([key, { label, unit }]) => {
      const display = unit ? `${source[key]} ${unit}`.trim() : source[key];
      return `<tr><td>${label}</td><td><strong>${display}</strong></td></tr>`;
    })
    .join('');
}

/**
 * Detecta se o objeto tem specs de mesa com pés e gera HTML especial,
 * caso contrário gera tabela genérica via buildSpecRows.
 */
function buildMainSpecsHTML(source) {
  // Mesa redonda com pés
  if (source.diameter && source.thickness && source.footHeight) {
    return `
      <table class="specs-table">
        <tr><td colspan="2"><strong>Tampo Redondo:</strong></td></tr>
        <tr><td>Diâmetro:</td><td><strong>${source.diameter} cm</strong></td></tr>
        <tr><td>Espessura:</td><td><strong>${source.thickness} mm</strong></td></tr>
        <tr><td colspan="2"><strong>Pés:</strong></td></tr>
        <tr><td>Altura:</td><td><strong>${source.footHeight} cm</strong></td></tr>
        <tr><td>Espessura:</td><td><strong>${source.thickness} mm</strong></td></tr>
      </table>`;
  }

  // Mesa retangular com pés
  if (source.length && source.width && source.thickness && source.footHeight) {
    return `
      <table class="specs-table">
        <tr><td colspan="2"><strong>Tampo:</strong></td></tr>
        <tr><td>Comprimento:</td><td><strong>${source.length} cm</strong></td></tr>
        <tr><td>Largura:</td><td><strong>${source.width} cm</strong></td></tr>
        <tr><td>Espessura:</td><td><strong>${source.thickness} mm</strong></td></tr>
        <tr><td colspan="2"><strong>Pés:</strong></td></tr>
        <tr><td>Altura:</td><td><strong>${source.footHeight} cm</strong></td></tr>
        <tr><td>Espessura:</td><td><strong>${source.thickness} mm</strong></td></tr>
      </table>`;
  }

  // Caso geral — totalmente dinâmico
  const rows = buildSpecRows(source);
  return rows ? `<table class="specs-table">${rows}</table>` : '';
}

/**
 * Gera tabela de customSpecs (array de { label, value, unit? }).
 */
function buildCustomSpecsHTML(customSpecs) {
  if (!customSpecs?.length) return '';
  const rows = customSpecs
    .map(s => `<tr><td>${s.label}:</td><td><strong>${s.value}${s.unit || ''}</strong></td></tr>`)
    .join('');
  return `<table class="specs-table">${rows}</table>`;
}

/**
 * Gera o bloco completo de specs (tabela + kit + customSpecs).
 * Recebe o objeto de dados mesclado (data) e o produto original.
 */
function buildFullSpecsHTML(data, product) {
  const hasKitPieces = data.kitPieces?.length > 0;

  // Com kitPieces, omite a tabela geral de dimensões
  const mainHTML      = hasKitPieces ? '' : buildMainSpecsHTML(data);
  const kitHTML       = buildKitPiecesHTML(data.kitPieces);
  const customHTML    = buildCustomSpecsHTML(data.customSpecs || product.customSpecs);
  const productCode   = product.productCode
    ? `<div class="product-code"><strong>Código:</strong> ${product.productCode}</div>`
    : '';

  return mainHTML + kitHTML + customHTML + productCode;
}

// ============================================================
// HELPERS DE KIT
// ============================================================

function buildKitPiecesHTML(kitPieces) {
  if (!kitPieces?.length) return '';

  const piecesHTML = kitPieces.map(piece => {
    const isMesaComPes = piece.footHeight && piece.width;

    const specsInner = isMesaComPes
      ? `
        <div class="specs-group">
          <strong>Tampo:</strong><br>
          ${piece.height    ? `<span>Comprimento: <strong>${piece.height} cm</strong></span><br>` : ''}
          ${piece.width     ? `<span>Largura: <strong>${piece.width} cm</strong></span><br>` : ''}
          ${piece.thickness ? `<span>Espessura: <strong>${piece.thickness} mm</strong></span>` : ''}
        </div>
        <div class="specs-group">
          <strong>Pés:</strong><br>
          <span>Altura: <strong>${piece.footHeight} cm</strong></span><br>
          <span>Espessura: <strong>${piece.footThickness || piece.thickness} mm</strong></span>
        </div>`
      : buildSpecRows(piece)
          .split('</tr>')
          .filter(Boolean)
          .map(row => `<span>${row.replace(/<tr><td>/, '').replace(/<\/td><td>/, ': ').replace(/<\/td>$/, '')}</span><br>`)
          .join('');

    return `
      <div class="kit-piece">
        <div class="kit-piece-name">${piece.name}</div>
        <div class="kit-piece-specs">${specsInner}</div>
      </div>`;
  }).join('');

  return `
    <div class="kit-pieces">
      <h5>Peças do Kit (${kitPieces.length})</h5>
      ${piecesHTML}
    </div>`;
}

// ============================================================
// DADOS DO MODAL
// ============================================================

/**
 * Cria o objeto de dados inicial do modal, mesclando produto + opção ativa.
 */
function initializeModalData(product, savedSelections) {
  // Base: propriedades do produto raiz
  const data = {
    price:            product.price,
    oldPrice:         product.oldPrice    || null,
    image:            product.image,
    paymentType:      null,
    installmentPrice: null,
    kitPieces:        product.kitPieces   || [],
    customSpecs:      product.customSpecs || null,
  };

  // Copiar specs do produto raiz
  Object.keys(SPEC_MAP).forEach(key => {
    data[key] = product[key] ?? null;
  });

  // Aplicar opção ativa (salva ou primeira disponível)
  if (product.priceVariations?.length) {
    if (Object.keys(savedSelections).length > 0) {
      product.priceVariations.forEach(variation => {
        const saved  = savedSelections[variation.key];
        const option = saved && variation.options.find(o => o.value === saved.value);
        if (option) applyOptionToData(data, option);
      });
    } else {
      applyOptionToData(data, product.priceVariations[0].options[0]);
    }
  }

  return data;
}

/**
 * Copia todas as propriedades relevantes de uma opção para data.
 */
function applyOptionToData(data, option) {
  if (!option) return;
  OPTION_PROPS.forEach(prop => {
    if (option[prop] !== undefined) data[prop] = option[prop];
  });
  if (option.kitPieces?.length)  data.kitPieces  = option.kitPieces;
  if (option.customSpecs)        data.customSpecs = option.customSpecs;
}

// ============================================================
// HTML DO MODAL
// ============================================================

function createPriceSectionHTML(data, product) {
  const urgencyHTML = product.stock && product.stock <= 5
    ? `<div class="urgency-badge-container"><span class="urgency-badge">ÚLTIMAS PEÇAS</span></div>`
    : '';

  const mainPriceHTML = data.paymentType
    ? `<div class="payment-option-pix">
         <span class="payment-type">${data.paymentType}</span>
         <span class="payment-value" id="dynamicPrice">${data.price}</span>
       </div>`
    : `<div class="simple-price">
         <span class="current-price" id="dynamicPrice">${data.price}</span>
       </div>`;

  const installmentHTML = data.installmentPrice
    ? `<div class="payment-option-installment">
         <span class="payment-label">ou em</span>
         <span class="payment-value" id="dynamicInstallmentPrice">${data.installmentPrice}</span>
         <span class="installment-text">Em até 6x sem juros</span>
       </div>`
    : `<div class="simple-installment-text">Em até 6x sem juros</div>`;

  const oldPriceHTML = data.oldPrice
    ? `<span class="original-price" id="dynamicOldPrice">${data.oldPrice}</span>`
    : '';

  return `
    <div class="price-section">
      ${mainPriceHTML}
      ${installmentHTML}
      ${oldPriceHTML}
      ${urgencyHTML}
    </div>`;
}

function createVariationsHTML(product, savedSelections) {
  if (!product.priceVariations?.length) return '';

  const groups = product.priceVariations.map(variation => {
    const selectedValue = savedSelections[variation.key]?.value ?? variation.options[0].value;

    const buttons = variation.options.map(option => `
      <button
        class="variation-badge modal-variation-badge ${option.value === selectedValue ? 'active' : ''}"
        data-variation-key="${variation.key}"
        data-value="${option.value}"
        data-product-id="${product.id}">
        ${option.label}
      </button>`).join('');

    return `
      <div class="variation-group" data-key="${variation.key}">
        <label class="variation-label">${variation.name}:</label>
        <div class="variation-badges">${buttons}</div>
      </div>`;
  }).join('');

  return `<div class="modal-variations">${groups}</div>`;
}

function createModalHTML(product, data) {
  const specsContent  = buildFullSpecsHTML(data, product);
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
                  <div class="long-description">${product.longDescription}</div>
                </div>` : ''}

              ${specsContent ? `
                <div class="specs-section">
                  <h4>Especificações</h4>
                  ${specsContent}
                </div>` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

// ============================================================
// EVENTOS DO MODAL
// ============================================================

function setupModalEvents(product) {
  const modal = document.getElementById('productModal');
  if (!modal) return;

  // Variações
  modal.querySelectorAll('.modal-variation-badge').forEach(badge => {
    badge.addEventListener('click', () => handleVariationClick(badge, product, modal));
  });

  // WhatsApp
  modal.querySelector('.btn-whatsapp-buy')
    .addEventListener('click', () => handleWhatsAppClick(product));

  // Fechar
  const doClose = () => closeProductModal(product.id, modal);
  modal.querySelector('.close-modal').addEventListener('click', doClose);
  modal.addEventListener('click', e => { if (e.target === modal) doClose(); });

  const onKeyDown = e => {
    if (e.key === 'Escape') { doClose(); document.removeEventListener('keydown', onKeyDown); }
  };
  document.addEventListener('keydown', onKeyDown);
}

function handleVariationClick(badge, product, modal) {
  const productId    = parseInt(badge.dataset.productId);
  const variationKey = badge.dataset.variationKey;
  const selectedValue = badge.dataset.value;

  // Ativar pill clicado
  badge.closest('.variation-group')
    .querySelectorAll('.modal-variation-badge')
    .forEach(b => b.classList.remove('active'));
  badge.classList.add('active');

  // Encontrar a opção completa no produto
  const variation     = product.priceVariations?.find(v => v.key === variationKey);
  const activeOption  = variation?.options.find(o => o.value === selectedValue);
  if (!activeOption) return;

  // Salvar seleção
  window.modalSelections              ??= {};
  window.modalSelections[productId]   ??= {};
  window.modalSelections[productId][variationKey] = { value: selectedValue };

  // Atualizar preço e imagem
  updateModalPriceUI(modal, activeOption);

  // Atualizar specs — remontar dados mesclados e regenerar HTML
  const mergedData = initializeModalData(product, window.modalSelections[productId]);
  updateModalSpecsUI(modal, mergedData, product);
}

// ============================================================
// ATUALIZAÇÃO DINÂMICA DO MODAL
// ============================================================

function updateModalPriceUI(modal, option) {
  // Imagem
  if (option.image) {
    const img = modal.querySelector('#modalMainImage');
    if (img) img.src = option.image;
  }

  // Rebuild da seção de preços (mais simples e consistente)
  const priceSection = modal.querySelector('.price-section');
  if (!priceSection) return;

  const urgencyBadge = priceSection.querySelector('.urgency-badge-container')?.outerHTML || '';

  const mainHTML = option.paymentType
    ? `<div class="payment-option-pix">
         <span class="payment-type">${option.paymentType}</span>
         <span class="payment-value" id="dynamicPrice">${option.price}</span>
       </div>`
    : `<div class="simple-price">
         <span class="current-price" id="dynamicPrice">${option.price}</span>
       </div>`;

  const installmentHTML = option.installmentPrice
    ? `<div class="payment-option-installment">
         <span class="payment-label">ou</span>
         <span class="payment-value">${option.installmentPrice}</span>
         <span class="installment-text">Em até 6x sem juros</span>
       </div>`
    : `<div class="simple-installment-text">Em até 6x sem juros</div>`;

  const oldPriceHTML = option.oldPrice
    ? `<span class="original-price" id="dynamicOldPrice">${option.oldPrice}</span>`
    : '';

  priceSection.innerHTML = mainHTML + installmentHTML + oldPriceHTML + urgencyBadge;
}

function updateModalSpecsUI(modal, data, product) {
  const specsContent = buildFullSpecsHTML(data, product);
  const specsSection = modal.querySelector('.specs-section');

  if (specsSection) {
    specsSection.innerHTML = specsContent
      ? `<h4>Especificações</h4>${specsContent}`
      : '';
    specsSection.style.display = specsContent ? '' : 'none';
  }
}

// ============================================================
// FECHAR MODAL
// ============================================================

function closeProductModal(productId, modal) {
  if (typeof updateCardFromModalSelections === 'function') {
    updateCardFromModalSelections(productId);
  }
  modal?.remove();
}

// ============================================================
// WHATSAPP
// ============================================================

function handleWhatsAppClick(product) {
  const modal = document.getElementById('productModal');
  if (!modal) return;

  const productTitle = modal.querySelector('.modal-header h3')?.textContent || product.title;
  const message      = encodeURIComponent(`Olá! Tenho interesse no produto: ${productTitle}`);
  const url          = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  const newWindow = window.open(url, '_blank');
  // Fallback se popup blocker impedir
  if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
    window.location.href = url;
  }
}

// ============================================================
// PONTO DE ENTRADA
// ============================================================

function openProductModal(product) {
  document.getElementById('productModal')?.remove();

  const savedSelections = window.modalSelections?.[product.id] || {};
  const data            = initializeModalData(product, savedSelections);

  document.body.insertAdjacentHTML('beforeend', createModalHTML(product, data));
  setupModalEvents(product);
}