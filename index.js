const express = require('express');
const mongoose = require('mongoose');
const fileupload = require('express-fileupload')
var bodyParser = require('body-parser');
var session = require('express-session');


const path = require('path');

const app = express();
const Senha = require('./senha.js');

const Posts = require('./Posts.js');
const fileUpload = require('express-fileupload');

mongoose.connect("mongodb+srv://Will:"+Senha+"@cluster0.pjngibn.mongodb.net/will?retryWrites=true&w=majority",{useNewUrlParser:  true, useUnifiedTopology: true}).then(function(){
    console.log('conectado com sucesso');
}).catch(function(err){
    console.log(err.message);
})
app.use(session({ secret:  'keyboard cat', cookie: { maxAge: 60000}}))

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(fileupload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "temp")
}))

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public',  express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));

app.get('/', (req, res)=>{

    if(req.query.busca == null){
        Posts.find({}).exec(function(err,timeline){
            res.render('index', {timeline:timeline});
            console.log(Senha)

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
        }else{            Posts.find({}).exec(function(err,timeline){
            res.render('erro-login', {timeline:timeline});

        })    }
    })
})

app.get('/admin/login', (req,res)=>{
    if(req.session.login  == null){
        Posts.find({}).exec(function(err,timeline){
            res.render('admin-login', {timeline:timeline});

        })
    }else{
        Posts.find({}).exec(function(err,timeline){
            res.render('admin-painel', {timeline:timeline});

        })

    }
}
)

app.post("/admin/cadastro", (req,res)=>{
    console.log(req.files.arquivo);
    req.files.arquivo.mv(__dirname+'/public/images/'+'psi-kelly-artigos'+req.body.titulo+req.files.arquivo.name);
    Posts.create({
        titulo:req.body.titulo,
        imagem:'/public/images/'+'psi-kelly-artigos'+req.body.titulo+req.files.arquivo.name,
        descricao:req.body.descricao,
        resumo:req.body.resumo,
    })
    res.redirect('/admin/login');

})
app.post("/admin/editar/:id", (req,res)=>{

    if(req.body.tituloeditado  == null){
        var titulonovo = titulo
}else{
        var titulonovo = req.body.tituloeditado
    
    };
    
    if(req.body.descricaoeditada  == null){
            var descricaonova = descricao
    }else{
            var descricaonova = req.body.descricaoeditada
    
            };
            if(req.body.resumoeditado  == null){
                var resumonovo = req.body.resumo
            }else{
                var resumonovo = req.body.resumoeditado
        
                };
    let editado = {
        titulo:titulonovo,
        descricao:descricaonova,
        resumo:resumonovo
    }
    
    Posts.updateOne({_id: req.params.id}, editado, (err)=>{
        if(err){
            console.log(err)
        }else{

            res.redirect('/admin/login');

        }
    });
})

app.get("/admin/deletar/:id", (req, res)=>{
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
