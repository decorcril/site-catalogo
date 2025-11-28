// Carousel Finito - VERSÃO SUPER RÁPIDA
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.categories__track');
    const prevBtn = document.querySelector('.carousel__btn--prev');
    const nextBtn = document.querySelector('.carousel__btn--next');
    const cards = document.querySelectorAll('.category__card');
    
    let currentPosition = 0;
    let cardWidth = 0;
    let gap = 0;
    let visibleCards = 0;
    let maxPosition = 0;
    let isMobile = window.innerWidth <= 768;

    // SUPER RÁPIDO: Transição quase instantânea
    track.style.transition = 'transform 0.2s ease'; // Era 0.3s

    function calculateDimensions() {
        if (cards.length === 0) return;
        
        // Pega dimensões reais do primeiro card
        const firstCard = cards[0];
        const cardStyle = window.getComputedStyle(firstCard);
        cardWidth = firstCard.offsetWidth;
        
        // Pega o gap real
        const trackStyle = window.getComputedStyle(track);
        gap = parseInt(trackStyle.gap) || 25;
        
        // Calcula quantos cards são visíveis
        const containerWidth = track.parentElement.offsetWidth;
        const totalCardWidth = cardWidth + gap;
        visibleCards = Math.floor(containerWidth / totalCardWidth);
        
        // CORREÇÃO: Garante que o último card nunca fique sozinho
        maxPosition = Math.max(0, cards.length - visibleCards);
    }

    function updateCarousel() {
        if (cards.length === 0) return;
        
        const moveDistance = currentPosition * (cardWidth + gap);
        track.style.transform = `translateX(-${moveDistance}px)`;
        
        // Desabilita botões quando chega nos extremos
        const isAtStart = currentPosition === 0;
        const isAtEnd = currentPosition >= maxPosition;
        
        prevBtn.style.opacity = isAtStart ? '0.4' : '1';
        prevBtn.style.cursor = isAtStart ? 'not-allowed' : 'pointer';
        prevBtn.disabled = isAtStart;
        
        nextBtn.style.opacity = isAtEnd ? '0.4' : '1';
        nextBtn.style.cursor = isAtEnd ? 'not-allowed' : 'pointer';
        nextBtn.disabled = isAtEnd;

        // Esconde botões completamente se não forem necessários
        if (maxPosition === 0) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
    }

    function handleResize() {
        isMobile = window.innerWidth <= 768;
        
        // QUASE INSTANTÂNEO: Delay mínimo
        setTimeout(() => {
            calculateDimensions();
            
            // Reset mais inteligente da posição
            if (currentPosition > maxPosition) {
                currentPosition = Math.max(0, maxPosition);
            }
            
            // Se todos os cards cabem na tela, reseta para início
            if (maxPosition === 0) {
                currentPosition = 0;
            }
            
            updateCarousel();
        }, 50); // Era 100ms
    }

    // Event Listeners - resposta imediata
    nextBtn.addEventListener('click', function() {
        if (currentPosition < maxPosition) {
            currentPosition++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', function() {
        if (currentPosition > 0) {
            currentPosition--;
            updateCarousel();
        }
    });

    // Swipe para mobile - MAIS SENSÍVEL
    let startX = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', function(e) {
        if (maxPosition === 0) return;
        startX = e.touches[0].clientX;
        isDragging = true;
        track.style.cursor = 'grabbing';
        // Remove transição durante o drag para resposta imediata
        track.style.transition = 'none';
    });

    track.addEventListener('touchmove', function(e) {
        if (!isDragging || maxPosition === 0) return;
        e.preventDefault();
        
        // Feedback visual em tempo real durante o drag
        const currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        const moveDistance = (currentPosition * (cardWidth + gap)) + (diff * 0.5);
        const maxMove = maxPosition * (cardWidth + gap);
        
        // Limita o movimento
        const limitedMove = Math.max(0, Math.min(moveDistance, maxMove));
        track.style.transform = `translateX(-${limitedMove}px)`;
    });

    track.addEventListener('touchend', function(e) {
        if (!isDragging || maxPosition === 0) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        const swipeThreshold = 30; // Mais sensível (era 50)

        // Restaura transição rápida
        track.style.transition = 'transform 0.2s ease';

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentPosition < maxPosition) {
                currentPosition++;
            } else if (diff < 0 && currentPosition > 0) {
                currentPosition--;
            }
            updateCarousel();
        } else {
            // Se não passou do threshold, volta para posição atual
            updateCarousel();
        }
        isDragging = false;
        track.style.cursor = 'grab';
    });

    // Mouse drag para desktop
    track.addEventListener('mousedown', function(e) {
        if (maxPosition === 0) return;
        startX = e.clientX;
        isDragging = true;
        track.style.cursor = 'grabbing';
        track.style.transition = 'none';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging || maxPosition === 0) return;
        e.preventDefault();
        
        const currentX = e.clientX;
        const diff = startX - currentX;
        const moveDistance = (currentPosition * (cardWidth + gap)) + (diff * 0.5);
        const maxMove = maxPosition * (cardWidth + gap);
        
        const limitedMove = Math.max(0, Math.min(moveDistance, maxMove));
        track.style.transform = `translateX(-${limitedMove}px)`;
    });

    document.addEventListener('mouseup', function(e) {
        if (!isDragging || maxPosition === 0) return;
        
        const endX = e.clientX;
        const diff = startX - endX;
        const swipeThreshold = 30;

        track.style.transition = 'transform 0.2s ease';

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentPosition < maxPosition) {
                currentPosition++;
            } else if (diff < 0 && currentPosition > 0) {
                currentPosition--;
            }
            updateCarousel();
        } else {
            updateCarousel();
        }
        
        isDragging = false;
        track.style.cursor = 'grab';
    });

    // Inicialização
    calculateDimensions();
    updateCarousel();
    
    // Recalcula em redimensionamento - INSTANTÂNEO
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 80); // Era 150ms
    });

    // Recalcula quando as imagens carregarem
    window.addEventListener('load', handleResize);
});