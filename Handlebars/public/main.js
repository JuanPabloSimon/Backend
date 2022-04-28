const socket = io.connect();


function render(data) {
    const html = data.map((elem, index) => {
        return(`<div id="mensaje">
            <strong>${elem.author}</strong>
            <em>${elem.text}</em>
            <p id="hora"> ${elem.time} </p>
        </div>`)
    }).join(" ");

    document.getElementById('messages').innerHTML = html;
}
function render2(data) {
    const html = data.map((elem, index) => {
        return(`<tr>
        <td> ${elem.name} </td>
        <td> $${elem.price} </td>
        <td> <img style="max-width: 50px;" src=${elem.image} alt=${elem.nombre} > </td>
    </tr>`)
    }).join(" ");

    document.getElementById('table').innerHTML += html;
}

function addMessage(e) {
    let fecha = new Date();
    let hours = fecha.getHours();
    let minutes = fecha.getMinutes()
    let seconds = fecha.getSeconds()
    let dia = fecha.getDate()
    let año = fecha.getFullYear()
    let mes = fecha.getMonth() + 1
    const mensaje = {
        author: document.getElementById('username').value,
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
    socket.emit('new-product', producto);

    return false;
}

socket.on('messages', data => {
    render(data);
})
socket.on('products', data => {

    render2(data); 
})
