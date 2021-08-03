//Importar bibliotecas para o interargir com o MongoDB
const { ObjectId } = require('bson');
const mongoose = require('mongoose');
//Biblioteca externa ao mongoose para validar que um campo é unico isto é não haverem duplicados
const uniqueValidator = require('mongoose-unique-validator');

//Esquema da coleção Notes
const NoteSchema = new mongoose.Schema({
    //type - tipo de dados, required - obrigatório, unique - unico, validate - se segundo um formato/regex
    course: { type: String, required: true },
    semester: { type: Number, required: true },
    filePath: { type: String, unique: true, required: true },
    userId: { type: ObjectId, required: true }
});

//adiciona o plugin do unique validator ao nossa coleção do User
NoteSchema.plugin(uniqueValidator);

//Método do mongoose para criar o modelo a partir do esquema
const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;