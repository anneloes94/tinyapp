const getUserByEmail = (email, database) => {
  for (let user in database) {
    if (database[user].email === email) {
      return user;
    }
  }
};

// filter shortURLs by userID
// returns object of shortURL:longURL
const filterByUserID = (urlDatabase, user_ID) => {
  const URLZZ = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === user_ID) {
      URLZZ[shortURL] = urlDatabase[shortURL].longURL;
    }
  }
  return URLZZ;
};

module.exports = { getUserByEmail, filterByUserID };