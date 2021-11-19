const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const bodyParser = require("body-parser");


let url = "";
const app = express();
app.set('view engine', 'ejs'); 


app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {  
    res.render("home");
  });

app.post('/', async (req, res) => {
    url = req.body.url;
    let cardspack= await fetch(url);
    res.render("display",{cards:cardspack});
});

async function fetch(url){
  const cards=[];  

await axios.get(url)
    .then(res => {
        const $ = cheerio.load(res.data);
        $('.item-col').each((i,e)=>{
          var x = {};
          const title = $(e).find('h1').text().replace(/\s\s+/g,'');
          x.title=title;
          const author = $(e).find('.author-section').text().replace(/\s\s+/g,'');
          x.author=author;
          const stars = $(e).find('.entity-stars').text().replace(/\s\s+/g,'');
          x.stars=stars;
          const abs = $(e).find('.item-strip-abstract').text().replace(/\s\s+/g,'');
          x.abs=abs;
          const starsa = $(e).find('.stars-accumulated').text().replace(/\s\s+/g,'');
          x.starsa=starsa;

          cards.push(x);
        })
        console.log(cards[0]);
      });
    return cards;};


let port = process.env.PORT;
if (port == null || port == ""){
port = 3000;
}

app.listen (port, function (){
  console.log("Server started successfully");
});

