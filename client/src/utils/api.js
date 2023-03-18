import axios from "axios";
export function Register(nick, email, pass, dateOfbirth, sex) {
  return axios.post(`http://192.168.0.15:3001/authorize/register`, {
    username: nick,
    email: email,
    password: pass,
    sex: sex,
    dateOfBirth: dateOfbirth,
  });
}

export function Login(username, password) {
  return axios.post(`http://192.168.0.15:3001/authorize/login`, {
    username: username,
    password: password,
  });
}

export function GenerateKey(email) {
  return axios.post(`http://192.168.0.15:3001/authorize/recovery-key`, {
    email: email,
  });
}

export function Recovery(email, key, pass) {
  return axios.post(`http://192.168.0.15:3001/authorize/password-recovery`, {
    email: email,
    recoveryKey: key,
    newPassword: pass,
  });
}