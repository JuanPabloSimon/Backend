const express = require('express');
const { Router } = express;
const messageRoutes = Router();

const { MessagesContainer } = require('../models/MessageContainer')
let messageContainer = new MessagesContainer();

messageRoutes.get('/', (req, res) => {
    const traer = async () => {
        let datos = await messageContainer.getContent();
        res.json({mensajes: datos});
    }
    traer()
})
messageRoutes.get('/:id', (req, res) => {
    const traer = async () => {
        let mensaje = await messageContainer.getById(req.params.id);
        console.log(mensaje);
        res.json({mensajes: mensaje});
    }
    traer()
})
messageRoutes.post('/', (req, res) => {
    let mensaje = req.body;

    if (mensaje) {
        mensaje = messageContainer.sendMessage(
            mensaje.email, 
            mensaje.name, 
            mensaje.surname, 
            mensaje.age, 
            mensaje.nickname, mensaje.avatar,
            mensaje.text  
        );
        res.json({result: 'mensaje guardado', mensaje: mensaje})
    } else {
        res.json({result: 'El mensaje no pudo ser guardado'})
    }
})
messageRoutes.put('/:id', (req, res) => {
    let mensaje = req.body;

    if (mensaje) {
        mensaje = messageContainer.editMessage(req.params.id, mensaje);
        res.json({result: 'mensaje editado', mensaje: mensaje})
    } else {
        res.json({result: 'El mensaje no pudo ser editado'})
    }
})
messageRoutes.delete('/:id', (req, res) => {
    messageContainer.deleteById(req.params.id);
    res.json({result: `Mensaje con id: ${req.params.id} eliminado`});
})


module.exports = messageRoutes;