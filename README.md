# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

TinyApp allows users to make new shortened URLs, see an overview of their created URLs, and edit them. The shortened URLS can be shared with users that do not have an account.

## Final Product

!["Screenshot of My URLs page"](https://raw.githubusercontent.com/anneloes94/tinyapp/master/docs/TinyApp_MyURLs.png)
!["Screenshot of Viewing/editing page of shortened URL"](https://raw.githubusercontent.com/anneloes94/tinyapp/master/docs/TinyApp_URLview.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- [Register](http://localhost:8080/register) as a user.
- [Login](http://localhost:8080/login) and have fun!