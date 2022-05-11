const socket = io.connect();

function addMessage(e) {
    let fecha = new Date();
    let hours = fecha.getHours();
    let minutes = fecha.getMinutes()
    let seconds = fecha.getSeconds()
    let dia = fecha.getDate()
    let año = fecha.getFullYear()
    let mes = fecha.getMonth() + 1
    const mensaje = {
        email: document.getElementById('username').value,
        text: document.getElementById('texto').value,
        day: `${dia}/${mes}/${año}` ,
        time: `${hours}:${minutes}:${seconds}`
    };
    
    socket.emit('new-message', mensaje);

    return false;
}
function addProduct(e) {
    const producto = {
        name: document.getElementById('name').value,
        price: document.getElementById('price').value,
        image: document.getElementById('urlimage').value
    };
    console.log('Profucto agregado: ' + producto);
    socket.emit('new-product', producto);

    return false;
}
