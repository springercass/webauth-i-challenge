const express = require("express");
const bcrypt = require("bcryptjs");
// const { authenticate } = require("../middleware");

const router = express.Router();

const usersDb = require("./user-model");

router.post("/register", (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  usersDb
    .add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  usersDb
    .findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ error: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ error: `Invalid credentials.` });
      }
    });
});

// router.get("/", authenticate, (req, res) => {
//   usersDb
//     .find()
//     .then(users => {
//       res.json(users);
//     })
//     .catch(err => res.send(err));
// });

module.exports = router;
