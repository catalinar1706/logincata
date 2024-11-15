const mongoose = require('mongoose');

const conexionDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/login?', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Conectada a la base de datos"); 

    } catch (error) {
        console.log("error al Conectar", error); 
    }
};

module.exports = conexionDB;