document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        document.querySelectorAll('p, li').forEach(function(paragraph) {
            if (paragraph.closest('#calx, [data-calx], .calx-sheet, .calx-form, input[data-cell]')) return;

            var text = paragraph.textContent;
            if (text.includes('\\')) {
                var formattedText = text.replace(/\\(.*?)\\/g, function(match, formula) {
                    var result = '';
                    var i = 0;
                    while (i < formula.length) {
                        if (formula[i] === '<' && i + 2 < formula.length && formula[i + 1] === '=' && formula[i + 2] === '>') {
                            result += '\u21CC'; // Panah ⇌
                            i += 3;
                        } else if (formula[i] === '^' && i + 1 < formula.length) {
                            // Superscript untuk muatan dalam ^
                            var charge = '';
                            var j = i + 1;
                            if (formula[j] === '(') {
                                j++;
                                while (j < formula.length && formula[j] !== ')') {
                                    charge += formula[j];
                                    j++;
                                }
                                if (j < formula.length && formula[j] === ')') j++;
                            } else {
                                while (j < formula.length && /[0-9+-]/.test(formula[j])) {
                                    charge += formula[j];
                                    j++;
                                }
                            }
                            if (charge) {
                                var chargeNumber = charge.match(/\d+/) ? charge.match(/\d+/)[0] : '';
                                var chargeSign = charge.match(/[+-]/) ? charge.match(/[+-]/)[0] : '';
                                if (chargeNumber && chargeSign) {
                                    result += '<sup>' + chargeNumber + chargeSign + '</sup>';
                                } else if (chargeSign) {
                                    result += '<sup>' + chargeSign + '</sup>';
                                } else if (chargeNumber) {
                                    result += '<sup>' + chargeNumber + '</sup>';
                                }
                                i = j;
                            } else {
                                result += formula[i];
                                i++;
                            }
                        } else if (formula[i] === '[' && i + 1 < formula.length) {
                            // Ion kompleks dengan kurung siku
                            var j = i + 1;
                            var complex = '';
                            while (j < formula.length && formula[j] !== ']') {
                                complex += formula[j];
                                j++;
                            }
                            if (j < formula.length && formula[j] === ']') {
                                var subResult = '';
                                for (var k = 0; k < complex.length; k++) {
                                    if (/\d/.test(complex[k]) && k > 0 && /[A-Za-z)]/.test(complex[k-1])) {
                                        subResult += '<sub>' + complex[k] + '</sub>';
                                    } else {
                                        subResult += complex[k];
                                    }
                                }
                                result += '[' + subResult + ']';
                                i = j + 1;

                                // Cek muatan setelah kurung siku (angka + tanda atau tanda saja)
                                if (i < formula.length) {
                                    var chargeNumber = '';
                                    var chargeSign = '';
                                    if (/\d/.test(formula[i])) {
                                        while (i < formula.length && /\d/.test(formula[i])) {
                                            chargeNumber += formula[i];
                                            i++;
                                        }
                                    }
                                    if (i < formula.length && /[+-]/.test(formula[i])) {
                                        chargeSign = formula[i];
                                        i++;
                                    }
                                    if (chargeNumber && chargeSign) {
                                        result += '<sup>' + chargeNumber + chargeSign + '</sup>';
                                    } else if (chargeSign) {
                                        result += '<sup>' + chargeSign + '</sup>';
                                    } else if (chargeNumber) {
                                        result += '<sup>' + chargeNumber + '</sup>';
                                    }
                                }
                            } else {
                                result += formula[i];
                                i++;
                            }
                        } else if (formula[i] === '(' && i + 1 < formula.length) {
                            // Kurung bulat
                            var j = i + 1;
                            var state = '';
                            while (j < formula.length && formula[j] !== ')') {
                                state += formula[j];
                                j++;
                            }
                            if (j < formula.length && formula[j] === ')') {
                                if (state === 's' || state === 'l' || state === 'g' || state === 'aq') {
                                    result += '<i>(' + state + ')</i>';
                                } else {
                                    var subResult = '';
                                    for (var k = 0; k < state.length; k++) {
                                        if (/\d/.test(state[k]) && k > 0 && /[A-Za-z]/.test(state[k-1])) {
                                            subResult += '<sub>' + state[k] + '</sub>';
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
                            // Subskrip setelah huruf atau kurung tutup
                            result += '<sub>' + formula[i] + '</sub>';
                            i++;
                        } else {
                            result += formula[i];
                            i++;
                        }
                    }
                    return result;
                });
                paragraph.innerHTML = formattedText;
            }
        });
    }, 500);
});
