const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const bodyParser = require("body-parser");


let url = "";
const app = express();
app.set('view engine', 'ejs'); 
app.use(express.static('public'));

app.use(express.urlencoded({extended: true}));


app.get("/", function(req, res) {  
    res.render("home");
  });

app.post('/', async (req, res) => {
    url = req.body.url;
    let cardspack= await fetch(url);
    res.render("display",{cards:cardspack});
});


//Function to fetch the cards from the url

async function fetch(url){
  const cards=[];  

await axios.get(url)
    .then(res => {
        const $ = cheerio.load(res.data);
        $('.paper-card').each((i,e)=>{
          var x = {};
          x.title = $(e).find('h1').text().replace(/\s\s+/g,'');
          x.url= "https://paperswithcode.com" + $(e).find('a').attr('href').replace(/\s\s+/g,'');
      
          x.author = $(e).find('.author-section').text().replace(/\s\s+/g,'');
          x.git = $(e).find('.author-section').find('a').attr("href").replace(/\s\s+/g,'');
      
          x.stars = $(e).find('.entity-stars').text().replace(/\s\s+/g,'');
        
          x.abs = $(e).find('.item-strip-abstract').text().replace(/\s\s+/g,'');
      
          x.starsa = $(e).find('.stars-accumulated').text().replace(/\s\s+/g,'');

          x.image = $(e).find('.item-image').attr('style').replace(/\s\s+/g,'').replace("background-image: url('",'').replace("');",'');
          
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

