const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

// DATA STORE
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

// FUNCTIONS
function generateRandomString() {
  let randomKey = ""
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 1; i <= 6; i++) {
      randomKey += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return randomKey;
};

function existingUserByEmail(passedEmail) {
  for (let user in users) {
    if (users[user].email === passedEmail) {
      return user;
    }
  }
};

// function getUserByValue(object, value) {
//   return Object.keys(object).find(function(key) {
//     object[key] === value
//   })
// }

// ROUTES
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/login", (req, res) => {
  const currentEmail = req.body.email;
  const currentPassword = req.body.password;
  const user = existingUserByEmail(currentEmail);

  if (user === undefined) {
    res.status(400);
    res.send('400: You are not a registered user, you fool.');
  } else if (currentPassword !== users[user].password) {
    res.status(403);
    res.send("403: That is not your password, use your brain!")
  } else {
    res.cookie("user_ID", users[user].id)
    res.redirect("/urls")
  }
})

app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.cookies.user_ID]
  };
  res.render("login", templateVars)
})

app.get("/register", (req, res) => {
  let templateVars = { 
    urls: urlDatabase,
    user: null
   };
   res.render("registration_page", templateVars)
})

app.post("/register", (req, res) => {
  const userID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  if (existingUserByEmail(email)) {
    res.status(400);
    res.send("You already have an account, you idiot.")
  } else if (email === "" || password === "") {
    res.status(400);
    res.send("Email and/or password cannot be an empty string.")
  } else {
    users[userID] = {
        userID,
        email,
        password
    }
    console.log(users)
    console.log("\n")
    res.cookie('user_ID', userID )
    res.redirect("/urls")}
})

app.post("/logout", (req, res) => {
  res.clearCookie("user_ID");
  res.redirect("/urls");
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { 
    urls: urlDatabase,
    user: users[req.cookies.user_ID]
   };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let randomKey = generateRandomString();
  console.log("Im here")
  urlDatabase[randomKey] = req.body.longURL;
  res.redirect(`/urls/${randomKey}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect('/urls')
});


app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.cookies.user_ID]
  }
  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL]
  ? res.redirect(urlDatabase[req.params.shortURL])
  : res.send(404);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: req.params.longURL,
    user: users[req.cookies.user_ID]
   };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect('/urls')
})

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});