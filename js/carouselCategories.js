// Carousel Finito - COM MOMENTUM (FLING)
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
    
    // Variáveis para momentum
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let animationFrame = null;

    track.style.transition = 'transform 0.2s ease';

    function calculateDimensions() {
        if (cards.length === 0) return;
        
        const firstCard = cards[0];
        cardWidth = firstCard.offsetWidth;
        
        const trackStyle = window.getComputedStyle(track);
        gap = parseInt(trackStyle.gap) || 25;
        
        const containerWidth = track.parentElement.offsetWidth;
        const totalCardWidth = cardWidth + gap;
        visibleCards = Math.floor(containerWidth / totalCardWidth);
        
        maxPosition = Math.max(0, cards.length - visibleCards);
    }

    function updateCarousel(instant = false) {
        if (cards.length === 0) return;
        
        const moveDistance = currentPosition * (cardWidth + gap);
        
        if (instant) {
            track.style.transition = 'none';
            track.style.transform = `translateX(-${moveDistance}px)`;
            // Restaura transição após um frame
            requestAnimationFrame(() => {
                track.style.transition = 'transform 0.2s ease';
            });
        } else {
            track.style.transform = `translateX(-${moveDistance}px)`;
        }
        
        // Atualiza botões
        const isAtStart = currentPosition === 0;
        const isAtEnd = currentPosition >= maxPosition;
        
        prevBtn.style.opacity = isAtStart ? '0.4' : '1';
        prevBtn.style.cursor = isAtStart ? 'not-allowed' : 'pointer';
        prevBtn.disabled = isAtStart;
        
        nextBtn.style.opacity = isAtEnd ? '0.4' : '1';
        nextBtn.style.cursor = isAtEnd ? 'not-allowed' : 'pointer';
        nextBtn.disabled = isAtEnd;

        if (maxPosition === 0) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
    }

    function calculateVelocity(currentX, currentTime) {
        const deltaX = currentX - lastX;
        const deltaTime = currentTime - lastTime;
        
        if (deltaTime > 0) {
            velocity = deltaX / deltaTime;
        }
        
        lastX = currentX;
        lastTime = currentTime;
    }

    function applyMomentum() {
        if (Math.abs(velocity) < 0.1) {
            // Para a animação quando a velocidade é muito baixa
            cancelAnimationFrame(animationFrame);
            snapToNearestCard();
            return;
        }

        // Aplica a velocidade (reduzida por fricção)
        const friction = 0.92;
        velocity *= friction;
        
        // Converte velocidade para movimento
        const movement = velocity * 0.1;
        const moveDistance = (currentPosition * (cardWidth + gap)) + movement;
        
        // Calcula nova posição
        let newPosition = moveDistance / (cardWidth + gap);
        newPosition = Math.max(0, Math.min(newPosition, maxPosition));
        
        // Atualiza visualmente (sem transição para movimento suave)
        track.style.transition = 'none';
        track.style.transform = `translateX(-${newPosition * (cardWidth + gap)}px)`;
        
        // Continua a animação
        animationFrame = requestAnimationFrame(applyMomentum);
        
        // Quando a animação terminar, faz snap para o card mais próximo
        if (Math.abs(velocity) < 0.5) {
            cancelAnimationFrame(animationFrame);
            currentPosition = Math.round(newPosition);
            snapToNearestCard();
        }
    }

    function snapToNearestCard() {
        // Faz snap para o card mais próximo
        const currentMove = parseFloat(track.style.transform.replace('translateX(-', '').replace('px)', '') || '0');
        const currentPos = currentMove / (cardWidth + gap);
        currentPosition = Math.round(currentPos);
        
        // Limita aos limites
        currentPosition = Math.max(0, Math.min(currentPosition, maxPosition));
        
        // Atualiza com transição suave
        track.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        updateCarousel();
    }

    // Event Listeners para touch
    track.addEventListener('touchstart', function(e) {
        if (maxPosition === 0) return;
        
        cancelAnimationFrame(animationFrame);
        startX = e.touches[0].clientX;
        currentX = startX;
        lastX = startX;
        lastTime = performance.now();
        isDragging = true;
        velocity = 0;
        
        track.style.transition = 'none';
        track.style.cursor = 'grabbing';
    });

    track.addEventListener('touchmove', function(e) {
        if (!isDragging || maxPosition === 0) return;
        e.preventDefault();
        
        currentX = e.touches[0].clientX;
        const currentTime = performance.now();
        
        // Calcula velocidade
        calculateVelocity(currentX, currentTime);
        
        // Move o track em tempo real
        const diff = startX - currentX;
        const moveDistance = (currentPosition * (cardWidth + gap)) + diff;
        const maxMove = maxPosition * (cardWidth + gap);
        
        const limitedMove = Math.max(0, Math.min(moveDistance, maxMove));
        track.style.transform = `translateX(-${limitedMove}px)`;
    });

    track.addEventListener('touchend', function(e) {
        if (!isDragging || maxPosition === 0) return;
        
        isDragging = false;
        track.style.cursor = 'grab';
        
        // Se a velocidade for alta o suficiente, aplica momentum
        if (Math.abs(velocity) > 2) {
            applyMomentum();
        } else {
            // Senão, faz snap normal
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            const swipeThreshold = 30;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0 && currentPosition < maxPosition) {
                    currentPosition++;
                } else if (diff < 0 && currentPosition > 0) {
                    currentPosition--;
                }
            }
            snapToNearestCard();
        }
    });

    // Event Listeners para mouse
    track.addEventListener('mousedown', function(e) {
        if (maxPosition === 0) return;
        
        cancelAnimationFrame(animationFrame);
        startX = e.clientX;
        currentX = startX;
        lastX = startX;
        lastTime = performance.now();
        isDragging = true;
        velocity = 0;
        
        track.style.transition = 'none';
        track.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging || maxPosition === 0) return;
        e.preventDefault();
        
        currentX = e.clientX;
        const currentTime = performance.now();
        
        calculateVelocity(currentX, currentTime);
        
        const diff = startX - currentX;
        const moveDistance = (currentPosition * (cardWidth + gap)) + diff;
        const maxMove = maxPosition * (cardWidth + gap);
        
        const limitedMove = Math.max(0, Math.min(moveDistance, maxMove));
        track.style.transform = `translateX(-${limitedMove}px)`;
    });

    document.addEventListener('mouseup', function(e) {
        if (!isDragging || maxPosition === 0) return;
        
        isDragging = false;
        track.style.cursor = 'grab';
        
        if (Math.abs(velocity) > 2) {
            applyMomentum();
        } else {
            const endX = e.clientX;
            const diff = startX - endX;
            const swipeThreshold = 30;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0 && currentPosition < maxPosition) {
                    currentPosition++;
                } else if (diff < 0 && currentPosition > 0) {
                    currentPosition--;
                }
            }
            snapToNearestCard();
        }
    });

    // Botões normais
    nextBtn.addEventListener('click', function() {
        cancelAnimationFrame(animationFrame);
        if (currentPosition < maxPosition) {
            currentPosition++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', function() {
        cancelAnimationFrame(animationFrame);
        if (currentPosition > 0) {
            currentPosition--;
            updateCarousel();
        }
    });

    function handleResize() {
        setTimeout(() => {
            calculateDimensions();
            
            if (currentPosition > maxPosition) {
                currentPosition = Math.max(0, maxPosition);
            }
            
            if (maxPosition === 0) {
                currentPosition = 0;
            }
            
            updateCarousel(true);
        }, 50);
    }

    // Inicialização
    calculateDimensions();
    updateCarousel();
    
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 80);
    });

    window.addEventListener('load', handleResize);
});