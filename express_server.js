const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

function generateRandomString() {
  let randomKey = ""
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 1; i <= 6; i++) {
      randomKey += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return randomKey;
}

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let randomKey = generateRandomString()
  console.log(req.body.longURL)
  urlDatabase[randomKey] = req.body.longURL
  console.log(`/urls/${randomKey}`)
  res.redirect(`/urls/${randomKey}`)           // passes /urls/3748gfeiu 
});

  // receive longURL -->
  //  generate random key
  // store in DB using ^^^ : longURL
  // go to the shortUrl's page (/urls/jjkdjk)

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {       //it must be going wrong here
  urlDatabase[req.params.shortURL]
  ? res.redirect(urlDatabase[req.params.shortURL])
  : res.send(404);

  // res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  // fakeObject = { "abcde123" : "http://nu.nl" } // will never complete (infinite loop?)
  // let longURL = req.params.shortURL
  let templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL };
  res.render("urls_show", templateVars);
  // let templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL };
  // res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});