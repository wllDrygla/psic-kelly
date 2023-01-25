const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');

const path = require('path');

const app = express();

const Posts = require('./Posts.js');

mongoose.connect("mongodb+srv://Will:mafg8859@cluster0.pjngibn.mongodb.net/will?retryWrites=true&w=majority",{useNewUrlParser:  true, useUnifiedTopology: true}).then(function(){
    console.log('conectado com sucesso');
}).catch(function(err){
    console.log(err.message);
})

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public',  express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));

app.get('/', (req, res)=>{
    console.log(req.query);

    if(req.query.busca == null){
        Posts.find({}).exec(function(err,timeline){
            res.render('home', {timeline:timeline});

        })

    }else{
        res.render('single',{timeline:ti} );
    }
})

app.get('/:slug', (req,res)=>{
    res.render('single',{titulo:req.params.slug} );

})

app.listen(5000, ()=>{
    console.log('rodando');
})