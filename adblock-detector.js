function detectAdBlock(callback) {
    var adScript = document.createElement("script");
    adScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    adScript.onerror = function() {
        console.log("Resource iklan diblokir (AdBlock aktif)");
        callback(true);
    };
    adScript.onload = function() {
        console.log("Resource iklan dimuat (AdBlock tidak aktif)");
        callback(false);
    };
    document.body.appendChild(adScript);
}

var adBlockMessage = null;
var adBlockStatus = null;
function updateAdBlockMessage(isAdBlocked) {
    console.log("Status AdBlock: ", isAdBlocked);
    if (adBlockStatus === isAdBlocked) return;
    adBlockStatus = isAdBlocked;

    if (isAdBlocked) {
        if (!adBlockMessage) {
            adBlockMessage = document.createElement("div");
            adBlockMessage.style.position = "fixed";
            adBlockMessage.style.top = "auto";
            adBlockMessage.style.bottom = "20px";
            adBlockMessage.style.left = "50%";
            adBlockMessage.style.transform = "translateX(-50%)";
            adBlockMessage.style.background = "#f8d7da";
            adBlockMessage.style.color = "#721c24";
            adBlockMessage.style.padding = "20px";
            adBlockMessage.style.border = "1px solid #f5c6cb";
            adBlockMessage.style.borderRadius = "5px";
            adBlockMessage.style.zIndex = "1000";
            adBlockMessage.style.fontSize = "18px";
            adBlockMessage.style.textAlign = "center";
            adBlockMessage.style.maxWidth = "90%";
            adBlockMessage.style.boxSizing = "border-box";
            adBlockMessage.style.boxShadow = "rgba(248, 215, 218, 0.9)";
            
            var line1 = document.createElement("div");
            line1.innerText = "Kami mendeteksi Anda menggunakan AdBlock.";
            line1.style.marginBottom = "10px";
            adBlockMessage.appendChild(line1);

            var line2 = document.createElement("div");
            line2.innerText = "Mohon nonaktifkan AdBlock untuk mendukung situs kami.";
            line2.style.marginBottom = "10px";
            adBlockMessage.appendChild(line2);

            var line3 = document.createElement("div");
            line3.innerText = "Iklan membantu kami menjaga situs ini tetap gratis untuk Anda!";
            adBlockMessage.appendChild(line3);

            var styleSheet = document.createElement("style");
            styleSheet.innerText = `
                @media (max-width: 600px) {
                    div#adblock-message {
                        font-size: 14px;
                        padding: 15px;
                        max-width: 100%;
                    }
                }
            `;
            document.head.appendChild(styleSheet);
            adBlockMessage.id = "adblock-message";

            adBlockMessage.style.opacity = "0";
            adBlockMessage.style.transition = "opacity 0.5s ease-in-out";
            document.body.appendChild(adBlockMessage);
            setTimeout(function() {
                adBlockMessage.style.opacity = "1";
            }, 100);

            console.log("Pesan AdBlock ditampilkan");
        }
    } else {
        if (adBlockMessage) {
            adBlockMessage.parentNode.removeChild(adBlockMessage);
            adBlockMessage = null;
            console.log("Pesan AdBlock dihapus");
        }
    }
}

window.onload = function() {
    detectAdBlock(function(isAdBlocked) {
        updateAdBlockMessage(isAdBlocked);
    });

    setInterval(function() {
        detectAdBlock(function(isAdBlocked) {
            updateAdBlockMessage(isAdBlocked);
        });
    }, 10000);
};
