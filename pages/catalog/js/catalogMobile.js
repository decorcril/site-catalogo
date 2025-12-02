// pages/catalog/js/catalog-mobile.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do filtro mobile
    const mobileFilterToggle = document.getElementById('mobileFilterToggle');
    const mobileFilterDropdown = document.getElementById('mobileFilterDropdown');
    const mobileFilterBtns = document.querySelectorAll('.mobile-filter-btn');
    const filterLabel = mobileFilterToggle ? mobileFilterToggle.querySelector('.filter-label') : null;
    const chevronIcon = mobileFilterToggle ? mobileFilterToggle.querySelector('.fa-chevron-down') : null;
    
    // Verificar se estamos em mobile
    const isMobile = window.innerWidth <= 768;
    
    // Só executar se os elementos existirem E estivermos em mobile
    if (!mobileFilterToggle || !mobileFilterDropdown || !isMobile) return;
    
    // Toggle dropdown do filtro mobile
    mobileFilterToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Alternar dropdown
        const isActive = mobileFilterDropdown.classList.toggle('active');
        
        // Rotacionar ícone
        if (chevronIcon) {
            chevronIcon.style.transform = isActive ? 'rotate(180deg)' : 'rotate(0deg)';
            chevronIcon.style.transition = 'transform 0.3s ease';
        }
        
        // Ajustar aria-expanded para acessibilidade
        mobileFilterToggle.setAttribute('aria-expanded', isActive);
    });
    
    // Fechar dropdown ao clicar fora
    document.addEventListener('click', function(e) {
        if (!mobileFilterToggle.contains(e.target) && !mobileFilterDropdown.contains(e.target)) {
            closeMobileFilterDropdown();
        }
    });
    
    // Fechar dropdown ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileFilterDropdown.classList.contains('active')) {
            closeMobileFilterDropdown();
        }
    });
    
    // Aplicar filtro ao clicar em botão mobile
    mobileFilterBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const filter = this.dataset.filter;
            const buttonText = this.textContent.trim();
            
            console.log('Filtro mobile selecionado:', filter);
            
            // Atualizar label do botão
            if (filterLabel) {
                filterLabel.textContent = buttonText;
            }
            
            // Fechar dropdown
            closeMobileFilterDropdown();
            
            // Marcar botão como ativo
            mobileFilterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Chamar a função global de filtro (se existir)
            if (typeof window.applyFilter === 'function') {
                window.applyFilter(filter);
            } else {
                // Fallback: aplicar filtro diretamente
                applyFilterDirectly(filter);
            }
        });
    });
    
    // Função para fechar dropdown mobile
    function closeMobileFilterDropdown() {
        mobileFilterDropdown.classList.remove('active');
        
        if (chevronIcon) {
            chevronIcon.style.transform = 'rotate(0deg)';
        }
        
        mobileFilterToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Função fallback para aplicar filtro diretamente
    function applyFilterDirectly(filterValue) {
        const productCards = document.querySelectorAll('.catalog-card');
        const allDesktopFilterBtns = document.querySelectorAll('.filter-btn');
        
        // Atualizar botões desktop
        allDesktopFilterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filterValue);
        });
        
        // Filtrar produtos
        productCards.forEach(card => {
            if (filterValue === 'all' || card.dataset.category === filterValue) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 10);
            } else {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 150);
            }
        });
        
        // Atualizar URL (opcional)
        if (!window.location.search.includes('filter=' + filterValue)) {
            const newUrl = window.location.pathname + '?filter=' + filterValue;
            window.history.pushState({ filter: filterValue }, '', newUrl);
        }
    }
    
    // Verificar filtro da URL ao carregar (para mobile)
    function checkUrlFilterForMobile() {
        const urlParams = new URLSearchParams(window.location.search);
        const filterFromUrl = urlParams.get('filter');
        
        if (filterFromUrl) {
            // Encontrar o botão mobile correspondente
            const correspondingBtn = Array.from(mobileFilterBtns).find(btn => 
                btn.dataset.filter === filterFromUrl
            );
            
            if (correspondingBtn) {
                // Atualizar label
                if (filterLabel) {
                    filterLabel.textContent = correspondingBtn.textContent.trim();
                }
                
                // Marcar botão como ativo
                mobileFilterBtns.forEach(b => b.classList.remove('active'));
                correspondingBtn.classList.add('active');
            }
        }
    }
    
    // Executar verificação
    checkUrlFilterForMobile();
    
    // Adicionar acessibilidade
    mobileFilterToggle.setAttribute('role', 'button');
    mobileFilterToggle.setAttribute('aria-haspopup', 'true');
    mobileFilterToggle.setAttribute('aria-expanded', 'false');
    mobileFilterToggle.setAttribute('aria-controls', 'mobileFilterDropdown');
    
    // Suporte a teclado para toggle
    mobileFilterToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            mobileFilterToggle.click();
        }
    });
    
    // Suporte a teclado para dropdown
    mobileFilterDropdown.addEventListener('keydown', function(e) {
        const focusableElements = mobileFilterDropdown.querySelectorAll('button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Tab dentro do dropdown
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    mobileFilterToggle.focus();
                    closeMobileFilterDropdown();
                }
            } else {
                // Tab normal
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    mobileFilterToggle.focus();
                    closeMobileFilterDropdown();
                }
            }
        }
        
        // ESC fecha dropdown
        if (e.key === 'Escape') {
            closeMobileFilterDropdown();
            mobileFilterToggle.focus();
        }
    });
});