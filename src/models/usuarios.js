const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost/auth",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Connected")
);

const usuariosCollection = "usuarios";

const UsuarioSchema = new mongoose.Schema({
  firstName: { type: String, required: true, max: 100 },
  lastName: { type: String, required: true, max: 100 },
  username: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
});

module.exports = mongoose.model(usuariosCollection, UsuarioSchema);
