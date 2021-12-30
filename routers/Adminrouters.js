//bibliotecas
const express = require('express')
const mongoose = require('mongoose')
const handlebars = require('express-handlebars')
const path = require('path')
const { listenerCount } = require('stream')
const router = express.Router()



//pastas
require ('../models/pessoas')
const Pessoa = mongoose.model('pessoas')

//Rota pessoas
router.get('/pessoas',(req,res) =>{
   
    var perPage = 10
    , page = parseInt(req.query.page) || 0
    var pageback
    var pageNum 
    Pessoa.find().lean().select('nome')
    .limit(perPage)
    .skip(perPage * page)
    .sort({
        nome: 'asc'
    })
    .exec(function(err, events) {
        Pessoa.count().exec(function(err, count) {
            res.render('pessoas/pessoas',{
                events: events,
                page: page +1,
                pages: count / perPage,
                pageback: page-1,
            })
            if( page<0 ){
               res.redirect('/pessoas')    
            }
           
        })
    })

 
})
router.get('/pessoas/add',(req,res)=>{

    res.render('pessoas/add')
})
router.post('/pessoas/nova',(req,res)=>{

    const novaPessoa = {
    
        cpfcnpj: req.body.cpfcnpj,
        nome: req.body.nome,
        cep: req.body.cep,
        endereco: req.body.endereco,
        bairro: req.body.bairro,
        endereco_numero: req.body.endereco_numero,
        cidade: req.body.cidade,
        telefone: req.body.telefone,
        celular: req.body.celular,
        email: req.body.email,
        observacao: req.body.observacao
       
    }
    new Pessoa(novaPessoa).save().then(()=>{

        res.redirect('/pessoas')

    }).catch((erro)=>{
        res.redirect('/pessoas')
        console.log(erro)
        
    })
})
router.post('/pessoas/delete',(req,res)=>{

    Pessoa.deleteMany({_id: req.body.id}).then(()=>{
        console.log('deletou')
        res.redirect('/pessoas')

    }).catch((erro)=>{
        console.log(erro)
    })
})


module.exports = router

