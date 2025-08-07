// Fastloto365.com için Bookmarklet
// Bu kodu tarayıcıda yer imi olarak kaydedin

javascript:(function(){
    console.log('Fastloto365 Auto Filler - Bookmarklet Started');
    
    // Kodu al
    var code = localStorage.getItem('autoLoginCode') || 
               sessionStorage.getItem('autoLoginCode') || 
               prompt('Şifreyi girin:');
    
    if (!code) {
        alert('Şifre bulunamadı!');
        return;
    }
    
    console.log('Code to fill:', code);
    
    // Tüm input alanlarını bul
    var inputs = document.querySelectorAll('input');
    var targetInput = null;
    
    console.log('Found inputs:', inputs.length);
    
    // Görünür input alanını bul
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var rect = input.getBoundingClientRect();
        var style = window.getComputedStyle(input);
        
        if (rect.width > 0 && rect.height > 0 && 
            style.display !== 'none' && 
            style.visibility !== 'hidden' &&
            input.type !== 'hidden' &&
            input.type !== 'submit' &&
            input.type !== 'button' &&
            !input.disabled &&
            !input.readOnly) {
            targetInput = input;
            console.log('Found target input:', input);
            break;
        }
    }
    
    if (targetInput) {
        // Şifreyi yaz
        targetInput.focus();
        targetInput.value = code;
        
        // Event'leri tetikle
        ['input', 'change', 'keyup'].forEach(function(eventType) {
            var event = new Event(eventType, { bubbles: true });
            targetInput.dispatchEvent(event);
        });
        
        console.log('Code filled successfully');
        
        // OK butonunu bul ve tıkla
        setTimeout(function() {
            var buttons = document.querySelectorAll('button, input[type="submit"], input[type="button"]');
            for (var b = 0; b < buttons.length; b++) {
                var btn = buttons[b];
                var btnRect = btn.getBoundingClientRect();
                var btnStyle = window.getComputedStyle(btn);
                
                if (btnRect.width > 0 && btnRect.height > 0 && 
                    btnStyle.display !== 'none' && 
                    btnStyle.visibility !== 'hidden' &&
                    !btn.disabled) {
                    
                    var btnText = btn.textContent || btn.value || '';
                    if (btnText.toLowerCase().includes('ok') || 
                        btnText.toLowerCase().includes('giriş') ||
                        btnText.toLowerCase().includes('enter') ||
                        btn.type === 'submit') {
                        console.log('Clicking button:', btn);
                        btn.click();
                        break;
                    }
                }
            }
        }, 1000);
        
        // localStorage'ı temizle
        localStorage.removeItem('autoLoginCode');
        sessionStorage.removeItem('autoLoginCode');
        
    } else {
        alert('Şifre alanı bulunamadı!');
        console.log('No suitable input field found');
    }
})();