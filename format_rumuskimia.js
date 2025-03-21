document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        document.querySelectorAll('p, li').forEach(function(paragraph) {
            if (paragraph.closest('#calx, [data-calx], .calx-sheet, .calx-form, input[data-cell]')) return;

            var text = paragraph.textContent;
            if (text.includes('\\')) {
                var formattedText = text.replace(/\\(.*?)\\/g, function(match, formula) {
                    var result = '';
                    for (var i = 0; i < formula.length; i++) {
                        if (/\d/.test(formula[i]) && i > 0 && formula[i-1] !== '.') {
                            result += '<sub>' + formula[i] + '</sub>';
                        } else if (formula[i] === '<' && i + 2 < formula.length && formula[i + 1] === '=' && formula[i + 2] === '>') {
                            result += '\u21CC'; // Panah ⇌
                            i += 2;
                        } else if (formula[i] === '(' && i + 1 < formula.length) {
                            var j = i + 1;
                            var state = '';
                            while (j < formula.length && formula[j] !== ')') {
                                state += formula[j];
                                j++;
                            }
                            if (j < formula.length && formula[j] === ')') {
                                // Hanya format italik untuk wujud zat: (s), (l), (g), (aq)
                                if (state === 's' || state === 'l' || state === 'g' || state === 'aq') {
                                    result += '<i>(' + state + ')</i>';
                                } else {
                                    result += '(' + state + ')'; // Teks normal untuk kurung lain
                                }
                                i = j;
                            } else {
                                result += formula[i];
                            }
                        } else if (formula[i] === '^' && i + 1 < formula.length && /[+-]/.test(formula[i + 1])) {
                            var chargeChar = formula[i + 1];
                            var chargeNumber = '';
                            var j = i + 2;
                            while (j < formula.length && /\d/.test(formula[j])) {
                                chargeNumber += formula[j];
                                j++;
                            }
                            if (chargeNumber) {
                                result += '<sup>' + chargeChar + chargeNumber + '</sup>';
                            } else {
                                result += '<sup>' + chargeChar + '</sup>';
                            }
                            i = j - 1;
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
