const requestify = require('requestify');

const baseUrl = 'https://www.demoqa.com';

function authenticate(user) {
  requestify
    .request(`${baseUrl}/Account/v1/Login`, {
      method: 'POST',
      body: {
        userName: user.username,
        password: user.password,
      },
    })
    .then(async (response) => {
      const body = response.getBody();
      process.env.token = body.token;
      process.env.username = body.username;
      process.env.userId = body.userId;
      process.env.expires = body.expires;
    });
}

function addBook(ISBN) {
  requestify.request(`${baseUrl}/Bookstore/v1/Books`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.token}`,
    },
    body: {
      userId: process.env.userId,
      collectionOfIsbns: [{ isbn: ISBN }],
    },
  });
}

function deleteBook(ISBN) {
  requestify.request(`${baseUrl}/Bookstore/v1/Book`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${process.env.token}`,
    },
    body: {
      userId: process.env.userId,
      isbn: ISBN,
    },
  });
}

module.exports = { authenticate, addBook, deleteBook };
