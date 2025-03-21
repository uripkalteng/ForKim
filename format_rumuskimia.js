document.addEventListener('DOMContentLoaded', function() {
    console.log('Script dimuat');
    setTimeout(function() {
        console.log('Mulai pemrosesan');
        document.querySelectorAll('p, li').forEach(function(paragraph) {
            if (paragraph.classList.contains('MathJax') || paragraph.querySelector('.MathJax') || paragraph.querySelector('script[type^="math"]')) return;
            if (paragraph.closest('#calx, [data-calx], .calx-sheet, .calx-form, input[data-cell]')) return;
            var text = paragraph.textContent;
            if (text.includes('/')) {
                var formattedText = text.replace(/\/(.*?)\/(?!\/)/g, function(match, formula) {
                    var result = formula
                        .replace(/<=>/g, '\u21CC')
                        .replace(/l/g, '\u2113')
                        .replace(/(\d)(?=[A-Za-z\(\[]|$)/g, '<sub>$1</sub>')
                        .replace(/\^(\d*[+-])/g, '<sup>$1</sup>')
                        .replace(/\((s|l|g|aq)\)/g, '<i>($1)</i>');
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
