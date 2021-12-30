//bibliotecas
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const handlebars = require('express-handlebars')
const path = require('path')


//pastas
require('./db') // banco de dados
require('./models/pessoas') // model de pessoas
const router = require('./routers/Adminrouters')

router.get('/',(req,res) =>{

  res.redirect('/pessoas')
})
//mongoose
//conexão com mongodb
mongoose.connect('mongodb://localhost:27017/crm',()=>{

console.log('mongodb conectado')

}).catch((erro)=>{

console.log(erro)
})



//corrigir erro de cadastro
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

//use para rotas
app.use('/',router)




//handlebars views
const hbs = handlebars.create({
        extname: 'hbs',
        defaultLayout: 'main',

        layoutsDir:path.join(__dirname, 'views/layouts'),

        partialsDir:[
        //partições
            path.join(__dirname,'views/partials')
        ]
})
app.engine('.hbs',hbs.engine)
app.set('view engine','.hbs')



//Rotas


//Servidor e porta
const PORT = 5000
app.listen(PORT, ()=>{

    console.log('Servidor Conectado na porta: '+PORT)
})