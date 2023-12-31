//express
const express = require("express")
const admin = express()

//handlebars
const expressHandlebars = require("express-handlebars")
admin.engine("handlebars", expressHandlebars.engine())
admin.set("view engine", "handlebars")

//database
const database = require("../models/dbConnection")

//admin
admin.get("/admin/delivery/entrar", function(req, res){
    res.render("admin")
})

//admin login post
admin.post("/log", function(req, res){
    database.all(`select * from admin where loginUser = "${req.body.login}" 
    and senhaUser = "${req.body.senha}"`, function(erro, admin){
        if(erro){
            console.log(erro)
        }
        else if(admin.length == 1){
            res.redirect(`/menu/${req.body.login}/${req.body.senha}`)
        }
        else{
            res.redirect("/loginAdmin")
        }
    })
})

//tela menuAdmin
admin.get("/menu/:login/:senha", function(req, res){
    database.all(`select * from admin where loginUser = "${req.params.login}" 
    and senhaUser = "${req.params.senha}"`, function(erro, admin){
        if(erro){
            console.log(erro)
        }
        else if(admin.length == 1){
            res.render("menuAdmin", {admin})
        }
        else{
            res.redirect("/loginAdmin")
        }
    })
})

//tela infoDelivery
admin.get("/infoDelivery/:login/:senha", function(req, res){
    database.all(`select * from admin where loginUser = "${req.params.login}" 
    and senhaUser = "${req.params.senha}"`, function(erro, admin){
        if(erro){
            console.log(erro)
        }
        else if(admin.length == 1){
            database.all(`select * from InfoDelivery`, function(erro, InfoDelivery){
                if(erro){
                    res.send(erro)
                }
                else{
                    res.render("infoDelivery", {admin, InfoDelivery})
                }
            })
        }
        else{
            res.redirect("/loginAdmin")
        }
    })
})

//insert ou update InfoDelivery
admin.post("/Att/:login/:senha", function(req, res){

    database.all(`select * from infoDelivery`, function(erro, infoDelivery){
        if(erro){
            res.send(erro)
        }
        else if(infoDelivery.length == 1){
            //update
            database.run(`update infoDelivery set 
            nome = "${req.body.nome}",
            endereco = "${req.body.endereco}",
            horarioAbertura = "${req.body.horarioAbertura}", 
            mensagem = "${req.body.mensagem}", 
            informacao = "${req.body.informacao}", 
            taxaEntrega = "${req.body.taxa}", 
            horarioFechamento = "${req.body.horarioFechamento}"`, function(erro){
                if(erro){
                    res.send(erro)
                }
                else{
                    res.redirect(`/menu/${req.params.login}/${req.params.senha}`)
                }
            })
        }
        else if(infoDelivery.length <= 0){
            //insert
            database.run(`insert into infoDelivery 
            (nome, endereco,  horarioAbertura, mensagem, informacao, taxaEntrega, horarioFechamento)
            values("${req.body.nome}", "${req.body.endereco}", "${req.body.horarioAbertura}", 
            "${req.body.mensagem}", "${req.body.informacao}", 
            "${req.body.taxa}", "${req.body.horarioFechamento}")`, function(erro){
                if(erro){
                    res.send(erro)
                }
                else{
                    res.redirect(`/menu/${req.params.login}/${req.params.senha}`)
                }
            })
        }
    })

})


//select dados admin
admin.get("/getMin/:login/:senha", function(req, res){

    database.all(`select * from admin where loginUser = "${req.params.login}" 
    and senhaUser = "${req.params.senha}"`, function(erro, admin){
        if(erro){
            res.send(erro)
        }
        else{
            res.render("adminConta", {admin})
        }
    })
})

//update admin 
admin.post("/update/credAdmin/:login/:senha", function(req, res){
    database.all(`select * from admin where loginUser = "${req.params.login}" 
    and senhaUser = "${req.params.senha}"`, function(erro, admin){
        if(erro){
            res.send(erro)
        }
        else if(admin.length == 1){
            database.run(`update admin set loginUser = "${req.body.login}", 
            senhaUser = "${req.body.senha}"`, function(erro){
                if(erro){
                    res.send(erro)
                }
                else{
                    res.redirect(`/menu/${req.params.login}/${req.params.senha}`)
                }
            })
        }
    })
})



module.exports = admin