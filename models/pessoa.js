const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PessoaSchema = new Schema({
    nome:String,
    sobrenome:String,
    email:String,
    telefone:Number,
    endereco:String
})

module.exports = mongoose.model('Pessoa', PessoaSchema);