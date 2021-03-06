//bibliotecas
const express = require('express')
const mongoose = require('mongoose')
const handlebars = require('express-handlebars')
const path = require('path')
const router = express.Router()
const axios = require('axios')
const yup = require('yup')
const hapikey = "c2c755c1-5e13-4efe-b98e-657f7fd3e42c"

//hubspot consulta

var request =  require("request");

//pastas
require ('../models/pessoas')
const Pessoa = mongoose.model('pessoas')

//Rota pessoas
router.get('/pessoas', function(req,res) {



//paginação
  var perPage = 10
  , page = parseInt(req.query.page) || 0
  var pageback
  var pageNum 
  Pessoa.find().lean()
  .limit(perPage)
  .skip(perPage * page)
  .sort({
    date:'desc'
  })
  .exec(function(err, events) {
  Pessoa.count().exec(function(err, count) {
    //mongoose
//conexão com mongodb

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

  Pessoa.find().lean().then((pessoa)=>{
    res.render('pessoas/add',{pessoa: pessoa})
}).catch(() =>{
    res.redirect( '/')
})
})

var novaPessoa = yup.object().shape({

  cpfcnpj: yup.number().required().positive().integer(),
  nome: yup.string().required(),
  cep: yup.number().required().positive().integer(),
  endereco: yup.string().required(),
  cidade: yup.string().required(),
  telefone: yup.number().required().positive().integer(),
  celular: yup.number().required().positive().integer(),
  email: yup.string().email(),
  observacao: yup.string().required(),
  createdOn: yup.date().default(function () {
  return new Date();

}),
})

router.post('/pessoas/nova',  function(req,res){


novaPessoa = req.body


new Pessoa(novaPessoa).save().then((resposta)=>{

res.redirect('/pessoas')

var emailT = novaPessoa.email
if(resposta){
  console.log(novaPessoa.email)

  novaPessoa.email

 var Url;
 var vid;
  var options = { method: 'GET',
    url: `https://api.hubapi.com/contacts/v1/contact/email/${emailT}/profile`,
    qs: { hapikey: `${hapikey}` }}
  
    request(options,  function (error, response, body) {
    if (error) throw new Error(error);
    
   if(body){
    const json = JSON.parse(body)
    
   
   
   }
   if(error){
    res.redirect('/pessoas')
   }
    }
    )}



}).catch((erro)=>{
res.redirect('/pessoas')
console.log(erro)

})


//enviar para o hubspot
   axios({
  method: 'post',
  url: `https://api.hubapi.com/contacts/v1/contact/?hapikey=c2c755c1-5e13-4efe-b98e-657f7fd3e42c`,

  data: {

  "properties": [
  {
  "property": "firstname",
  "value": novaPessoa.nome
  },
  {
  "property": "email",
  "value": novaPessoa.email
  },


  ],

  },
  })
.then( function (response) {
  
   console.log(response.data.vid)


})

.catch((erro)=>{
console.log(erro)
})

})

router.post('/pessoas/delete',(req,res)=>{


  Pessoa.deleteMany({_id: req.body.id}).then(()=>{


    console.log('deletou')
    res.redirect('/pessoas')
    
    })
    .catch((erro)=>{
    console.log(erro)
    })

  
})

//editar postagem
var Url = -50
  var vid;
  var emailT

router.get('/pessoas/:email', function (req, res){

 
emailT = req.params.email
  Pessoa.find({email: req.params.email}).then((resposta)=>{

    if(resposta){
   console.log(req.params.email)

    req.params.email
 
  
   var options = { method: 'GET',
     url: `https://api.hubapi.com/contacts/v1/contact/email/${emailT}/profile`,
     qs: { hapikey: `${hapikey}` }}
   
     request(options,  function (error, response, body) {
     if (error) throw new Error(error);
     
    if(body){
     const json = JSON.parse(body)
      vid = Number(json.vid)
     console.log(vid)
      Url = vid
    
    
    }
    
       
   })


  } 
   }).catch((erro)=>{
    console.log(erro)
  })
  router.post(`/pessoas/delet/`,  function(req,res){
 

   
    //enviar para o hubspot
    axios({
      method: 'DELETE',
          url: `https://api.hubapi.com/contacts/v1/contact/vid/${Url}?hapikey=${hapikey}`, 
    
      
      })
    .then(function (response) {
     
     console.log(response)
     Pessoa.deleteMany({email: emailT}).then(()=>{


      console.log('deletou')
      res.redirect('/pessoas')
      
      for(Url = Url+50;Url<0;Url++){
        console.log(Url)
      }
      
      })
      .catch((erro)=>{
      console.log(erro)
      res.redirect('/pessoas')
      })
     
    
    })
    
    .catch((erro)=>{
      console.log(erro)
      res.redirect('/pessoas')
        
       
    })
 
   
 
 
    
      })
  
  

Pessoa.findOne({email: emailT}).lean().then((pessoas)=>{
    

  res.render('pessoas/edit',{pessoas: pessoas})
  

  })
  .catch((request)=>{
    console.log(request)
  })
 
 
})
router.post('/pessoas/edit',async function(req,res){


  await Pessoa.findOne({_id: req.body.id}).then((pessoas)=>{

  pessoas.cpfcnpj = req.body.cpfcnpj
  pessoas.nome=req.body.nome
  pessoas.cep=req.body.cep
  pessoas.endereco=req.body.endereco
  pessoas.cidade=req.body.cidade
  pessoas.telefone=req.body.telefone
  pessoas.celular=req.body.celular
  pessoas.email=req.body.email
  pessoas.observacao=req.body.observacao


  pessoas.save().then(()=>{
    res.redirect('/')
//enviar para o hubspot
  axios({
  method: 'post',
  url: `https://api.hubapi.com/contacts/v1/contact/email/${pessoas.email}/profile?hapikey=${hapikey}`,

  data: {

  "properties": [
  {
  "property": "firstname",
  "value": pessoas.nome
  },
  {
  "property": "email",
  "value": pessoas.email
  },


  ],

  },
  })
.then(function (response) {
  

   console.log(response)
  


})

.catch((erro)=>{
console.log(erro)
res.redirect('/pessoas')
})




  })
})
})


module.exports = router

