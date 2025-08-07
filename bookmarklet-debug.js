// Fastloto365.com Debug Bookmarklet
// Bu kodu tarayıcıda yer imi olarak kaydedin

javascript:(function(){
    console.log('🔍 FASTLOTO365 DEBUG BOOKMARKLET');
    
    // Sayfa analizi
    function analyzeCurrentPage() {
        console.log('=== CURRENT PAGE ANALYSIS ===');
        console.log('URL:', window.location.href);
        console.log('Title:', document.title);
        console.log('Ready state:', document.readyState);
        
        // Tüm input alanlarını bul
        var inputs = document.querySelectorAll('input');
        console.log('Input fields found:', inputs.length);
        
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            var rect = input.getBoundingClientRect();
            console.log('Input #' + i + ':', {
                type: input.type,
                id: input.id,
                className: input.className,
                placeholder: input.placeholder,
                visible: rect.width > 0 && rect.height > 0,
                rect: {width: rect.width, height: rect.height}
            });
        }
        
        // Canvas elementlerini kontrol et
        var canvases = document.querySelectorAll('canvas');
        console.log('Canvas elements found:', canvases.length);
        
        for (var c = 0; c < canvases.length; c++) {
            var canvas = canvases[c];
            var rect = canvas.getBoundingClientRect();
            console.log('Canvas #' + c + ':', {
                id: canvas.id,
                className: canvas.className,
                width: canvas.width,
                height: canvas.height,
                rect: {width: rect.width, height: rect.height}
            });
        }
        
        // Iframe kontrol et
        var iframes = document.querySelectorAll('iframe');
        console.log('Iframe elements found:', iframes.length);
        
        // Clickable elementler
        var buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"], *[onclick]');
        console.log('Clickable elements found:', buttons.length);
        
        // Sayfa içeriği
        var bodyText = document.body ? document.body.innerText : '';
        console.log('Page text length:', bodyText.length);
        console.log('Contains "access":', bodyText.toLowerCase().includes('access'));
        console.log('Contains "code":', bodyText.toLowerCase().includes('code'));
        
        return {
            inputs: inputs.length,
            canvases: canvases.length,
            iframes: iframes.length,
            buttons: buttons.length,
            hasText: bodyText.length > 0
        };
    }
    
    // Test fonksiyonu
    function testAutoFill(code) {
        console.log('🧪 Testing auto-fill with code:', code);
        
        // Önce tüm input alanlarını dene
        var inputs = document.querySelectorAll('input');
        var success = false;
        
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            if (input.type !== 'hidden' && input.type !== 'submit' && input.type !== 'button') {
                try {
                    console.log('Trying input #' + i + ':', input);
                    
                    // Focus ve değer atama
                    input.focus();
                    input.click();
                    input.value = code;
                    
                    // Event'leri tetikle
                    var events = ['focus', 'input', 'change', 'keyup', 'blur'];
                    events.forEach(function(eventType) {
                        var event = new Event(eventType, { bubbles: true });
                        input.dispatchEvent(event);
                    });
                    
                    console.log('✓ Successfully filled input #' + i);
                    success = true;
                    
                    // OK butonunu bul ve tıkla
                    setTimeout(function() {
                        var buttons = document.querySelectorAll('button, input[type="submit"]');
                        for (var b = 0; b < buttons.length; b++) {
                            var btn = buttons[b];
                            var btnText = btn.textContent.toLowerCase();
                            if (btnText.includes('ok') || btnText.includes('enter') || btnText.includes('submit')) {
                                console.log('Clicking button:', btn);
                                btn.click();
                                break;
                            }
                        }
                    }, 1000);
                    
                    break;
                } catch (e) {
                    console.log('❌ Error with input #' + i + ':', e.message);
                }
            }
        }
        
        if (!success) {
            console.log('❌ No suitable input found for auto-fill');
            
            // Canvas tabanlı kontrol dene
            var canvases = document.querySelectorAll('canvas');
            if (canvases.length > 0) {
                console.log('🎨 Canvas detected - this might be a canvas-based interface');
                alert('Canvas-based interface detected. Manual interaction may be required.');
            }
        }
        
        return success;
    }
    
    // Ana fonksiyon
    if (window.location.hostname.includes('fastloto365.com')) {
        // Fastloto365 sayfasındayız - analiz yap
        var analysis = analyzeCurrentPage();
        
        // Eğer localStorage'da kod varsa otomatik doldur
        var savedCode = localStorage.getItem('autoLoginCode');
        if (savedCode) {
            console.log('Found saved code:', savedCode);
            localStorage.removeItem('autoLoginCode');
            
            setTimeout(function() {
                testAutoFill(savedCode);
            }, 1000);
        } else {
            // Manuel test için kod iste
            var code = prompt('Enter 14-digit code for testing (or cancel to just analyze):');
            if (code && code.length === 14) {
                testAutoFill(code);
            }
        }
        
        // URL parametresinden kod kontrol et
        var urlParams = new URLSearchParams(window.location.search);
        var encodedCode = urlParams.get('_c');
        if (encodedCode) {
            try {
                var decodedCode = atob(encodedCode);
                console.log('Found URL code:', decodedCode);
                setTimeout(function() {
                    testAutoFill(decodedCode);
                }, 1000);
            } catch (e) {
                console.log('Error decoding URL code:', e);
            }
        }
        
    } else {
        // Başka bir sayfadayız - kod gir ve yönlendir
        var code = prompt('Enter the 14-digit code:');
        if (code && code.length === 14) {
            localStorage.setItem('autoLoginCode', code);
            sessionStorage.setItem('autoLoginCode', code);
            window.location.href = 'https://fastloto365.com/?_c=' + btoa(code);
        } else {
            alert('Please enter a valid 14-digit code');
        }
    }
})();