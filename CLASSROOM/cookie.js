const express = require("express");
const app = expreee();
const cookieParser = require("cookie-parser");

app.use(cookieParser("secretecode"));

app.get("/getcookies",(req,res) => {
    res.cookie("greet", "namaste");
    res.cookie("madeIn", "India");
    res.send("send you some cookies");

});

app.get("/",(req,res)=>{
    console.dir(req.cookies);
    res.send("Hi, i am root");
});

app.get("/verify", (req,res)=> {
    console.log(req.signedCookies);
    res.send("verified");
});

app.get("/register", (req,res)=>{
    let {name = "anonumous"} = req.query;
    req.session.name = name;
    res.redirect("/Hello");
});

app.get("/hello", (req,res)=>{
    res.send(`hello,${req.session.name}`);
});