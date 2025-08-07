// Fastloto365.com Debug Script
// Bu script gerçek sitenin yapısını analiz etmek için kullanılır

(function() {
    'use strict';
    
    console.log('🔍 FASTLOTO365 DEBUG SCRIPT LOADED');
    console.log('Current URL:', window.location.href);
    console.log('User Agent:', navigator.userAgent);
    
    function analyzePageStructure() {
        console.log('=== PAGE STRUCTURE ANALYSIS ===');
        
        // Temel sayfa bilgileri
        console.log('Document title:', document.title);
        console.log('Document ready state:', document.readyState);
        console.log('Body exists:', !!document.body);
        
        if (document.body) {
            console.log('Body innerHTML length:', document.body.innerHTML.length);
            console.log('Body children count:', document.body.children.length);
        }
        
        // Tüm input elementlerini analiz et
        var inputs = document.querySelectorAll('input');
        console.log('=== INPUT ELEMENTS (' + inputs.length + ') ===');
        
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            var rect = input.getBoundingClientRect();
            var style = window.getComputedStyle(input);
            
            console.log('Input #' + i + ':', {
                tagName: input.tagName,
                type: input.type,
                id: input.id,
                className: input.className,
                name: input.name,
                placeholder: input.placeholder,
                value: input.value,
                disabled: input.disabled,
                readOnly: input.readOnly,
                required: input.required,
                maxLength: input.maxLength,
                rect: {
                    width: Math.round(rect.width),
                    height: Math.round(rect.height),
                    top: Math.round(rect.top),
                    left: Math.round(rect.left)
                },
                style: {
                    display: style.display,
                    visibility: style.visibility,
                    opacity: style.opacity,
                    position: style.position,
                    zIndex: style.zIndex
                },
                parent: input.parentElement ? input.parentElement.tagName : 'none',
                parentClass: input.parentElement ? input.parentElement.className : 'none'
            });
        }
        
        // Tüm button elementlerini analiz et
        var buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
        console.log('=== BUTTON ELEMENTS (' + buttons.length + ') ===');
        
        for (var b = 0; b < buttons.length; b++) {
            var button = buttons[b];
            var rect = button.getBoundingClientRect();
            
            console.log('Button #' + b + ':', {
                tagName: button.tagName,
                type: button.type,
                id: button.id,
                className: button.className,
                textContent: button.textContent.trim(),
                innerHTML: button.innerHTML,
                disabled: button.disabled,
                rect: {
                    width: Math.round(rect.width),
                    height: Math.round(rect.height),
                    top: Math.round(rect.top),
                    left: Math.round(rect.left)
                }
            });
        }
        
        // Canvas elementlerini kontrol et
        var canvases = document.querySelectorAll('canvas');
        console.log('=== CANVAS ELEMENTS (' + canvases.length + ') ===');
        
        for (var c = 0; c < canvases.length; c++) {
            var canvas = canvases[c];
            var rect = canvas.getBoundingClientRect();
            
            console.log('Canvas #' + c + ':', {
                id: canvas.id,
                className: canvas.className,
                width: canvas.width,
                height: canvas.height,
                rect: {
                    width: Math.round(rect.width),
                    height: Math.round(rect.height),
                    top: Math.round(rect.top),
                    left: Math.round(rect.left)
                }
            });
        }
        
        // Iframe elementlerini kontrol et
        var iframes = document.querySelectorAll('iframe');
        console.log('=== IFRAME ELEMENTS (' + iframes.length + ') ===');
        
        for (var f = 0; f < iframes.length; f++) {
            var iframe = iframes[f];
            console.log('Iframe #' + f + ':', {
                src: iframe.src,
                id: iframe.id,
                className: iframe.className,
                width: iframe.width,
                height: iframe.height
            });
            
            try {
                var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc) {
                    var iframeInputs = iframeDoc.querySelectorAll('input');
                    console.log('  - Iframe inputs:', iframeInputs.length);
                    
                    for (var ii = 0; ii < iframeInputs.length; ii++) {
                        var iInput = iframeInputs[ii];
                        console.log('    Input #' + ii + ':', {
                            type: iInput.type,
                            id: iInput.id,
                            className: iInput.className,
                            placeholder: iInput.placeholder
                        });
                    }
                }
            } catch (e) {
                console.log('  - Cannot access iframe content:', e.message);
            }
        }
        
        // Tüm form elementlerini kontrol et
        var forms = document.querySelectorAll('form');
        console.log('=== FORM ELEMENTS (' + forms.length + ') ===');
        
        for (var fo = 0; fo < forms.length; fo++) {
            var form = forms[fo];
            console.log('Form #' + fo + ':', {
                id: form.id,
                className: form.className,
                action: form.action,
                method: form.method,
                elements: form.elements.length
            });
        }
        
        // Clickable elementleri bul
        var clickables = document.querySelectorAll('*[onclick], *[onmousedown], *[onmouseup]');
        console.log('=== CLICKABLE ELEMENTS (' + clickables.length + ') ===');
        
        for (var cl = 0; cl < Math.min(clickables.length, 10); cl++) { // İlk 10 tanesini göster
            var clickable = clickables[cl];
            console.log('Clickable #' + cl + ':', {
                tagName: clickable.tagName,
                id: clickable.id,
                className: clickable.className,
                onclick: clickable.onclick ? clickable.onclick.toString().substring(0, 100) : 'none'
            });
        }
        
        // Event listener'ları kontrol et (mümkünse)
        console.log('=== EVENT LISTENERS ===');
        try {
            var allElements = document.querySelectorAll('*');
            var elementsWithEvents = [];
            
            for (var e = 0; e < Math.min(allElements.length, 100); e++) { // İlk 100 elementi kontrol et
                var element = allElements[e];
                if (element._events || element.onclick || element.onmousedown) {
                    elementsWithEvents.push({
                        tagName: element.tagName,
                        id: element.id,
                        className: element.className,
                        hasEvents: true
                    });
                }
            }
            
            console.log('Elements with events:', elementsWithEvents.length);
            console.log('Sample elements with events:', elementsWithEvents.slice(0, 5));
        } catch (e) {
            console.log('Cannot analyze event listeners:', e.message);
        }
        
        // Sayfa içeriğini analiz et
        console.log('=== PAGE CONTENT ANALYSIS ===');
        var bodyText = document.body ? document.body.innerText.toLowerCase() : '';
        var keywords = ['access', 'code', 'login', 'enter', 'password', 'pin', 'key', 'token'];
        var foundKeywords = [];
        
        keywords.forEach(function(keyword) {
            if (bodyText.includes(keyword)) {
                foundKeywords.push(keyword);
            }
        });
        
        console.log('Found keywords:', foundKeywords);
        console.log('Page text length:', bodyText.length);
        console.log('Page text sample:', bodyText.substring(0, 200));
    }
    
    // Sayfa yüklendiğinde analiz et
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(analyzePageStructure, 1000);
        });
    } else {
        setTimeout(analyzePageStructure, 1000);
    }
    
    // Sayfa tamamen yüklendiğinde tekrar analiz et
    window.addEventListener('load', function() {
        setTimeout(function() {
            console.log('=== SECOND ANALYSIS (AFTER FULL LOAD) ===');
            analyzePageStructure();
        }, 2000);
    });
    
    // Dinamik değişiklikleri izle
    var observer = new MutationObserver(function(mutations) {
        var significantChange = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var node = mutation.addedNodes[i];
                    if (node.nodeType === 1 && (node.tagName === 'INPUT' || node.tagName === 'BUTTON' || node.tagName === 'FORM')) {
                        significantChange = true;
                        console.log('🔄 New element added:', node.tagName, node.id, node.className);
                    }
                }
            }
        });
        
        if (significantChange) {
            setTimeout(function() {
                console.log('=== DYNAMIC CONTENT ANALYSIS ===');
                analyzePageStructure();
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
    
    // Manuel test fonksiyonu
    window.testAutoFill = function(code) {
        console.log('🧪 MANUAL TEST - Attempting to fill code:', code);
        
        var inputs = document.querySelectorAll('input');
        console.log('Available inputs:', inputs.length);
        
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            if (input.type !== 'hidden' && input.type !== 'submit' && input.type !== 'button') {
                console.log('Testing input #' + i + ':', input);
                
                try {
                    input.focus();
                    input.value = code;
                    
                    // Event'leri tetikle
                    ['focus', 'input', 'change', 'keyup', 'blur'].forEach(function(eventType) {
                        var event = new Event(eventType, { bubbles: true });
                        input.dispatchEvent(event);
                    });
                    
                    console.log('✓ Successfully filled input #' + i);
                    return true;
                } catch (e) {
                    console.log('❌ Error filling input #' + i + ':', e.message);
                }
            }
        }
        
        return false;
    };
    
    console.log('🔍 Debug script loaded. Use testAutoFill("12345678901234") to test manually.');
    
})();