// Selecionar elementos
const mainVideo = document.querySelector('.main-video');
const playPauseBtn = document.querySelector('.play-pause-btn');
const pauseIcon = document.querySelector('.pause-icon');
const playIcon = document.querySelector('.play-icon');
const thumbnails = document.querySelectorAll('.thumbnail');
const videoBadge = document.querySelector('.video-badge');

// Estado do vídeo
let isVideoPlaying = true;

// Play/Pause do vídeo
playPauseBtn.addEventListener('click', function() {
    if (isVideoPlaying) {
        mainVideo.pause();
        pauseIcon.style.display = 'none';
        playIcon.style.display = 'block';
    } else {
        mainVideo.play();
        pauseIcon.style.display = 'block';
        playIcon.style.display = 'none';
    }
    isVideoPlaying = !isVideoPlaying;
});

// Trocar mídia ao clicar nas miniaturas
thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
        const mediaType = this.getAttribute('data-media');
        
        // Remover classe active de todas as miniaturas
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        
        // Adicionar classe active na miniatura clicada
        this.classList.add('active');
        
        // Trocar a mídia principal
        if (mediaType === 'video') {
            // Mostrar vídeo
            mainVideo.style.display = 'block';
            videoBadge.style.display = 'block';
            
            // Reiniciar vídeo se estiver pausado
            if (!isVideoPlaying) {
                mainVideo.play();
                pauseIcon.style.display = 'block';
                playIcon.style.display = 'none';
                isVideoPlaying = true;
            }
        } else {
            // Esconder vídeo e mostrar imagem
            mainVideo.style.display = 'none';
            videoBadge.style.display = 'none';
            
            // Aqui você pode adicionar lógica para trocar a imagem
            // Por enquanto, vamos apenas esconder o vídeo
            console.log('Trocar para imagem:', mediaType);
        }
    });
});

// Controles de teclado para acessibilidade
document.addEventListener('keydown', function(e) {
    if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        playPauseBtn.click();
    }
});

// Pausar vídeo quando não estiver visível na tela (Performance)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting && isVideoPlaying) {
            mainVideo.pause();
            pauseIcon.style.display = 'none';
            playIcon.style.display = 'block';
            isVideoPlaying = false;
        }
    });
}, { threshold: 0.5 });

if (mainVideo) {
    observer.observe(mainVideo);
}

// Efeitos de hover nas miniaturas (melhoria visual)
thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px) scale(1.05)';
    });
    
    thumbnail.addEventListener('mouseleave', function() {
        if (!this.classList.contains('active')) {
            this.style.transform = 'translateY(0) scale(1)';
        }
    });
});

// Preload das imagens para melhor performance
function preloadImages() {
    const imageUrls = [
        'assets/images/thumb-1.jpg',
        'assets/images/thumb-2.jpg', 
        'assets/images/thumb-3.jpg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    preloadImages();
    
    // Garantir que o ícone correto esteja visível
    if (isVideoPlaying) {
        pauseIcon.style.display = 'block';
        playIcon.style.display = 'none';
    }
});

// Função para trocar para imagem específica (para usar depois)
function switchToImage(imageUrl, altText) {
    // Criar elemento de imagem se não existir
    let mainImage = document.querySelector('.main-image');
    
    if (!mainImage) {
        mainImage = document.createElement('img');
        mainImage.className = 'main-image';
        mainImage.style.width = '100%';
        mainImage.style.height = 'auto';
        mainImage.style.display = 'none';
        document.querySelector('.video-container').appendChild(mainImage);
    }
    
    // Trocar para imagem
    mainImage.src = imageUrl;
    mainImage.alt = altText;
    mainImage.style.display = 'block';
    mainVideo.style.display = 'none';
    videoBadge.style.display = 'none';
}

// Função para voltar ao vídeo
function switchToVideo() {
    const mainImage = document.querySelector('.main-image');
    if (mainImage) {
        mainImage.style.display = 'none';
    }
    mainVideo.style.display = 'block';
    videoBadge.style.display = 'block';
    
    if (!isVideoPlaying) {
        mainVideo.play();
        pauseIcon.style.display = 'block';
        playIcon.style.display = 'none';
        isVideoPlaying = true;
    }
}