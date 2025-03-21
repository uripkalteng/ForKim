// Daftar lambang unsur kimia
const elements = new Set([
    'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar',
    'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr',
    'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe',
    'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu',
    'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn',
    'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr',
    'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'
]);

// Fungsi untuk memformat rumus kimia dan persamaan reaksi
function formatChemicalFormula(input) {
    let formattedFormula = '';
    let i = 0;
    while (i < input.length) {
        let char = input[i];
        if (/[A-Za-z]/.test(char)) {
            let element = char.toUpperCase();
            if (i + 1 < input.length && /[a-z]/.test(input[i + 1])) {
                element += input[i + 1].toLowerCase();
                i++;
            }
            if (elements.has(element)) {
                formattedFormula += element;
            } else {
                formattedFormula += char;
            }
        } else if (/\d/.test(char)) {
            if (i > 0 && input[i - 1] !== '.') {
                formattedFormula += `<sub>${char}</sub>`;
            } else {
                formattedFormula += char;
            }
        } else if (char === '(') {
            let j = i + 1;
            let state = '';
            while (j < input.length && input[j] !== ')') {
                state += input[j];
                j++;
            }
            if (j < input.length && input[j] === ')') {
                formattedFormula += `<i>(${state})</i>`;
                i = j;
            } else {
                formattedFormula += char;
            }
        } else if (char === '^') {
            if (i + 1 < input.length && /[+-]/.test(input[i + 1])) {
                let chargeChar = input[i + 1];
                let chargeNumber = '';
                let j = i + 2;
                while (j < input.length && /\d/.test(input[j])) {
                    chargeNumber += input[j];
                    j++;
                }
                if (chargeNumber) {
                    formattedFormula += `<sup>${chargeChar}${chargeNumber}</sup>`;
                } else {
                    formattedFormula += `<sup>${chargeChar}</sup>`;
                }
                i = j - 1;
            } else {
                formattedFormula += char;
            }
        } else if (char === '<' && i + 2 < input.length && (input[i + 1] === '=' || input[i + 1] === '-') && input[i + 2] === '>') {
            formattedFormula += '&harr;'; // Gunakan entitas HTML untuk ⇌
            i += 2;
        } else {
            formattedFormula += char;
        }
        i++;
    }
    return formattedFormula;
}

// Fungsi untuk memformat teks yang diapit oleh \...\
function formatChemicalFormulasInText() {
    const paragraphs = document.querySelectorAll('.post-body, .post-body p, .post-body li, p, li');
    paragraphs.forEach(paragraph => {
        let html = paragraph.innerHTML;
        if (html.includes('\\')) {
            html = html.replace(/\\(.*?)\\/g, (match, formula) => {
                return formatChemicalFormula(formula);
            });
            paragraph.innerHTML = html;
        }
    });
}

// Jalankan saat DOM siap, dengan interval untuk konten dinamis Blogspot
function initFormatting() {
    formatChemicalFormulasInText();
    setTimeout(formatChemicalFormulasInText, 1000); // Jalankan lagi setelah 1 detik
}

// Eksekusi saat DOM siap dan sebagai fallback
document.addEventListener('DOMContentLoaded', initFormatting);
initFormatting();
