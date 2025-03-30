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
            Object.assign(adBlockMessage.style, {
                position: "fixed",
                top: "0", // Full-screen mulai dari atas
                left: "0", // Full-screen dari kiri
                width: "90%", // Lebar penuh
                height: "90%", // Tinggi penuh
                background: "rgba(248, 215, 218, 0.95)", // Transparansi dikit biar bold
                color: "#721c24",
                padding: "20px",
                zIndex: "1000",
                fontFamily: "Arial, sans-serif",
                fontSize: "16px",
                textAlign: "center",
                boxSizing: "border-box",
                display: "flex", // Flexbox buat center konten
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                opacity: "0",
                transition: "opacity 0.5s ease-in-out"
            });

            // Konten pesan
            adBlockMessage.innerHTML = `
                <div style="font-weight: bold; font-size: 20px; margin-bottom: 15px;">AdBlock Terdeteksi!</div>
                <div style="font-size: 16px; max-width: 90%; margin-bottom: 20px;">Mohon matikan AdBlock untuk dukung kami. Iklan bantu situs ini tetap gratis buat kamu!</div>
                <button style="padding: 10px 25px; background: #721c24; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Oke, Mengerti</button>
            `;

            adBlockMessage.id = "adblock-message";
            document.body.appendChild(adBlockMessage);

            // Fade-in effect
            setTimeout(() => {
                adBlockMessage.style.opacity = "1";
            }, 100);

            // Event listener buat tombol close
            adBlockMessage.querySelector("button").addEventListener("click", () => {
                adBlockMessage.style.opacity = "0";
                setTimeout(() => {
                    adBlockMessage.remove();
                    adBlockMessage = null;
                }, 500);
            });

            console.log("Pesan AdBlock ditampilkan");
        }
    } else {
        if (adBlockMessage) {
            adBlockMessage.style.opacity = "0";
            setTimeout(() => {
                adBlockMessage.remove();
                adBlockMessage = null;
            }, 500);
            console.log("Pesan AdBlock dihapus");
        }
    }

    // Panggil fungsi responsif setiap kali pesan dibuat
    applyResponsiveStyles();
}

// Media queries buat bedain mobile dan desktop
function applyResponsiveStyles() {
    const width = window.innerWidth;
    if (width <= 600) {
        // Full-screen di mobile
        if (adBlockMessage) {
            Object.assign(adBlockMessage.style, {
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                padding: "15px",
                fontSize: "14px",
                borderRadius: "0", // No radius biar bener-bener full
                boxShadow: "none" // Shadow ga perlu di full-screen
            });
            adBlockMessage.querySelector("div:first-child").style.fontSize = "18px";
            adBlockMessage.querySelector("div:nth-child(2)").style.fontSize = "14px";
            adBlockMessage.querySelector("button").style.fontSize = "14px";
        }
    } else {
        // Compact di desktop
        if (adBlockMessage) {
            Object.assign(adBlockMessage.style, {
                top: "auto",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                maxWidth: "500px",
                height: "auto",
                padding: "15px 20px",
                borderRadius: "8px",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
            });
            adBlockMessage.querySelector("div:first-child").style.fontSize = "20px";
            adBlockMessage.querySelector("div:nth-child(2)").style.fontSize = "16px";
            adBlockMessage.querySelector("button").style.fontSize = "16px";
        }
    }
}

window.onload = function() {
    detectAdBlock(updateAdBlockMessage);
    setInterval(() => detectAdBlock(updateAdBlockMessage), 10000);
    window.addEventListener("resize", applyResponsiveStyles); // Responsif saat resize
};
