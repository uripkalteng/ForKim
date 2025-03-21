document.addEventListener('DOMContentLoaded', function() {
    console.log('Script dimuat');
    setTimeout(function() {
        console.log('Mulai pemrosesan');
        document.querySelectorAll('p, li').forEach(function(paragraph) {
            if (paragraph.classList.contains('MathJax') || paragraph.querySelector('.MathJax')) return;
            var text = paragraph.textContent;
            if (text.includes('/')) {
                var formattedText = text.replace(/\/(.*?)\/(?!\/)/g, function(match, formula) {
                    return '<span style="color: red;">' + formula + '</span>';
                });
                paragraph.innerHTML = formattedText;
                console.log('Hasil: ', paragraph.innerHTML);
            }
        });
    }, 500);
});
