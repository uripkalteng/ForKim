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
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(248, 215, 218, 0.9)", // Transparansi di sini
                color: "#721c24",
                padding: "15px 20px",
                borderRadius: "8px",
                zIndex: "1000",
                fontFamily: "Arial, sans-serif",
                fontSize: "16px",
                textAlign: "center",
                maxWidth: "500px", // Batas max-width biar ga terlalu lebar di desktop
                width: "90%", // Responsif di mobile
                boxSizing: "border-box",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)", // Shadow lebih halus
                opacity: "0",
                transition: "opacity 0.5s ease-in-out"
            });

            // Konten pesan
            adBlockMessage.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 8px;">AdBlock Terdeteksi!</div>
                <div style="font-size: 14px;">Mohon matikan AdBlock untuk dukung kami. Iklan bantu situs ini tetap gratis buat kamu!</div>
                <button style="margin-top: 10px; padding: 5px 15px; background: #721c24; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Oke, Mengerti</button>
            `;

            adBlockMessage.id = "adblock-message";
            document.body.appendChild(adBlockMessage);

            // Fade-in effect
            setTimeout(() => {
                adBlockMessage.style.opacity = "1"; // Full opacity biar keliatan
            }, 100);

            // Event listener buat tombol close
            adBlockMessage.querySelector("button").addEventListener("click", () => {
                adBlockMessage.style.opacity = "0";
                setTimeout(() => {
                    adBlockMessage.remove();
                    adBlockMessage = null;
                }, 500); // Sinkron sama durasi transisi
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
}

// Media queries langsung di JS biar lebih dinamis
function applyResponsiveStyles() {
    const width = window.innerWidth;
    if (width <= 600) {
        if (adBlockMessage) {
            Object.assign(adBlockMessage.style, {
                fontSize: "14px",
                padding: "10px 15px",
                maxWidth: "100%"
            });
            adBlockMessage.querySelectorAll("div").forEach(el => el.style.fontSize = "12px");
        }
    } else {
        if (adBlockMessage) {
            Object.assign(adBlockMessage.style, {
                fontSize: "16px",
                padding: "15px 20px",
                maxWidth: "500px"
            });
            adBlockMessage.querySelectorAll("div").forEach(el => el.style.fontSize = "14px");
        }
    }
}

window.onload = function() {
    detectAdBlock(updateAdBlockMessage);
    setInterval(() => detectAdBlock(updateAdBlockMessage), 10000);
    window.addEventListener("resize", applyResponsiveStyles); // Responsif saat ukuran layar berubah
};
