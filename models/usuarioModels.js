const mongoose = require("mongoose");

const usuarioschema = new mongoose.Schema({
  Nombre: {
    type: String,
    required: true,
  },
  Correo: {
    type: String,
    required: true,
    unique: true,
  },
  Contraseña: {
    type: String,
    required: true,
  },
});

const usuario = mongoose.model("usuario", usuarioschema);

module.exports = usuario;
