const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const uuidv4  = require('uuid/v4');
const jwt = require('jsonwebtoken');


const app = express();

const PORT =  process.env.PORT || 5000;


const pool = mysql.createPool({
    connectionLimit : 100, 
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'familyrecord',
    debug    :  false
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.get('/data/login/:mobileno', (req, res) => {
    pool.getConnection((errorPool, conn) => {
        if (errorPool) {
            res.status(500).json({
                message: 'Something went wrong!'
            })
        } else {

            const queryString = `select  * from family where id=parentid and mobile='${req.params.mobileno}'`;

            pool.query(queryString, (err, rows, fields) => {

                if (err) {
                    res.status(500).json({
                        message: 'Something went wrong!'
                    })
                    conn.release();
                } else {
                    res.status(200).json({
                        results: rows,
                    })
                    conn.release();
                }
            });
        }
    });

});

app.get('/data/getfamily/:id/:gid',(req,res)=>{
    pool.getConnection((errorPool,conn)=>{
        if(errorPool){
            res.status(500).json({
                message:'Something went wrong!'
            })
        }else{
            const queryString=`select  * from family where parentid!=id and parentid=${req.params.id} and gid='${req.params.gid}'`;
            pool.query(queryString,(err,rows,fields)=>{
                
                if(err){
                    res.status(500).json({
                        message:'Something went wrong!'
                    })
                    conn.release();
                }else{
                    res.status(200).json({
                        results:rows,
                    })
                    conn.release();
                }
            });
        }

    });
});

app.post('/data/savefamilymember', (req, res) => {

    pool.getConnection((errorPool, conn) => {
        if (errorPool) {
            res.status(500).json({
                message: 'Something went wrong!'
            })
        } else {

            const queryString = `select  * from family where parentid=${req.body.id} and gid='${req.body.gid}'`;

            pool.query(queryString, (err, rows, fields) => {

                if (err) {

                    return res.status(500).json({
                        message: 'Something went wrong!'
                    })


                } else {
                    if (rows.length > 0) {
                        let secondname = rows[0].secondname;
                        let thirdname = rows[0].thirdname;
                        let fourthname = rows[0].fourthname;
                        let fifthname = rows[0].fifthname;
                        let sixname = rows[0].sixname;

                        const queryString = `insert into family(parentid,gid,firstname,secondname,thirdname,fourthname,fifthname,sixname,gender,
                    birthdate,email,maritalstatus,jobstatus,mobile,address,dateupdated)
                    values(${req.body.id},'${req.body.gid}','${req.body.firstnameMember}','${secondname}','${thirdname}',
                    '${fourthname}','${fifthname}','${sixname}','${req.body.genderMember}','${req.body.birthdateMember}','${req.body.emailMember}',
                    '${req.body.maritalstatusMember}','${req.body.jobstatusMember}','${req.body.mobilenoMember}','${req.body.addressMember}',curdate())`;

                        pool.query(queryString, (err) => {
                            if (err) {
                                res.status(500).json({
                                    message: 'Something went wrong!'
                                })

                            } else {
                                res.status(200).json({
                                    message: '',
                                })

                            }
                        });

                    }
                    conn.release();

                }

            });
        }
    });

});
app.post('/data/register', (req, res) => {

    let gid = uuidv4();

    pool.getConnection((errorPool, conn) => {
        if (errorPool) {
            res.status(500).json({
                message: 'Something went wrong!'
            })
        } else {

            const queryString = `insert into family(gid,firstname,secondname,thirdname,fourthname,fifthname,sixname,gender,
                    birthdate,email,maritalstatus,jobstatus,mobile,address,dateupdated)
                    values('${gid}','${req.body.firstname}','${req.body.secondname}','${req.body.thirdname}',
                    '${req.body.fourthname}','${req.body.fifthname}','${req.body.sixname}','${req.body.gender}','${req.body.birthdate}','${req.body.email}',
                    '${req.body.maritalstatus}','${req.body.jobstatus}','${req.body.mobileno}','${req.body.address}',curdate())`;

            pool.query(queryString, (err, result) => {
                if (err) {
                    res.status(500).json({
                        message: 'Something went wrong!'
                    })

                } else {
                    let Id = result.insertId;
                    const queryString = `update family set parentid=${Id} where id=${Id}`;

                    pool.query(queryString, (err) => {
                        if (err) {
                            res.status(500).json({
                                message: 'Something went wrong!'
                            })

                        } else {


                            res.status(200).json({
                                results: '?id=' + Id + '&gid=' + gid,
                            })

                        }
                    });

                    conn.release();



                }
            });
        }
    });

});

app.put('/data/updatefamilymember', (req, res) => {

    pool.getConnection((errorPool, conn) => {
        if (errorPool) {
            res.status(500).json({
                message: 'Something went wrong!'
            })
        } else {
            const queryString = `update family set firstname='${req.body.firstname}',gender='${req.body.gender}',
    birthdate='${req.body.birthdate}',email='${req.body.email}',maritalstatus='${req.body.maritalstatus}',jobstatus='${req.body.jobstatus}',
    mobile='${req.body.mobileno}',address='${req.body.address}',dateupdated=curdate() where id=${req.body.mid} `;

            pool.query(queryString, (err) => {

                if (err) {
                    res.status(500).json({
                        message: 'Something went wrong!'
                    })

                } else {
                    res.status(200).json({
                        message: '',
                    })

                }
                conn.release();
            });
        }
    });


});



app.put('/data/updatemain',(req,res)=>{
    

    pool.getConnection((errorPool, conn) => {
        if (errorPool) {
            res.status(500).json({
                message: 'Something went wrong!'
            })
        } else {
    const queryString=`update family set firstname='${req.body.firstname}',secondname='${req.body.secondname}',thirdname='${req.body.thirdname}',
    fourthname='${req.body.fourthname}',fifthname='${req.body.fifthname}',sixname='${req.body.sixname}',gender='${req.body.gender}',
    birthdate='${req.body.birthdate}',email='${req.body.email}',maritalstatus='${req.body.maritalstatus}',jobstatus='${req.body.jobstatus}',
    mobile='${req.body.mobileno}',address='${req.body.address}',dateupdated=curdate() where id=${req.body.id} and gid='${req.body.gid}'`;

    pool.query(queryString,(err)=>{
        
        if(err){
            res.status(500).json({
                message:'Something went wrong!'
            })
            
        }else{
            res.status(200).json({
                message:'',
            })
         
        }

        conn.release();
    });

}

    });

   
});


app.get('/data/getrecord/:id/:gid',(req,res)=>{
    pool.getConnection((errorPool,conn)=>{
        if(errorPool){
            res.status(500).json({
                message:'Something went wrong!'
            })
        }else{
            const queryString=`select  * from family where id=${req.params.id} and gid='${req.params.gid}'`;

            conn.query(queryString,(errorConn,rows,fields)=>{
                
                if(errorConn){
                    res.status(500).json({
                        message:'Something went wrong!'
                    })
                    conn.release();
                }else{
                    res.status(200).json({
                        results:rows,
                    })
                    conn.release();
                }
            });
        
        }
    });

   
});



app.get('/data/getfamilyrecord/:mid/',(req,res)=>{
    
    pool.getConnection((errorPool, conn) => {
        if (errorPool) {
            res.status(500).json({
                message: 'Something went wrong!'
            })
        } else {

    const queryString=`select  * from family where id=${req.params.mid}`;

    pool.query(queryString,(err,rows,fields)=>{
        
        if(err){
            res.status(500).json({
                message:'Something went wrong!'
            })
            
        }else{
            res.status(200).json({
                results:rows,
            })
         
        }
        conn.release();
    });

         
}
});


   
});
 
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