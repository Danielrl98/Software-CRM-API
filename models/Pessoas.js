//models de pessoas/clientes/leads
const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const Pessoa = new Schema({


    cpfcnpj:{
        type: Number,
        required: false
    },
    nome:{
        type: String,
        required: false
    },
    endereco:{
        type:String,
        required: false
    },
    bairro:{
        type:String,
        required: false
    },
    cep:{
        type:Number,
        required:false
    },
    endereco_numero:{
        type:String,
        required: false
    },
    cidade:{
        type:String,
        required: false
    },
    telefone:{
        type: Number,
        required: false

    },
    
    celular:{
        type: Number,
        required: false

    },
    email:{
        type:String,
        required: false
    },
    observacao:{
        type: String,
        required: false
    },
    ativo:{
        type:Number,
        default: 1
    },
    date:{
        type: Date,
        default: Date.now()
    }


})

mongoose.model('pessoas', Pessoa)


