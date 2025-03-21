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
                    var result = formula
                        .replace(/<=>/g, '\u21CC') // Panah ⇌
                        .replace(/l/g, '\u2113') // Ganti l jadi ℓ
                        .replace(/(\d)(?=[A-Za-z\(\[]|$)/g, '<sub>$1</sub>') // Subskrip
                        .replace(/\^(\d*[+-])/g, '<sup>$1</sup>') // Muatan sederhana
                        .replace(/\((s|l|g|aq)\)/g, '<i>($1)</i>'); // Wujud zat
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
