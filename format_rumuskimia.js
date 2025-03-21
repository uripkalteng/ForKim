document.addEventListener('DOMContentLoaded', function() {
    console.log('Script dimuat');
    setTimeout(function() {
        console.log('Mulai pemrosesan');
        document.querySelectorAll('p, li').forEach(function(paragraph) {
            if (paragraph.classList.contains('MathJax') || paragraph.querySelector('.MathJax')) return;
            var text = paragraph.textContent;
            if (text.includes('/')) {
                var formattedText = text.replace(/\/(.*?)\/(?!\/)/g, function(match, formula) {
                    var result = formula;
                    // Ion kompleks: [Al(H2O)2(OH)4]
                    result = result.replace(/\[([^\]]*)\](\d*[+-])?/g, function(match, complex, charge) {
                        var formattedComplex = complex
                            .replace(/(\d)(?=[A-Za-z\(\[]|$)/g, '<sub>$1</sub>')
                            .replace(/l/g, '\u2113');
                        var formattedCharge = charge ? '<sup>' + charge + '</sup>' : '';
                        return '[' + formattedComplex + ']' + formattedCharge;
                    });
                    // Wujud zat: (s), (l), (g), (aq)
                    result = result.replace(/\((s|l|g|aq)\)/g, function(match, state) {
                        return '<i>(' + state.replace('l', '\u2113') + ')</i>';
                    });
                    // Subskrip di luar ion kompleks
                    result = result.replace(/(\d)(?=[A-Za-z\[\(]|$)/g, '<sub>$1</sub>');
                    // Superscript untuk muatan
                    result = result.replace(/\^(\d*[+-])/g, '<sup>$1</sup>');
                    // Ganti l jadi ℓ
                    result = result.replace(/l/g, '\u2113');
                    // Panah
                    result = result.replace(/<=>/g, '\u21CC');
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
