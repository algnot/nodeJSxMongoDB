const express = require('express')
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const { ObjectId } = require('bson')
const app = express()
app.use(bodyParser.json())
const connectionString = ""

app.use(bodyParser.urlencoded({ extended: true }))

MongoClient.connect(connectionString, {useUnifiedTopology: true} , function (err,client){
    if (err) return console.error(err);

    app.get('/', (req, res) => {
        client.db('todolist').collection('todolist_db').find().toArray()
        .then(result => {
            res.render(__dirname + '/index.ejs' , {data : result})
        }) 
    })

    app.put('/update' , (req, res) =>{
        var objId = ObjectId(req.body.id)
        client.db('todolist').collection('todolist_db').updateOne({_id:objId} ,{$set:{todo:req.body.data}})
        .then (result => {
            res.redirect('/')
        })
    })
    
    app.post('/insert' , (req,res)=>{
        client.db('todolist').collection('todolist_db').insertOne({todo:req.body.todo , date:req.body.date})
        .then(result => {
            res.redirect('/')
        })
    })

    app.delete('/delete' , (req,res)=>{
        var objId = ObjectId(req.body.id)
        client.db('todolist').collection('todolist_db').deleteOne({_id:objId})
        .then(result => {
            res.redirect('/')
        })
    })

    app.listen(5000)
})