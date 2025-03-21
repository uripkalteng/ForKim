// Daftar lambang unsur kimia (sama seperti sebelumnya)
const elements = new Set([...]); // Isi sama

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
            formattedFormula += '↔';
            i += 2;
        } else {
            formattedFormula += char;
        }
        i++;
    }
    return formattedFormula;
}

function formatChemicalFormulasInText() {
    const paragraphs = document.querySelectorAll('.post-body, .post-body p, .post-body li, p, li');
    paragraphs.forEach(paragraph => {
        let text = paragraph.textContent;
        if (text.includes('\\')) {
            const newHTML = text.replace(/\\(.*?)\\/g, (match, formula) => {
                return formatChemicalFormula(formula);
            });
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newHTML;
            while (paragraph.firstChild) {
                paragraph.removeChild(paragraph.firstChild);
            }
            while (tempDiv.firstChild) {
                paragraph.appendChild(tempDiv.firstChild);
            }
        }
    });
}

function initFormatting() {
    formatChemicalFormulasInText();
    setTimeout(formatChemicalFormulasInText, 1000);
}

document.addEventListener('DOMContentLoaded', initFormatting);
initFormatting();
