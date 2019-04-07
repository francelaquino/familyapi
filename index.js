const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const uuidv4  = require('uuid/v4');
const jwt = require('jsonwebtoken');
const data = require('./routes/data')


const app = express();

const PORT =  process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/data', data)
 
app.get('/api',(req,res)=>{
    res.json({
        message:'test',
    })
});

app.post('/api/post',verifyToken,(req,res)=>{
    jwt.verify(req.token,'secretkey',(err,decoded)=>{
        if(err){
            res.status(401);
        }else{
            res.json({
                message:'success',
                decoded
            })
        }
    })
   
})

app.post('/api/login',(req,res)=>{
    const user={
        username:'brad',
    }

    jwt.sign({user},'secretkey',(err,token)=>{
        res.json(token)
    });

})

function verifyToken(req,res,next){
    const token  = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
        req.token=token;
        next();
}
app.listen(PORT,()=>{

});