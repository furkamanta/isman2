// ==UserScript==
// @name         Fastloto365 Auto Code Filler
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Otomatik şifre doldurma sistemi - Gelişmiş versiyon
// @author       You
// @match        https://fastloto365.com/*
// @match        https://*.fastloto365.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('Fastloto365 Auto Code Filler - UserScript Loaded');
    
    // Otomatik doldurma sistemini başlat
    function initAutoFill() {
        console.log('=== Fastloto365 Auto Filler Started ===');
        
        var codeToFill = null;
        
        // 1. localStorage'dan kontrol et
        var localCode = localStorage.getItem('autoLoginCode');
        if (localCode) {
            console.log('Code found in localStorage:', localCode);
            codeToFill = localCode;
            localStorage.removeItem('autoLoginCode');
        }
        
        // 2. sessionStorage'dan kontrol et
        var sessionCode = sessionStorage.getItem('autoLoginCode');
        if (sessionCode) {
            console.log('Code found in sessionStorage:', sessionCode);
            codeToFill = sessionCode;
            sessionStorage.removeItem('autoLoginCode');
        }
        
        // 3. URL parametresinden kontrol et
        var urlParams = new URLSearchParams(window.location.search);
        var encodedCode = urlParams.get('_c');
        if (encodedCode) {
            try {
                var decodedCode = atob(encodedCode);
                console.log('Code found in URL parameter:', decodedCode);
                codeToFill = decodedCode;
            } catch (e) {
                console.log('Error decoding URL parameter:', e);
            }
        }
        
        // 4. Direkt URL parametresi
        var directCode = urlParams.get('autocode');
        if (directCode) {
            console.log('Direct code found in URL:', directCode);
            codeToFill = directCode;
        }
        
        if (codeToFill) {
            console.log('Will attempt to fill code:', codeToFill);
            // Direkt doldurma dene
            return fillCodeAutomatically(codeToFill);
        } else {
            console.log('No code found to fill');
            return false;
        }
    }
    
    function attemptMultipleFills(code) {
        var attempts = 0;
        var maxAttempts = 10;
        
        function tryFill() {
            attempts++;
            console.log('Fill attempt #' + attempts);
            
            if (fillCodeAutomatically(code)) {
                console.log('Code filled successfully on attempt #' + attempts);
                return;
            }
            
            if (attempts < maxAttempts) {
                setTimeout(tryFill, 2000); // Her 2 saniyede bir dene
            } else {
                console.log('Max attempts reached, giving up');
            }
        }
        
        // İlk deneme hemen
        setTimeout(tryFill, 1000);
    }
    
    function fillCodeAutomatically(code) {
        console.log('=== FASTLOTO365 AUTO FILL DEBUG ===');
        console.log('Attempting to fill code:', code);
        console.log('Current URL:', window.location.href);
        console.log('Document ready state:', document.readyState);
        console.log('Page title:', document.title);
        
        // Sayfanın yüklenmesini bekle
        if (document.readyState !== 'complete') {
            console.log('Page not fully loaded, waiting...');
            return false;
        }
        
        // Tüm elementleri logla
        console.log('=== PAGE ANALYSIS ===');
        console.log('Body HTML length:', document.body ? document.body.innerHTML.length : 'No body');
        
        // Tüm input alanlarını bul ve detaylı analiz et
        var allInputs = document.querySelectorAll('input');
        console.log('Found ' + allInputs.length + ' input fields');
        
        var targetField = null;
        var visibleInputs = [];
        
        // Her input alanını detaylı analiz et
        for (var i = 0; i < allInputs.length; i++) {
            var input = allInputs[i];
            var rect = input.getBoundingClientRect();
            var style = window.getComputedStyle(input);
            
            console.log('Input #' + i + ':', {
                element: input,
                type: input.type,
                id: input.id,
                className: input.className,
                name: input.name,
                placeholder: input.placeholder,
                value: input.value,
                disabled: input.disabled,
                readOnly: input.readOnly,
                rect: {width: rect.width, height: rect.height, top: rect.top, left: rect.left},
                style: {display: style.display, visibility: style.visibility, opacity: style.opacity},
                visible: isElementVisible(input)
            });
            
            if (isElementVisible(input) && 
                input.type !== 'hidden' && 
                input.type !== 'submit' && 
                input.type !== 'button' && 
                input.type !== 'checkbox' && 
                input.type !== 'radio' &&
                !input.disabled && 
                !input.readOnly) {
                visibleInputs.push(input);
                console.log('✓ Suitable input found:', input);
            }
        }
        
        console.log('Found ' + visibleInputs.length + ' suitable input fields');
        
        // Eğer input bulunamazsa, tüm sayfayı tara
        if (visibleInputs.length === 0) {
            console.log('=== ALTERNATIVE SEARCH ===');
            
            // Canvas elementlerini kontrol et (bazı siteler canvas kullanır)
            var canvases = document.querySelectorAll('canvas');
            console.log('Found ' + canvases.length + ' canvas elements');
            
            // Tüm clickable elementleri bul
            var clickables = document.querySelectorAll('*[onclick], button, a, div[role="button"]');
            console.log('Found ' + clickables.length + ' clickable elements');
            
            // Iframe kontrol et
            var iframes = document.querySelectorAll('iframe');
            console.log('Found ' + iframes.length + ' iframe elements');
            
            for (var f = 0; f < iframes.length; f++) {
                try {
                    var iframe = iframes[f];
                    console.log('Iframe #' + f + ':', {
                        src: iframe.src,
                        id: iframe.id,
                        className: iframe.className
                    });
                    
                    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (iframeDoc) {
                        var iframeInputs = iframeDoc.querySelectorAll('input');
                        console.log('Found ' + iframeInputs.length + ' inputs in iframe #' + f);
                        
                        for (var ii = 0; ii < iframeInputs.length; ii++) {
                            var iInput = iframeInputs[ii];
                            if (iInput.type !== 'hidden' && iInput.type !== 'submit' && iInput.type !== 'button') {
                                console.log('✓ Using iframe input:', iInput);
                                autoTypeCode(iInput, code);
                                return true;
                            }
                        }
                    }
                } catch (e) {
                    console.log('Cannot access iframe #' + f + ':', e.message);
                }
            }
            
            // Shadow DOM kontrol et
            var shadowHosts = document.querySelectorAll('*');
            var shadowInputs = [];
            for (var s = 0; s < shadowHosts.length; s++) {
                if (shadowHosts[s].shadowRoot) {
                    var shadowInputsInHost = shadowHosts[s].shadowRoot.querySelectorAll('input');
                    shadowInputs = shadowInputs.concat(Array.from(shadowInputsInHost));
                }
            }
            console.log('Found ' + shadowInputs.length + ' inputs in shadow DOM');
            
            if (shadowInputs.length > 0) {
                autoTypeCode(shadowInputs[0], code);
                return true;
            }
        }
        
        if (visibleInputs.length > 0) {
            // İlk görünür input alanını kullan
            targetField = visibleInputs[0];
            console.log('✓ Selected target field:', targetField);
            
            // Şifreyi otomatik yaz
            autoTypeCode(targetField, code);
            return true;
        } else {
            console.log('❌ No suitable input field found anywhere');
            
            // Son çare: Sayfada "input" kelimesi geçen yerleri bul
            var pageText = document.body.innerText.toLowerCase();
            if (pageText.includes('code') || pageText.includes('access') || pageText.includes('login')) {
                console.log('Page contains relevant keywords, but no input found');
                
                // Belki sayfa henüz tam yüklenmemiştir, tekrar dene
                setTimeout(function() {
                    console.log('Retrying after delay...');
                    fillCodeAutomatically(code);
                }, 3000);
            }
            
            return false;
        }
    }
    
    function isElementVisible(element) {
        if (!element) return false;
        var rect = element.getBoundingClientRect();
        var style = window.getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && 
               style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0';
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
        loadingOverlay.id = 'fastloto-loading';
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
                <div>İşlem yapılıyor, lütfen bekleyin...</div>
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
            inputField.scrollIntoView();
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
                    findAndClickSubmitButton();
                    
                    // İşlem tamamlandıktan sonra sayfayı tekrar göster
                    setTimeout(function() {
                        document.body.style.visibility = originalVisibility;
                        document.body.style.opacity = originalOpacity;
                        
                        // Loading overlay'i kaldır
                        var overlay = document.getElementById('fastloto-loading');
                        if (overlay) {
                            overlay.remove();
                        }
                    }, 1000);
                    
                }, 500);
            }, 300);
        }, 800); // Biraz daha uzun bekleme
    }
    
    function findAndClickSubmitButton() {
        var submitSelectors = [
            'button[type="submit"]',
            'input[type="submit"]',
            'button:contains("OK")',
            'button:contains("Giriş")',
            'button:contains("Login")',
            'button:contains("Enter")',
            '.submit-btn',
            '.login-btn',
            '.ok-btn',
            '#submitBtn',
            '#loginBtn',
            '#okBtn',
            'button.ok',
            'button.enter',
            'button.submit'
        ];
        
        for (var s = 0; s < submitSelectors.length; s++) {
            try {
                var submitBtn = document.querySelector(submitSelectors[s]);
                if (submitBtn && isElementVisible(submitBtn)) {
                    console.log('Clicking submit button:', submitBtn);
                    submitBtn.scrollIntoView();
                    submitBtn.focus();
                    submitBtn.click();
                    return;
                }
            } catch (e) {
                console.log('Error with submit selector:', submitSelectors[s], e);
            }
        }
        
        // Eğer buton bulunamazsa, tüm butonları kontrol et
        var allButtons = document.querySelectorAll('button, input[type="button"]');
        for (var b = 0; b < allButtons.length; b++) {
            var btn = allButtons[b];
            if (isElementVisible(btn) && 
                (btn.textContent.toLowerCase().includes('ok') || 
                 btn.textContent.toLowerCase().includes('giriş') ||
                 btn.textContent.toLowerCase().includes('enter') ||
                 btn.textContent.toLowerCase().includes('submit'))) {
                console.log('Clicking found button:', btn);
                btn.click();
                return;
            }
        }
        
        console.log('No submit button found');
    }
    
    function triggerEvents(element) {
        // Çeşitli event'leri tetikle
        var events = [
            { type: 'focus', bubbles: true },
            { type: 'input', bubbles: true },
            { type: 'change', bubbles: true },
            { type: 'keyup', bubbles: true },
            { type: 'blur', bubbles: true }
        ];
        
        events.forEach(function(eventConfig) {
            try {
                var event = new Event(eventConfig.type, eventConfig);
                element.dispatchEvent(event);
            } catch (e) {
                console.log('Error triggering event:', eventConfig.type, e);
            }
        });
    }
    
    // Çoklu deneme sistemi
    var autoFillAttempts = 0;
    var maxAutoFillAttempts = 15; // 15 deneme (yaklaşık 30 saniye)
    
    function scheduleAutoFillAttempts() {
        console.log('Scheduling auto-fill attempts...');
        
        // Hemen bir deneme
        setTimeout(initAutoFill, 500);
        
        // 1 saniye sonra
        setTimeout(initAutoFill, 1000);
        
        // 2 saniye sonra
        setTimeout(initAutoFill, 2000);
        
        // 3 saniye sonra
        setTimeout(initAutoFill, 3000);
        
        // 5 saniye sonra
        setTimeout(initAutoFill, 5000);
        
        // 10 saniye sonra
        setTimeout(initAutoFill, 10000);
        
        // Her 2 saniyede bir 15 kez dene
        var intervalId = setInterval(function() {
            autoFillAttempts++;
            console.log('Auto-fill attempt #' + autoFillAttempts);
            
            var success = initAutoFill();
            if (success || autoFillAttempts >= maxAutoFillAttempts) {
                clearInterval(intervalId);
                if (success) {
                    console.log('✓ Auto-fill successful after ' + autoFillAttempts + ' attempts');
                } else {
                    console.log('❌ Auto-fill failed after ' + autoFillAttempts + ' attempts');
                }
            }
        }, 2000);
    }
    
    // Sayfa yüklendiğinde başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scheduleAutoFillAttempts);
    } else {
        scheduleAutoFillAttempts();
    }
    
    // Sayfa tamamen yüklendiğinde de kontrol et
    window.addEventListener('load', function() {
        setTimeout(scheduleAutoFillAttempts, 1000);
    });
    
    // Dinamik içerik için MutationObserver
    var observer = new MutationObserver(function(mutations) {
        var shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var node = mutation.addedNodes[i];
                    if (node.nodeType === 1 && (node.tagName === 'INPUT' || node.querySelector('input'))) {
                        shouldCheck = true;
                        break;
                    }
                }
            }
        });
        
        if (shouldCheck) {
            setTimeout(function() {
                var savedCode = localStorage.getItem('autoLoginCode');
                if (savedCode) {
                    fillCodeAutomatically(savedCode);
                }
            }, 1000);
        }
    });
    
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    
})();