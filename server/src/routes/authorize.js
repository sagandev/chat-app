import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
const app = express.Router();
import User from "../schema/user.js";
import sha256 from "crypto-js/sha256.js";
import mailer from "../utils/mail.js";
import generator from "generate-password";
import bcrypt from "bcrypt";
import Recovery from "../schema/recovery.js";
import jwt from "jsonwebtoken";
import auth from "../utils/auth.js";
import moment from "moment";
import uniqueString from "unique-string";
app.post("/register", async (req, res) => {
  try {
    const { username, password, email, sex, dateOfBirth } = req.body;
    if (!req.body) return res.status(400).send({ message: "Unauthorized" });
    if (!password || !username || !email || !sex || !dateOfBirth)
      return res.status(400).send({ message: "Unauthorized" });
    let user = await User.findOne({ email: email });
    let userName = await User.findOne({ username: username });
    if (user || userName) {
      return res.status(400).send({
        message: "User already exists!",
      });
    }
    if (password.length < 8) {
      return res.status(400).send({ message: "Wrong password length" });
    }
    try {
      const passHashed = await bcrypt.hash(
        password,
        Number(process.env.bcrypt_salt)
      );
      const date = moment().subtract(10, "days").calendar();
      const us = "User";
      const colors = ['red', 'green', 'purple', 'lightblue', 'yellow', 'orange'];
      User.create({
        username: username,
        password: passHashed,
        email: email,
        sex: sex,
        dateOfBirth: dateOfBirth,
        role: us,
        avatar: username.substring(0, 2),
        createdAt: date,
        avatarColor: colors[Math.floor(Math.random() * colors.length)]
      })
        .then((user) => {
          const u = {
            avatar: user.avatar,
            username: user.username,
            createdAt: user.createdAt,
            dateOfBirth: user.dateOfBirth,
            email: user.email,
            role: user.role,
            sex: user.sex,
            avatarColor: user.avatarColor
          };
          res.status(200).json({
            message: "Signed up successfully",
            u,
          });
        })
        .catch((e) => {
          console.log(e);
          res.status(401).json({
            message: "Signed up failed",
          });
        });
    } catch (e) {
      console.log(e);
      res.status(401).json({
        message: "Signed up failed",
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
    await User.findOne({ username: username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((response) => {
            if (!response)
              return res.status(401).json({
                success: false,
                message: "Log in failed. Incorrect username or password",
              });
            const token = jwt.sign(
              {
                userId: user._id,
                userUsername: user.username,
              },
              process.env.SECRET,
              { expiresIn: "24h" }
            );
            res.status(200).send({
              success: true,
              message: "Logged in successfully",
              token,
              user: {
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                id: user._id,
                avatarColor: user.avatarColor,
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
          message: "Log in failed. Incorrect username or password",
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
  User.findOne({ email: email })
    .select("email")
    .lean()
    .then(async (result) => {
      if (!result) {
        return res.status(404).json({ message: "Account does not exists" });
      } else {
        await Recovery.findOne({ email: email })
          .select("email")
          .lean()
          .then(async (result) => {
            if (!result) {
              const unique = uniqueString();
              try {
                Recovery.create({
                  email: email,
                  recoveryKey: unique,
                }).then((user) => {
                  try {
                    mailer(
                      user.email,
                      `[${user.email}] Your recovery key`,
                      `Recovery key`,
                      `Your recovery key: <b>${user.recoveryKey}</b><br><br><i>chatapp.saganowski.ovh</i>`
                    );
                    return res.status(200).json({
                      success: true,
                      message: "Recovery key has been sent. Check SPAM folder.",
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
                message: "Recovery key has been already sent",
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
  const { email, recoveryKey, newPassword, newPasswordConf} = req.body;
  if (!recoveryKey)
    return res.status(401).json({ message: "Recovery key not provided" });
  if (!newPassword)
    return res.status(401).json({ message: "Password not provided" });
  if (newPassword.length < 8)
    return res.status(400).send({
      message: "The password cannot be less than 8 characters",
    });
    if(newPassword !== newPasswordConf){
      return res.status(400).send({
        message: "Passwords are not identical.",
      });
    }
  try {
    await Recovery.findOne({ email: email })
      .select(["email", "recoveryKey"])
      .lean()
      .then(async (result) => {
        if (result) {
          let compareKeys = result.recoveryKey === recoveryKey;
          if (compareKeys) {
            let hashedPass = await bcrypt.hash(
              newPassword,
              Number(process.env.bcrypt_salt)
            );
            try {
              await User.findOneAndUpdate(
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
export default app;
