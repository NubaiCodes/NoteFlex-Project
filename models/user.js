
//Importar bibliotecas para o interargir com o MongoDB
const mongoose = require('mongoose');
//Biblioteca externa ao mongoose para validar que um campo é unico isto é não haverem duplicados
const uniqueValidator = require('mongoose-unique-validator');

//Esquema da coleção User
const UserSchema = new mongoose.Schema({
  //type - tipo de dados, required - obrigatório, unique - unico, validate - se segundo um formato/regex
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, required: true, validate: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ },
  password: { type: String, required: true },
});

//adiciona o plugin do unique validator ao nossa coleção do User
UserSchema.plugin(uniqueValidator);

//Método do mongoose para criar o modelo a partir do esquema
const User = mongoose.model("User", UserSchema);

//Indicar o que sai deste ficheiro user.js quando é feito require('../models/user')
module.exports = User;