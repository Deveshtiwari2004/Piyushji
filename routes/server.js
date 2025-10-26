
app.use(cookieParser());

app.get("/getcookies", (req,res) => {
    res.cookie("greet","namaste");
    res.cookie("madIn","india");
    res.send("sent some cookie");
});

app.get("/greet", (req,res) {
    let{name= "anonymous" } = req.cookie;
    res.send(`Hi, ${name}`);
});
app.get("/", (req,res)=> {
    console.dir(req.cookies);
    res.send("hi, i an root");
});