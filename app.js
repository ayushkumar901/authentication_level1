// 1st project

const express = require('express') 
const app = express();
const fs = require('fs')

const path = require('path')

app.use(express.static(path.join(__dirname,"public")))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.set("view engine", "ejs")

app.get('/',(req,res)=>{
    let arr = []
    fs.readdir('./files',(err,files)=>{
        if(err){
            res.send(err)
        }
        else{
            files.forEach((val)=>{
               var data =  fs.readFileSync(`./files/${val}`)
               arr.push({filename:val,data})
            })
        res.render("index",{arr})
        }
    })
})

app.get('/form',(req,res)=>{
    res.render('form');
})

app.post('/register',(req,res)=>{
    fs.writeFile(`./files/${req.body.filename}`,req.body.filedata,(err)=>{
        if(err){
            res.send(err)
        }
        else{
            res.redirect('/')
        }
    }) 
})
// adding delete route

app.get('/delete/:filename',(req,res)=>{
    fs.unlink(`./files/${req.params.filename}`,(err)=>{
        if(err){
            res.send(err);
        }
        else{
            res.redirect('/');
        }
    })
})

//adding edit route
app.get('/edit/:filename',(req,res)=>{
    const filename = `${req.params.filename}`
    const filedata = fs.readFileSync(`./files/${req.params.filename}`)
    res.render('edit',{filename,filedata})
})

app.post('/update/:filename',(req,res)=>{
    //  console.log(req.body.filename,req.body.filedata);
    fs.writeFile(`./files/${req.body.filename}`,req.body.filedata,(err)=>{
        if(err){
            res.send(err); 
        }
        // else{
        //     res.redirect('/');
        // }
        else{
            if(req.params.filename!=req.body.filename){

                fs.unlink(`./files/${req.params.filename}`,(err)=>{
                    if(err){
                        res.send(err)
                    }
                    else{
                        res.redirect('/');
                    }
                })
            }
            else{
                res.redirect("/")
            }
        }
    })
})

app.listen(3000)