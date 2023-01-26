var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    titulo:String,
    imagem:String,
    descricao:String,
    resumo:String


},{collection:'timeline'})

var Posts = mongoose.model('Posts',postSchema);

module.exports = Posts;