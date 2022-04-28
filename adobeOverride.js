function lookAtDOM() {
    const iframe = document.querySelector('iframe');
    if(iframe) {
        iframe.remove();
    } else {
        setTimeout(lookAtDOM, 200);
    }
}
lookAtDOM();
