document.addEventListener('DOMContentLoaded', function() {
    console.log('Script dimuat');
    setTimeout(function() {
        console.log('Mulai pemrosesan');
        document.querySelectorAll('p, li').forEach(function(paragraph) {
            if (paragraph.querySelector('script[type^="math"]') || paragraph.classList.contains('MathJax_Preview')) return;
            var text = paragraph.textContent;
            if (text.includes('/')) {
                var formattedText = text.replace(/\/(.*?)\/(?!\/)/g, function(match, formula) {
                    var result = formula;
                    result = result.replace(/\[([^\]]*)\](\d*[+-])?/g, function(match, complex, charge) {
                        var formattedComplex = complex;
                        formattedComplex = formattedComplex.replace(/([A-Za-z\)\]])([0-9]+)/g, '$1<sub>$2</sub>');
                        formattedComplex = formattedComplex.replace(/l/g, '\u2113');
                        var formattedCharge = charge ? '<sup>' + charge + '</sup>' : '';
                        return '[' + formattedComplex + ']' + formattedCharge;
                    });
                    result = result.replace(/\((s|l|g|aq)\)/g, function(match, state) {
                        return '<i>(' + state.replace('l', '\u2113') + ')</i>';
                    });
                    result = result.replace(/([A-Za-z\)\]])([0-9]+)(?=\b|[^0-9])/g, '$1<sub>$2</sub>');
                    result = result.replace(/\^(\d*[+-])/g, '<sup>$1</sup>');
                    result = result.replace(/l/g, '\u2113');
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
