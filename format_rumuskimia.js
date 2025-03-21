document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        document.querySelectorAll('p, li').forEach(function(paragraph) {
            if (paragraph.closest('#calx, [data-calx], .calx-sheet, .calx-form, input[data-cell]')) return;

            var text = paragraph.textContent;
            if (text.includes('\\')) {
                var formattedText = text.replace(/\\(.*?)\\/g, function(match, formula) {
                    var result = '';
                    for (var i = 0; i < formula.length; i++) {
                        if (formula[i] === '<' && i + 2 < formula.length && formula[i + 1] === '=' && formula[i + 2] === '>') {
                            result += '\u21CC'; // Panah ⇌
                            i += 2;
                        } else if (formula[i] === '^' && i + 1 < formula.length) {
                            // Tangani superscript untuk muatan (misalnya ^(2-) atau ^2-)
                            var charge = '';
                            var j = i + 1;
                            if (formula[j] === '(') { // Format ^(2-)
                                j++;
                                while (j < formula.length && formula[j] !== ')') {
                                    charge += formula[j];
                                    j++;
                                }
                                if (j < formula.length && formula[j] === ')') {
                                    j++;
                                }
                            } else { // Format ^2-
                                while (j < formula.length && /[0-9+-]/.test(formula[j])) {
                                    charge += formula[j];
                                    j++;
                                }
                            }
                            if (charge) {
                                // Pisahkan angka dan tanda muatan
                                var chargeNumber = charge.match(/\d+/) ? charge.match(/\d+/)[0] : '';
                                var chargeSign = charge.match(/[+-]/) ? charge.match(/[+-]/)[0] : '';
                                if (chargeNumber && chargeSign) {
                                    result += '<sup>' + chargeNumber + chargeSign + '</sup>';
                                } else if (chargeSign) {
                                    result += '<sup>' + chargeSign + '</sup>';
                                } else if (chargeNumber) {
                                    result += '<sup>' + chargeNumber + '</sup>';
                                }
                                i = j - 1;
                            } else {
                                result += formula[i];
                            }
                        } else if (/\d/.test(formula[i]) && i > 0 && /[A-Za-z]/.test(formula[i-1])) {
                            // Subskrip hanya untuk angka setelah huruf
                            result += '<sub>' + formula[i] + '</sub>';
                        } else if (formula[i] === '(' && i + 1 < formula.length) {
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
                                    result += '(' + state + ')';
                                }
                                i = j;
                            } else {
                                result += formula[i];
                            }
                        } else {
                            result += formula[i];
                        }
                    }
                    return result;
                });
                paragraph.innerHTML = formattedText;
            }
        });
    }, 500);
});
