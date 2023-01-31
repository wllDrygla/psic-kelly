const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');

const path = require('path');

const app = express();

const Posts = require('./Posts.js');

mongoose.connect("mongodb+srv://Will:mafg8859@cluster0.pjngibn.mongodb.net/will?retryWrites=true&w=majority",{useNewUrlParser:  true, useUnifiedTopology: true}).then(function(){
    console.log('conectado com sucesso');
}).catch(function(err){
    console.log(err.message);
})
app.use(session({ secret:  'keyboard cat', cookie: { maxAge: 60000}}))

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public',  express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));

app.get('/', (req, res)=>{

    if(req.query.busca == null){
        Posts.find({}).exec(function(err,timeline){
            res.render('home', {timeline:timeline});

        })

    }else{
        res.render('single',{timeline:ti} );
    }
})

app.get('/:slug', (req,res)=>{
 //   res.render('single',{titulo:req.params.slug} );
   
  Posts.find({}).exec(function(err,timeline){
    res.render('single', {timeline:timeline, titulo:req.params.slug});

})
})
var usuarios = [
     {
        login: "adm",
        senha: "1234"
    }
]


app.post('/admin/login',  (req, res)=>{
    usuarios.map(function(val){
        if(val.login == req.body.login && val.senha ==  req.body.senha){
            req.session.login = "Admin";
            res.redirect('/admin/login');
        }else{
            res.send("Credenciais inválidas")

        }
    })
})

app.get('/admin/login', (req,res)=>{
    if(req.session.login  == null){
        res.render('admin-login')
    }else{
        Posts.find({}).exec(function(err,timeline){
            res.render('admin-painel', {timeline:timeline});

        })

    }
}
)

app.post("/admin/cadastro", (req,res)=>{
    console.log(req.body);
    Posts.create({
        titulo:req.body.titulo,
        imagem:req.body.imagem,
        descricao:req.body.descricao,
        resumo:req.body.resumo,
    })
    res.redirect('/admin/login');

})

app.get("/admin/deletar/:id", (req, res)=>{
    console.log(req.params.id);
    Posts.deleteOne({_id: req.params.id}, (err)=>{
        if(err){
            console.log(err)
        }else{
            res.redirect('/admin/login');

        }
    });
})


app.listen(8080, ()=>{
    console.log('rodando asdasdasd');
})
