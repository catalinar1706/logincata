// require("dotenv").config();

const usuario = require("../models/usuarioModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registrar usuario
const registrarUsuario = async (req, res) => {
  const { Nombre, Correo, Contraseña } = req.body;

  // Validar que todos los campos estén presentes
  if (!Nombre || !Correo || !Contraseña) {
    return res
      .status(400)
      .json({ mensaje: "Todos los campos son obligatorios" });
  }

  try {
    // Verificar si el correo ya está registrado
    const usuarioExistente = await usuario.findOne({ Correo });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(Contraseña, 10);

    // Crear nuevo usuario
    const nuevoUsuario = {
      Nombre,
      Correo,
      Contraseña: hashedPassword,
    };

    const usuarioGuardado = await usuario.create(nuevoUsuario);

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      usuario: {
        id: usuarioGuardado._id,
        Nombre: usuarioGuardado.Nombre,
        Correo: usuarioGuardado.Correo,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ mensaje: "Error al registrar el usuario", error: err.message });
  }
};

// Login usuario
const loginUsuario = async (req, res) => {
  const { Correo, Contraseña } = req.body;

  // Validar que todos los campos estén presentes
  if (!Correo || !Contraseña) {
    return res
      .status(400)
      .json({ mensaje: "Correo y contraseña son obligatorios" });
  }

  try {
    // Buscar usuario por correo
    const usuarioEncontrado = await usuario.findOne({ Correo });

    if (!usuarioEncontrado) {
      return res
        .status(401)
        .json({ mensaje: "Credenciales incorrectas: usuario no encontrado" });
    }

    // Verificar la contraseña
    const esContraseñaValida = await bcrypt.compare(
      Contraseña,
      usuarioEncontrado.Contraseña
    );
    if (!esContraseñaValida) {
      return res
        .status(401)
        .json({ mensaje: "Credenciales incorrectas: contraseña inválida" });
    }

    // Generar token
    const token = jwt.sign(
      {
        id: usuarioEncontrado._id,
        Nombre: usuarioEncontrado.Nombre,
        Correo: usuarioEncontrado.Correo,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ mensaje: "Inicio de sesión exitoso", token });
  } catch (err) {
    res
      .status(500)
      .json({ mensaje: "Error al iniciar sesión", error: err.message });
  }
};

// Autenticar token
const autenticarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensaje: "Token requerido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ mensaje: "Token inválido" });
    req.user = user;
    next();
  });
};

module.exports = { registrarUsuario, loginUsuario, autenticarToken };
