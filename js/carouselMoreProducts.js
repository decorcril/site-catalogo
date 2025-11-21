// Carousel para "Você também pode gostar" - SCROLL NATIVO
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.related-products__track');
    const prevBtn = document.querySelector('.related-products .carousel__btn--prev');
    const nextBtn = document.querySelector('.related-products .carousel__btn--next');
    const markers = document.querySelectorAll('.scroll-marker');
    
    if (!track || !prevBtn || !nextBtn) return;

    let cardWidth = 0;
    let gap = 0;
    let scrollAmount = 0;

  function calculateDimensions() {
    if (!track.children.length) return;
    
    const firstCard = track.children[0];
    cardWidth = firstCard.offsetWidth;
    
    const trackStyle = window.getComputedStyle(track);
    gap = parseInt(trackStyle.gap) || 30;
    
    // Scroll de 4 cards por vez
    scrollAmount = (cardWidth + gap) * 4;
    
    console.log('Scroll de 4 cards:', scrollAmount);
}
// Botão próximo - scroll exato
nextBtn.addEventListener('click', function() {
    if (this.disabled) return;
    
    track.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
});

// Botão anterior - scroll exato
prevBtn.addEventListener('click', function() {
    if (this.disabled) return;
    
    track.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
    });
});
    function updateButtons() {
        const scrollLeft = track.scrollLeft;
        const maxScroll = track.scrollWidth - track.clientWidth;
        
        // Atualiza botão anterior
        prevBtn.style.opacity = scrollLeft === 0 ? '0.4' : '1';
        prevBtn.style.cursor = scrollLeft === 0 ? 'not-allowed' : 'pointer';
        prevBtn.disabled = scrollLeft === 0;
        
        // Atualiza botão próximo
        nextBtn.style.opacity = scrollLeft >= maxScroll - 5 ? '0.4' : '1'; // -5 para tolerância
        nextBtn.style.cursor = scrollLeft >= maxScroll - 5 ? 'not-allowed' : 'pointer';
        nextBtn.disabled = scrollLeft >= maxScroll - 5;

        // Esconde botões se não for necessário
        if (maxScroll <= 0) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
    }

    

    function updateMarkers() {
        if (!markers.length) return;
        
        const scrollLeft = track.scrollLeft;
        const maxScroll = track.scrollWidth - track.clientWidth;
        const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
        
        // Atualiza marcadores baseado no progresso
        markers.forEach((marker, index) => {
            const markerProgress = index / (markers.length - 1);
            const isActive = Math.abs(progress - markerProgress) < 0.2;
            marker.classList.toggle('active', isActive);
        });
    }

    // Event Listeners para botões
    nextBtn.addEventListener('click', function() {
        if (this.disabled) return;
        
        track.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    prevBtn.addEventListener('click', function() {
        if (this.disabled) return;
        
        track.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    // Event Listeners para scroll
    track.addEventListener('scroll', function() {
        updateButtons();
        updateMarkers();
    });

    // Event Listeners para marcadores (opcional - navegação por clique)
    markers.forEach((marker, index) => {
        marker.addEventListener('click', function() {
            const card = track.children[index];
            if (card) {
                card.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'start'
                });
            }
        });
    });

    // Keyboard navigation
    track.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextBtn.click();
        }
    });

    // Swipe para mobile
    let startX = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    track.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
    });

    track.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        const swipeThreshold = 50;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextBtn.click(); // Swipe esquerda = próximo
            } else {
                prevBtn.click(); // Swipe direita = anterior
            }
        }
        isDragging = false;
    });

    // Mouse drag para desktop
    track.addEventListener('mousedown', function(e) {
        startX = e.clientX;
        isDragging = true;
        track.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
    });

    document.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        
        const endX = e.clientX;
        const diff = startX - endX;
        const swipeThreshold = 50;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextBtn.click();
            } else {
                prevBtn.click();
            }
        }
        
        isDragging = false;
        track.style.cursor = 'grab';
    });

    // Inicialização
    function init() {
        calculateDimensions();
        updateButtons();
        updateMarkers();
        
        // Foca no primeiro elemento para navegação por teclado
        track.setAttribute('tabindex', '0');
    }

    // Recalcula em redimensionamento
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            calculateDimensions();
            updateButtons();
            updateMarkers();
        }, 250);
    });

    // Recalcula quando as imagens carregarem
    window.addEventListener('load', init);

    // Inicializa
    setTimeout(init, 100);
});



// Adiciona este CSS via JavaScript para melhor experiência
const style = document.createElement('style');
style.textContent = `
    .related-products__track {
        cursor: grab;
    }
    
    .related-products__track:active {
        cursor: grabbing;
    }
    
    .related-products__track:focus-visible {
        outline: 2px solid #0058a3;
        outline-offset: 2px;
    }
`;
document.head.appendChild(style);