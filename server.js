import express from "express";
import mongoose from "mongoose";
import shortUrls from "./models/shortUrls.js";


const app=express();

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser:true, useUnifiedTopology:true
})
//set ejs view engine

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))
//route for index to render the short url
app.get('/',async (req,res)=>{
    const ShortUrls=await shortUrls.find();

    res.render('index', {ShortUrls:ShortUrls})
})

//post request for long URL.
app.post('/shortUrls' , async (req, res)=>{
    await shortUrls.create({full:req.body.fullUrl});

    res.redirect('/')
})
//redirect after clicking on short url.
app.get('/:shortUrl', async(req,res)=>{
    const shortUrl=await shortUrls.findOne({short:req.params.shortUrl})
    if(shortUrl===null) return res.sendStatus(404);

    shortUrl.clicks++
    shortUrl.save();

    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT||5000);