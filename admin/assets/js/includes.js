const includesHtml = (elem, url) => {
    fetch(url)
    .then(response => response.text())
    .then(data => {
        document.querySelector(elem).innerHTML = data;
    })
    .catch(error => {
        console.error('Error loading HTML:', error);
    });
}

includesHtml('.sidebar-wrapper', 'nav.html');