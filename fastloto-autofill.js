// Fastloto365.com için otomatik şifre doldurma scripti
// Bu script müşteri fastloto365.com sayfasına gittiğinde çalışır

(function() {
    'use strict';
    
    console.log('Fastloto AutoFill Script Loaded');
    
    // Otomatik doldurma sistemini başlat
    function initAutoFill() {
        // localStorage'dan kodu al
        var savedCode = localStorage.getItem('autoLoginCode');
        if (savedCode) {
            console.log('Auto code found:', savedCode);
            localStorage.removeItem('autoLoginCode'); // Kodu temizle
            
            // Sayfa yüklendikten sonra otomatik doldur
            setTimeout(function() {
                fillCodeAutomatically(savedCode);
            }, 2000);
        } else {
            console.log('No auto code found');
        }
    }
    
    function fillCodeAutomatically(code) {
        console.log('Attempting to fill code:', code);
        
        // Farklı olası şifre alanı seçicileri
        var selectors = [
            'input[type="text"]',
            'input[type="password"]',
            'input[name*="code"]',
            'input[id*="code"]',
            'input[class*="code"]',
            'input[placeholder*="kod"]',
            'input[placeholder*="code"]',
            '.code-input',
            '#codeInput',
            '#loginCode',
            '#codeFld',
            '#codeFld2',
            '[data-code]',
            'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"])'
        ];
        
        var targetField = null;
        
        // Şifre alanını bul
        for (var i = 0; i < selectors.length; i++) {
            var fields = document.querySelectorAll(selectors[i]);
            for (var j = 0; j < fields.length; j++) {
                var field = fields[j];
                // Görünür ve aktif alanları kontrol et
                var rect = field.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0 && !field.disabled && !field.readOnly) {
                    targetField = field;
                    console.log('Found target field:', field);
                    break;
                }
            }
            if (targetField) break;
        }
        
        if (targetField) {
            // Şifreyi otomatik yaz
            autoTypeCode(targetField, code);
        } else {
            console.log('Target field not found, trying alternative approach...');
            
            // Alternatif yaklaşım: Tüm input alanlarını dene
            setTimeout(function() {
                var allInputs = document.querySelectorAll('input');
                for (var k = 0; k < allInputs.length; k++) {
                    var input = allInputs[k];
                    var rect = input.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0 && 
                        input.type !== 'hidden' && input.type !== 'submit' && 
                        input.type !== 'button' && input.type !== 'checkbox' && 
                        input.type !== 'radio') {
                        console.log('Trying alternative field:', input);
                        autoTypeCode(input, code);
                        break;
                    }
                }
            }, 1000);
        }
    }
    
    function autoTypeCode(inputField, code) {
        console.log('Auto typing code into field:', inputField);
        
        // Müşterinin görmemesi için sayfayı gizle
        var originalVisibility = document.body.style.visibility;
        var originalOpacity = document.body.style.opacity;
        
        // Sayfayı geçici olarak gizle
        document.body.style.visibility = 'hidden';
        document.body.style.opacity = '0';
        
        // Loading overlay oluştur
        var loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'fastloto-autofill-loading';
        loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            z-index: 999999;
            font-family: Arial, sans-serif;
        `;
        loadingOverlay.innerHTML = `
            <div style="text-align: center;">
                <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <div>Giriş yapılıyor, lütfen bekleyin...</div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(loadingOverlay);
        
        setTimeout(function() {
            // Alanı odakla ve temizle
            inputField.focus();
            inputField.click();
            inputField.value = '';
            
            // Şifreyi direkt olarak yaz (karakter karakter değil)
            inputField.value = code;
            
            // Çeşitli event'leri tetikle
            triggerEvents(inputField);
            
            console.log('Code typing completed');
            
            // Yazma tamamlandıktan sonra işlemleri yap
            setTimeout(function() {
                // Final event'leri tetikle
                triggerEvents(inputField);
                
                // Enter tuşuna bas
                var enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true
                });
                inputField.dispatchEvent(enterEvent);
                
                // Submit butonunu bul ve tıkla
                setTimeout(function() {
                    var submitSelectors = [
                        'button[type="submit"]',
                        'input[type="submit"]',
                        'button:contains("OK")',
                        'button:contains("Giriş")',
                        'button:contains("Login")',
                        '.submit-btn',
                        '.login-btn',
                        '#submitBtn',
                        '#loginBtn',
                        'button.ok',
                        'button.enter'
                    ];
                    
                    for (var s = 0; s < submitSelectors.length; s++) {
                        var submitBtn = document.querySelector(submitSelectors[s]);
                        if (submitBtn) {
                            console.log('Clicking submit button:', submitBtn);
                            submitBtn.click();
                            break;
                        }
                    }
                    
                    // İşlem tamamlandıktan sonra sayfayı tekrar göster
                    setTimeout(function() {
                        document.body.style.visibility = originalVisibility;
                        document.body.style.opacity = originalOpacity;
                        
                        // Loading overlay'i kaldır
                        var overlay = document.getElementById('fastloto-autofill-loading');
                        if (overlay) {
                            overlay.remove();
                        }
                    }, 1000);
                    
                }, 400);
            }, 200);
        }, 600); // Biraz bekleme
    }
    
    function triggerEvents(element) {
        // Çeşitli event'leri tetikle
        var events = ['input', 'change', 'keyup', 'blur'];
        events.forEach(function(eventType) {
            var event = new Event(eventType, { bubbles: true, cancelable: true });
            element.dispatchEvent(event);
        });
    }
    
    // Sayfa yüklendiğinde başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoFill);
    } else {
        initAutoFill();
    }
    
    // Sayfa tamamen yüklendiğinde de kontrol et
    window.addEventListener('load', function() {
        setTimeout(initAutoFill, 1000);
    });
    
    // Dinamik içerik için MutationObserver
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Yeni elementler eklendiyse tekrar kontrol et
                setTimeout(function() {
                    var savedCode = localStorage.getItem('autoLoginCode');
                    if (savedCode) {
                        fillCodeAutomatically(savedCode);
                    }
                }, 500);
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();