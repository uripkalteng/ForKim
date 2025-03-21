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
            formattedFormula += '↔'; // Entitas HTML untuk ⇌
            console.log('Mengganti <=> atau <-> menjadi ⇌');
            i += 2;
        } else {
            formattedFormula += char;
        }
        i++;
    }
    return formattedFormula;
}

function formatChemicalFormulasInText() {
    // Pilih semua elemen teks yang mungkin berisi rumus, kecuali yang terkait Calx
    document.querySelectorAll('.post-body, .post-body p, .post-body li, p, li').forEach(paragraph => {
        // Lewati elemen yang merupakan bagian dari Calx
        if (paragraph.closest('#calx, [data-calx]')) return;

        let text = paragraph.textContent;
        if (text.includes('\\')) {
            const formattedText = text.replace(/\\(.*?)\\/g, (match, formula) => {
                return formatChemicalFormula(formula);
            });
            // Gunakan DOM untuk mencegah encoding ulang
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = formattedText;
            while (paragraph.firstChild) {
                paragraph.removeChild(paragraph.firstChild);
            }
            while (tempDiv.firstChild) {
                paragraph.appendChild(tempDiv.firstChild);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    formatChemicalFormulasInText();
    setTimeout(formatChemicalFormulasInText, 1000); // Jeda untuk konten dinamis
});
