var admin = require("firebase-admin");
var serviceAccount = require("../../db/backend-coder-2c074-firebase-adminsdk-foedz-7cb5498cdc.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
const { schema, normalize, denormalize } = require("normalizr");
const util = require("util");

class MessagesContainer {
  constructor() {
    this.collection = db.collection("Mensajes");
    console.log(`Base de datos conectada con la collection Mensajes`);
  }

  async save(data) {
    let item = await this.collection.doc().create(data);
    return item;
  }

  sendMessage(email, nombre, apellido, edad, alias, urlAvatar, texto) {
    let mensaje = {
      author: {
        email: email,
        name: nombre,
        apellido: apellido,
        edad: edad,
        alias: alias,
        avatar: urlAvatar,
      },
      text: texto,
    };
    this.save(mensaje);
  }

  async getContent() {
    let result = await this.collection.get();
    result = result.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    return result;
  }

  async getById(id) {
    let result = await this.collection.get();
    result = result.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    let item = result.find((elem) => elem.id == id);
    return item;
  }

  async editData(id, data) {
    let doc = this.collection.doc(`${id}`);

    if (doc) {
      let item = await doc.update(data);
      return item;
    } else {
      return { Error: "no se encontro el elemento" };
    }
  }

  async deleteById(id) {
    let doc = this.collection.doc(`${id}`);
    let item = await doc.delete();
    return { status: "Producto eliminado" };
  }
}

class Normalizador {
  async normalizar() {
    let resultado = await db.collection("Mensajes").get();
    resultado = resultado.docs.map((doc) => ({
      id: doc.id,
      author: doc.data().author,
      mensaje: doc.data().text,
    }));
    let mensajes = { id: "mensajes", mensajes: resultado };

    const authorSchema = new schema.Entity(
      "authors",
      {},
      { idAttribute: "email" }
    );
    const mensajeSchema = new schema.Entity("mensaje", {
      author: authorSchema,
    });
    const mensajesSchema = new schema.Entity("mensajes", {
      mensajes: [mensajeSchema],
    });

    const normalizedMessages = normalize(mensajes, mensajesSchema);
    return normalizedMessages;
  }
}

class Desnormalizador {
  desnormalizar(data) {
    const authorSchema = new schema.Entity(
      "authors",
      {},
      { idAttribute: "email" }
    );
    const mensajeSchema = new schema.Entity("mensaje", {
      author: authorSchema,
    });
    const mensajesSchema = new schema.Entity("mensajes", {
      mensajes: [mensajeSchema],
    });
    let mensajesNormalizados = data;
    let mensajesDenormalizados = denormalize(
      mensajesNormalizados.result,
      mensajesSchema,
      mensajesNormalizados.entities
    );
    return mensajesDenormalizados;
  }
}
module.exports = { MessagesContainer, Normalizador, Desnormalizador };
