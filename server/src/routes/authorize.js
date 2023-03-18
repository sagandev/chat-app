const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express.Router();
const Register = require("../schema/register.js");
const sha256 = require("crypto-js/sha256.js");
const mailer = require("../utils/mail.js");
const generator = require("generate-password");
const bcrypt = require("bcrypt");
const Recovery = require("../schema/recovery.js");
const jwt = require("jsonwebtoken");
const auth = require("../utils/auth.js");
const views = require("../schema/views.js");
const moment = require("moment");
const uniqueString = require('unique-string');
app.post("/register", async (req, res) => {
  try {
    const { username, password, email, sex, dateOfBirth, uAvatar } = req.body;
    if (!req.body) return res.status(400).send({ message: "Unauthorized" });
    if (!password || !username || !email || !sex || !dateOfBirth)
      return res.status(400).send({ message: "Unauthorized" });
    let user = await Register.findOne({ email: email });
    let userName = await Register.findOne({ username: username });
    if (user || userName) {
      return res.status(401).send({
        message:
          "Użytkownik o podanym adresie email lub nazwie użytkownika już istnieje",
      });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .send({ message: "Hasło musi składać sie z conajmniej 8 znaków" });
    }
    try {
      const passHashed = await bcrypt.hash(
        password,
        Number(process.env.bcrypt_salt)
      );
      const date = moment().subtract(10, "days").calendar();
      const us = "Użytkownik";
      Register.create({
        username: username,
        password: passHashed,
        email: email,
        sex: sex,
        dateOfBirth: dateOfBirth,
        role: us,
        avatar: uAvatar ? uAvatar : "https://i.imgur.com/jWSUlwq.png",
        createdAt: date,
      })
        .then((user) => {
          res.status(200).json({
            message: "Zarejestrowano pomyślnie.",
            user,
          });
        })
        .catch((e) => {
          console.log(e);
          res.status(401).json({
            message: "Rejestracja zakończona niepowodzeniem.",
          });
        });
    } catch (e) {
      console.log(e);
      res.status(401).json({
        message: "Rejestracja zakończona niepowodzeniem",
      });
    }
  } catch (e) {
    return res.status(401).send("Bad request");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!password || !username)
      return res.status(400).send({ message: "Unauthorized" });
    await Register.findOne({ username: username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((response) => {
            if (!response)
              return res.status(401).json({
                success: false,
                message:
                  "Logowanie nie powiodło się. Błedna nazwa użytkownika lub hasło",
              });
            const token = jwt.sign(
              {
                userId: user._id,
                userUsername: user.username,
              },
              process.env.SECRET,
              { expiresIn: "24h" }
            );
            views
              .findOne({ data: "views" })
              .select("viewsCount")
              .lean()
              .then(async (result) => {
                console.log(result.viewsCount);
                try {
                  await views.findOneAndUpdate(
                    { data: "views" },
                    { viewsCount: parseInt(result.viewsCount) + 1 }
                  );
                } catch (e) {
                  console.log(e);
                }
              });
            res.status(200).send({
              success: true,
              message: "Logowanie powiodło się",
              token,
              user: {
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                id: user._id,
                dateOfBirth: user.dateOfBirth,
                sex: user.sex,
                role: user.role,
                createdAt: user.createdAt,
                role: user.role
              },
            });
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => {
        return res.status(401).json({
          success: false,
          message:
            "Logowanie nie powiodło się. Błedna nazwa użytkownika lub hasło",
        });
      });
  } catch (e) {
    console.log(e);
  }
});

app.post("/recovery-key", async (req, res) => {
  if (!req.body) return res.status(400).send({ message: "Bad request" });
  const { email } = req.body;
  if (!email) return res.status(401).json({ message: "Unauthorized" });
  Register.findOne({ email: email })
    .select("email")
    .lean()
    .then(async (result) => {
      if (!result) {
        return res
          .status(404)
          .json({ message: "Nie znaleziono konta o podanym adresie email" });
      } else {
        await Recovery.findOne({ email: email })
          .select("email")
          .lean()
          .then(async (result) => {
            if (!result) {
              const unique = uniqueString();
              console.log(unique);
              try {
                Recovery.create({
                  email: email,
                  recoveryKey: unique,
                }).then((user) => {
                  try {
                    mailer(
                      user.email,
                      `[${user.email}] Twój klucz odzyskiwania`,
                      `Klucz odzyskiwania`,
                      `Twój klucz odzyskiwania to: <b>${user.recoveryKey}</b><br><br><i>projekt.saganowski.ovh</i>`
                    );
                    return res.status(200).json({
                      success: true,
                      message:
                        "Klucz odzyskiwania został wyslany na twoj adres email",
                    });
                  } catch (error) {
                    return res.status(500);
                  }
                });
              } catch (error) {
                return res.status(500);
              }
            } else {
              return res.status(400).json({
                success: true,
                message: "Klucz odzyskiwania zostal juz wyslany!",
              });
            }
          })
          .catch((e) => {
            return res.sendStatus(500);
          });
      }
    });
});
app.post("/password-recovery", async (req, res) => {
  if (!req.body) return res.status(400).send({ message: "Bad request" });
  const { email, recoveryKey, newPassword } = req.body;
  console.log(req.body);
  if (!recoveryKey)
    return res.status(401).json({ message: "Nie podano klucza" });
  if (!newPassword)
    return res.status(401).json({ message: "Nie podano nowego hasła" });
  if (newPassword.length < 8)
    return res.status(400).send({
      message: "Hasło musi składać sie z co najmniej 8 znaków",
    });
  try {
    await Recovery.findOne({ email: email })
      .select(["email", "recoveryKey"])
      .lean()
      .then(async (result) => {
        if (result) {
          console.log(result, result.recoveryKey === recoveryKey);
          let compareKeys = result.recoveryKey === recoveryKey;
          if (compareKeys) {
            let hashedPass = await bcrypt.hash(
              newPassword,
              Number(process.env.bcrypt_salt)
            );
            try {
              await Register.findOneAndUpdate(
                { email: email },
                { password: hashedPass }
              );
              await Recovery.findOneAndDelete({ email: email });
              return res.status(200).json({
                success: true,
                message: "Zmiana hasła powiodła się",
              });
            } catch (error) {
              console.log(error);
              return res.status(500);
            }
          } else {
            res.status(400).json({ message: "Klucz nie jest poprawny" });
          }
        }
      });
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});
app.get("/free", (req, res) => {
  res.json({ message: "Zawartość nie zabezpieczona" });
});
app.get("/protected", auth, (req, res) => {
  res.json({ message: "Zawartość zabezpieczona. Dostęp przyznany" });
});
module.exports = app;
