// looks up the user belonging to a given email address in a database
// returns user as a string
const getUserByEmail = (email, database) => {
  for (let user in database) {
    if (database[user].email === email) {
      return user;
    }
  }
};

// filter shortURLs by userID
// returns object of { shortURL:longURL }
const filterByUserID = (urlDatabase, user_ID) => {
  const URLZZ = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === user_ID) {
      URLZZ[shortURL] = urlDatabase[shortURL].longURL;
    }
  }
  return URLZZ;
};

// generates a random string of 6 letters and/or numbers: a1bc2D
const generateRandomString = () => {
  let randomKey = "";
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 1; i <= 6; i++) {
    randomKey += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomKey;
};

// returns true if passed shortURL is in an array of links, 
// otherwise returns false
const isInLinks = (shortU, links) => {
  for (let key of links) {
    if (key === shortU) {
      return true;
    }
  }
  return false;
};

module.exports = { getUserByEmail, filterByUserID, generateRandomString, isInLinks };