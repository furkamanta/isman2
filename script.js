// Kral Kazino - Ana JavaScript Dosyası

document.addEventListener('DOMContentLoaded', function() {
    
    // WhatsApp bağlantısı işlevselliği
    const whatsappBtn = document.getElementById('whatsapp-main');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const message = encodeURIComponent('Salam, Men IveriaKazino-da balans artirmaq isteyirem.');
            const phoneNumber = '+79585001517';
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            
            // Yeni pencerede aç
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            
            // Analytics için (isteğe bağlı)
            console.log('WhatsApp bağlantısına tıklandı');
        });
    }
    
    // Oyun kodu input işlevselliği
    const gameCodeInput = document.getElementById('game-code');
    if (gameCodeInput) {
        gameCodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const code = this.value.trim();
                if (code) {
                    handleGameCode(code);
                } else {
                    showNotification('Lütfen geçerli bir oyun kodu girin!', 'error');
                }
            }
        });
        
        // Input focus efektleri
        gameCodeInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        gameCodeInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    }
    
    // Logo yükleme kontrolü
    const mainLogo = document.getElementById('main-logo');
    if (mainLogo) {
        mainLogo.addEventListener('error', function() {
            console.log('Logo yüklenemedi, alternatif gösterim yapılıyor');
            this.style.display = 'none';
            
            // Alternatif logo metni oluştur
            const logoDiv = this.parentElement;
            logoDiv.innerHTML = '<h1 style="color: #4CAF50; font-size: 2.5em; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">KRAL KAZİNO</h1>';
        });
        
        mainLogo.addEventListener('load', function() {
            console.log('Logo başarıyla yüklendi');
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        });
    }
    
    // Diğer bağlantılar için işlevsellik
    const fostlotoLink = document.getElementById('fostloto-link');
    const chcplayLink = document.getElementById('chcplay-link');
    
    if (fostlotoLink) {
        fostlotoLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Fostloto bağlantısı yakında aktif olacak!', 'info');
        });
    }
    
    if (chcplayLink) {
        chcplayLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Chcplay1 bağlantısı yakında aktif olacak!', 'info');
        });
    }
    
    // Responsive menü kontrolü
    handleResponsiveLayout();
    window.addEventListener('resize', handleResponsiveLayout);
    
    // Sayfa yüklenme animasyonları
    initializeAnimations();
    
    // Klavye kısayolları
    document.addEventListener('keydown', function(e) {
        // Ctrl + Enter ile WhatsApp aç
        if (e.ctrlKey && e.key === 'Enter') {
            if (whatsappBtn) {
                whatsappBtn.click();
            }
        }
        
        // Escape ile input temizle
        if (e.key === 'Escape' && gameCodeInput) {
            gameCodeInput.value = '';
            gameCodeInput.blur();
        }
    });
});

// Oyun kodu işleme fonksiyonu
function handleGameCode(code) {
    // Kod formatını kontrol et (örnek: en az 6 karakter)
    if (code.length < 6) {
        showNotification('Oyun kodu en az 6 karakter olmalıdır!', 'error');
        return;
    }
    
    // Loading göster
    showLoading(true);
    
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
        showLoading(false);
        
        // Rastgele başarı/başarısızlık simülasyonu
        const isSuccess = Math.random() > 0.3;
        
        if (isSuccess) {
            showNotification(`Oyun kodu "${code}" başarıyla doğrulandı!`, 'success');
            // Burada gerçek API çağrısı yapılabilir
            console.log('Kod doğrulandı:', code);
        } else {
            showNotification('Geçersiz oyun kodu! Lütfen tekrar deneyin.', 'error');
        }
    }, 2000);
}

// Bildirim gösterme fonksiyonu
function showNotification(message, type = 'info') {
    // Mevcut bildirimleri temizle
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Stil ekle
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Tip bazlı renkler
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            notification.style.backgroundColor = '#f44336';
            break;
        case 'info':
            notification.style.backgroundColor = '#2196F3';
            break;
        default:
            notification.style.backgroundColor = '#666';
    }
    
    document.body.appendChild(notification);
    
    // 3 saniye sonra kaldır
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Loading gösterme/gizleme
function showLoading(show) {
    const loadingSection = document.querySelector('.loading-section');
    if (loadingSection) {
        if (show) {
            loadingSection.innerHTML = '<div class="spinner"></div>Kod doğrulanıyor...';
            loadingSection.style.display = 'block';
        } else {
            loadingSection.innerHTML = 'Loading of image files';
        }
    }
}

// Responsive layout kontrolü
function handleResponsiveLayout() {
    const container = document.querySelector('.container');
    const isMobile = window.innerWidth < 768;
    
    if (container) {
        if (isMobile) {
            container.style.padding = '15px';
            container.style.margin = '10px';
        } else {
            container.style.padding = '20px';
            container.style.margin = '0 auto';
        }
    }
    
    // Mobil menü düzenlemeleri
    const linksSection = document.querySelector('.links-section');
    if (linksSection && isMobile) {
        const links = linksSection.querySelectorAll('a');
        links.forEach(link => {
            link.style.display = 'block';
            link.style.margin = '10px auto';
            link.style.maxWidth = '200px';
        });
    }
}

// Animasyon başlatma
function initializeAnimations() {
    // CSS animasyonları için gerekli stil eklemeleri
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(76, 175, 80, 0.3);
            border-radius: 50%;
            border-top-color: #4CAF50;
            animation: spin 1s ease-in-out infinite;
            margin-right: 10px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .focused {
            transform: scale(1.02);
            transition: transform 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Sayfa kapatılırken uyarı (isteğe bağlı)
window.addEventListener('beforeunload', function(e) {
    const gameCodeInput = document.getElementById('game-code');
    if (gameCodeInput && gameCodeInput.value.trim()) {
        e.preventDefault();
        e.returnValue = 'Girilen oyun kodu kaybolacak. Sayfayı kapatmak istediğinizden emin misiniz?';
    }
});

// Konsol mesajları (geliştirme için)
console.log('🎰 Kral Kazino sistemi başlatıldı');
console.log('📱 Responsive tasarım aktif');
console.log('🔧 Tüm işlevler yüklendi');