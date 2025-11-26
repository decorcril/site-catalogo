// Carrossel para Produtos Relacionados - VERSÃO COMPATÍVEL
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.related-products__grid'); // SEU ELEMENTO
    const prevBtn = document.querySelector('.related-products__nav-btn--prev'); // SEU BOTÃO
    const nextBtn = document.querySelector('.related-products__nav-btn--next'); // SEU BOTÃO
    
    // VERIFICAÇÃO CRÍTICA - se não encontrar, para aqui
    if (!track) {
        console.log('Elemento .related-products__grid não encontrado');
        return;
    }

    console.log('Grid encontrado, cards:', track.children.length);

    let cardWidth = 0;
    let gap = 0;
    let scrollAmount = 0;

    function calculateDimensions() {
        if (!track.children.length) {
            console.log('Nenhum card encontrado no grid');
            return;
        }
        
        const firstCard = track.children[0];
        cardWidth = firstCard.offsetWidth;
        
        const trackStyle = window.getComputedStyle(track);
        gap = parseInt(trackStyle.gap) || 30;
        
        // Scroll de 1 card por vez (mais seguro)
        scrollAmount = (cardWidth + gap);
        
        console.log('Dimensões calculadas:', {
            cardWidth: cardWidth,
            gap: gap,
            scrollAmount: scrollAmount,
            totalCards: track.children.length
        });
    }

    function updateButtons() {
        if (!prevBtn || !nextBtn) return;
        
        const scrollLeft = track.scrollLeft;
        const maxScroll = track.scrollWidth - track.clientWidth;
        
        // Atualiza botão anterior
        prevBtn.style.opacity = scrollLeft <= 10 ? '0.4' : '1';
        prevBtn.style.cursor = scrollLeft <= 10 ? 'not-allowed' : 'pointer';
        prevBtn.disabled = scrollLeft <= 10;
        
        // Atualiza botão próximo
        nextBtn.style.opacity = scrollLeft >= maxScroll - 10 ? '0.4' : '1';
        nextBtn.style.cursor = scrollLeft >= maxScroll - 10 ? 'not-allowed' : 'pointer';
        nextBtn.disabled = scrollLeft >= maxScroll - 10;

        console.log('Scroll position:', {
            scrollLeft: scrollLeft,
            maxScroll: maxScroll,
            prevDisabled: prevBtn.disabled,
            nextDisabled: nextBtn.disabled
        });
    }

    // Botão próximo
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (this.disabled) return;
            
            const newPosition = Math.min(
                track.scrollLeft + scrollAmount,
                track.scrollWidth - track.clientWidth
            );
            
            track.scrollTo({
                left: newPosition,
                behavior: 'smooth'
            });
            
            console.log('Next clicked - scrolling to:', newPosition);
        });
    } else {
        console.log('Botão next não encontrado');
    }

    // Botão anterior
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (this.disabled) return;
            
            const newPosition = Math.max(track.scrollLeft - scrollAmount, 0);
            
            track.scrollTo({
                left: newPosition,
                behavior: 'smooth'
            });
            
            console.log('Prev clicked - scrolling to:', newPosition);
        });
    } else {
        console.log('Botão prev não encontrado');
    }

    // Event listener para scroll
    track.addEventListener('scroll', function() {
        updateButtons();
    });

    // Swipe para mobile (funciona mesmo em desktop)
    let startX = 0;
    let isDragging = false;
    
    track.addEventListener('mousedown', function(e) {
        startX = e.pageX;
        isDragging = true;
        track.style.cursor = 'grabbing';
        track.style.scrollBehavior = 'auto'; // Desativa smooth durante drag
    });

    track.addEventListener('touchstart', function(e) {
        startX = e.touches[0].pageX;
        isDragging = true;
        track.style.scrollBehavior = 'auto';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const x = e.pageX;
        const walk = (x - startX) * 2;
        track.scrollLeft = track.scrollLeft - walk;
        startX = x;
    });

    track.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        const x = e.touches[0].pageX;
        const walk = (x - startX) * 2;
        track.scrollLeft = track.scrollLeft - walk;
        startX = x;
    });

    document.addEventListener('mouseup', function() {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';
        track.style.scrollBehavior = 'smooth';
        updateButtons();
    });

    track.addEventListener('touchend', function() {
        if (!isDragging) return;
        isDragging = false;
        track.style.scrollBehavior = 'smooth';
        updateButtons();
    });

    // Inicialização
    function init() {
        calculateDimensions();
        updateButtons();
        track.style.cursor = 'grab';
        
        console.log('Carrossel inicializado com sucesso');
        console.log('Todos os cards devem estar visíveis agora');
    }

    // Recalcula em redimensionamento
    window.addEventListener('resize', function() {
        setTimeout(() => {
            calculateDimensions();
            updateButtons();
        }, 250);
    });

    // Inicializa quando tudo estiver carregado
    if (document.readyState === 'complete') {
        setTimeout(init, 100);
    } else {
        window.addEventListener('load', function() {
            setTimeout(init, 100);
        });
    }
});