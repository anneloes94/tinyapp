const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

// DATA STORE //
const urlDatabase = {
  "b2xVn2": { longURL : "http://www.lighthouselabs.ca", userID: "userRandomID"},
  "9sm5xK": { longURL : "http://www.google.com", userID: "user2RandomID"}
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


// FUNCTIONS //
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

// filter shortURLs by userID
// returns object of shortURL:longURL
function filterByUserID(urlDatabase, user_ID) {
  const URLZZ = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === user_ID) {
      URLZZ[shortURL] = urlDatabase[shortURL].longURL
    }
  }
  return URLZZ;
}

 // returns true if passed shortURL is in links
 function isInLinks(shortU, links) {
  for (let key of links) {
    if (key === shortU) {
      return true
    }
  }
  return false
}

// ROUTES //
app.get("/", (req, res) => {
  res.send("Hello!");
});

///             /login

app.post("/login", (req, res) => {
  const currentEmail = req.body.email;
  const currentPassword = req.body.password;
  const user = existingUserByEmail(currentEmail);
  
  if (users[user] === undefined) {
    res.status(400);
    res.send('400: You are not a registered user, you fool.');
  } else if (bcrypt.compareSync(currentPassword, users[user].hashedPassword)) {
    res.cookie("user_ID", users[user].userID)
    res.redirect("/urls")
  } else {
    res.redirect("/login")
  }
})

app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.cookies.user_ID]
  };
  res.render("login", templateVars)
})

////              /register

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
  const currentPassword = req.body.password;
  const hashedPassword = bcrypt.hashSync(currentPassword, 10)


  if (existingUserByEmail(email)) {
    res.status(400);
    res.send("You already have an account, you pancake.")
  } else if (email === "" || currentPassword === "") {
    res.status(400);
    res.send("Email and/or password cannot be an empty string.")
  } else {
    users[userID] = {
        userID,
        email,
        hashedPassword
    }

    res.cookie('user_ID', userID )
    res.redirect("/urls")}
})

////                /logout

app.post("/logout", (req, res) => {
  res.clearCookie("user_ID");
  res.redirect("/login");
})

////                /urls

app.get("/urls", (req, res) => {
  let templateVars = {
    user: users[req.cookies.user_ID],
    links: filterByUserID(urlDatabase, req.cookies.user_ID)
   };

  if (!templateVars.user) {
    res.status(403)
    res.send("403: Please register or log in first")
  }
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let randomKey = generateRandomString();
  let userID = req.cookies.user_ID
  urlDatabase[randomKey] = {
    longURL : req.body.longURL, 
    userID : userID 
  }
  res.redirect(`/urls/${randomKey}`);
});

////           /urls/:shortURL/delete

app.post("/urls/:shortURL/delete", (req, res) => {
  shortURL = req.params.shortURL
  links = filterByUserID(urlDatabase, req.cookies.user_ID);

  if (!isInLinks(shortURL, Object.keys(links))) {
    res.status(403)
    res.send("403: Unauthorized to view this shortURL")

  } else {
    delete urlDatabase[shortURL]
    res.redirect('/urls')
  }
});

////                /urls/new

app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.cookies.user_ID]
  } 
  if (!templateVars.user) {
    res.redirect("/login")
  } else {
    res.render("urls_new", templateVars);
  }
});

////                /u/:shortURL

app.get("/u/:shortURL", (req, res) => {
  shortURL = req.params.shortURL
  urlDatabase[shortURL]
  ? res.redirect(urlDatabase[shortURL].longURL)
  : res.send(404);
});

////                /urls/:shortURL

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: req.params.longURL,
    user: users[req.cookies.user_ID],
    links: filterByUserID(urlDatabase, req.cookies.user_ID)
  };

  if (!templateVars.user) {
    res.status(403)
    res.send("403: Please register or log in first")

  } else if (!isInLinks(req.params.shortURL, Object.keys(templateVars.links))) {
    res.status(403)
    res.send("403: Unauthorized to view this shortURL 2")

  } else {
    res.render("urls_show", templateVars);
  }
});

app.post("/urls/:shortURL", (req, res) => {
  shortURL = req.params.shortURL
  user = users[req.cookies.user_ID]
  links = filterByUserID(urlDatabase, req.cookies.user_ID)
  
  if (!user) {
    res.status(403)
    res.send("403: Please register or log in first")

  } else if (!isInLinks(shortURL, Object.keys(links))) {
    res.status(403)
    res.send("403: Unauthorized to view this shortURL 3")

  } else {
    urlDatabase[shortURL] = req.body.longURL
    res.redirect('/urls')
  }
})

////                  other

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});