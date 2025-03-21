document.addEventListener('DOMContentLoaded', function() {
    console.log('Script rumus kimia dimuat');
    setTimeout(function() {
        console.log('Mulai pemrosesan');
        document.querySelectorAll('p, li').forEach(function(paragraph) {
            if (paragraph.classList.contains('MathJax') || paragraph.querySelector('.MathJax') || paragraph.querySelector('script[type^="math"]')) {
                console.log('Lewati MathJax: ', paragraph.textContent);
                return;
            }
            if (paragraph.closest('#calx, [data-calx], .calx-sheet, .calx-form, input[data-cell]')) {
                console.log('Lewati Calx: ', paragraph.textContent);
                return;
            }

            var text = paragraph.textContent;
            if (text.includes('\\')) {
                var formattedText = text.replace(/\\(.*?)\\/g, function(match, formula) {
                    var result = '';
                    var i = 0;
                    while (i < formula.length) {
                        if (formula[i] === '<' && i + 2 < formula.length && formula[i + 1] === '=' && formula[i + 2] === '>') {
                            result += '\u21CC';
                            i += 3;
                        } else if (formula[i] === '^' && i + 1 < formula.length) {
                            var charge = '';
                            var j = i + 1;
                            if (formula[j] === '(') {
                                j++;
                                while (j < formula.length && formula[j] !== ')') {
                                    charge += formula[j];
                                    j++;
                                }
                                if (j < formula.length) j++;
                            } else {
                                while (j < formula.length && /[0-9+-]/.test(formula[j])) {
                                    charge += formula[j];
                                    j++;
                                }
                            }
                            if (charge) {
                                var chargeNumber = charge.match(/\d+/) ? charge.match(/\d+/)[0] : '';
                                var chargeSign = charge.match(/[+-]/) ? charge.match(/[+-]/)[0] : '';
                                result += '<sup>' + (chargeNumber || '') + (chargeSign || '') + '</sup>';
                                i = j;
                            } else {
                                result += formula[i];
                                i++;
                            }
                        } else if (formula[i] === '[' && i + 1 < formula.length) {
                            var j = i + 1;
                            var complex = '';
                            while (j < formula.length && formula[j] !== ']') {
                                complex += formula[j];
                                j++;
                            }
                            if (j < formula.length) {
                                var subResult = '';
                                for (var k = 0; k < complex.length; k++) {
                                    if (/\d/.test(complex[k]) && k > 0 && /[A-Za-z)]/.test(complex[k-1])) {
                                        subResult += '<sub>' + complex[k] + '</sub>';
                                    } else if (complex[k] === 'l') {
                                        subResult += '\u2113';
                                    } else {
                                        subResult += complex[k];
                                    }
                                }
                                result += '[' + subResult + ']';
                                i = j + 1;
                                if (i < formula.length) {
                                    var charge = '';
                                    while (i < formula.length && /[0-9+-]/.test(formula[i])) {
                                        charge += formula[i];
                                        i++;
                                    }
                                    if (charge) result += '<sup>' + charge + '</sup>';
                                }
                            } else {
                                result += formula[i];
                                i++;
                            }
                        } else if (formula[i] === '(' && i + 1 < formula.length) {
                            var j = i + 1;
                            var state = '';
                            while (j < formula.length && formula[j] !== ')') {
                                state += formula[j];
                                j++;
                            }
                            if (j < formula.length) {
                                if (state === 's' || state === 'l' || state === 'g' || state === 'aq') {
                                    result += '<i>(' + state.replace('l', '\u2113') + ')</i>';
                                } else {
                                    var subResult = '';
                                    for (var k = 0; k < state.length; k++) {
                                        if (/\d/.test(state[k]) && k > 0 && /[A-Za-z]/.test(state[k-1])) {
                                            subResult += '<sub>' + state[k] + '</sub>';
                                        } else if (state[k] === 'l') {
                                            subResult += '\u2113';
                                        } else {
                                            subResult += state[k];
                                        }
                                    }
                                    result += '(' + subResult + ')';
                                }
                                i = j + 1;
                            } else {
                                result += formula[i];
                                i++;
                            }
                        } else if (/\d/.test(formula[i]) && i > 0 && /[A-Za-z)]/.test(formula[i-1])) {
                            result += '<sub>' + formula[i] + '</sub>';
                            i++;
                        } else if (formula[i] === 'l') {
                            result += '\u2113';
                            i++;
                        } else {
                            result += formula[i];
                            i++;
                        }
                    }
                    return '<span style="font-family: \'Times New Roman\', serif; font-size: 13pt;" class="chem-formula">' + result + '</span>';
                });
                paragraph.innerHTML = formattedText;
                console.log('Hasil: ', paragraph.innerHTML);
            }
        });
        if (typeof MathJax !== 'undefined') {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            console.log('MathJax re-render');
        }
    }, 500);
});
