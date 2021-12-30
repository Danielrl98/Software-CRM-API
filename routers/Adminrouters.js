//bibliotecas
const express = require('express')
const mongoose = require('mongoose')
const handlebars = require('express-handlebars')
const path = require('path')
const router = express.Router()

//pastas
require ('../models/pessoas')
const Pessoa = mongoose.model('pessoas')


//Rota pessoas
router.get('/pessoas',(req,res) =>{

    res.render('pessoas/pessoas')
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
        celular:req.body.celular,
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



module.exports = router
