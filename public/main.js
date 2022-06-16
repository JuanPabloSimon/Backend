const socket = io.connect();

function render(data) {
        let mensajes = data.mensajes
        const html = mensajes.map((elem) => {
            return(`<div id="mensaje">
                <strong>${elem.author.email}: </strong>
                <em>${elem.mensaje}</em>
            </div>`)
        }).join(" ");
        document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {
    const mensaje = {
        author: {
            email: document.getElementById('email').value,
            nombre: document.getElementById('name').value,
            apellido: document.getElementById('surname').value,
            edad: document.getElementById('age').value, 
            alias: document.getElementById('nickname').value,
            avatar: document.getElementById('avatar').value,
        },
        text: document.getElementById('texto').value,
    };
    console.log(mensaje);
    socket.emit('new-message', mensaje);
}

socket.on('messages', (data) => {
     render(data);
})
