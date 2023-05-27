import axios from "axios";
export function Register(nick, email, pass, dateOfbirth, sex) {
  return axios.post(`http://192.168.0.15:3001/auth/register`, {
    username: nick,
    email: email,
    password: pass,
    sex: sex,
    dateOfBirth: dateOfbirth,
  });
}

export function Login(username, password, ip, browser) {
  return axios.post(`http://192.168.0.15:3001/auth/login`, {
    username: username,
    password: password,
    ip: ip,
    browser: browser
  });
}

export function GenerateKey(email, ip, browser) {
  return axios.post(`http://192.168.0.15:3001/auth/recovery-key`, {
    email: email,
    ip: ip,
    browser: browser
  });
}

export function RecoveryPass(email, key, pass, passconf, ip, browser) {
  return axios.post(`http://192.168.0.15:3001/auth/password-recovery`, {
    email: email,
    recoveryKey: key,
    newPassword: pass,
    newPasswordConf: passconf,
    ip: ip,
    browser: browser
  });
}
export async function Messages() {
  return axios.get(`http://192.168.0.15:3001/api/global`);
}
export function CreateRoom(user, name){
  return axios.post(`http://192.168.0.15:3001/api/create-room`, {
    user: user,
    name: name
  });
}
export function JoinRoom(user, code){
  return axios.post(`http://192.168.0.15:3001/api/join-room`, {
    user: user,
    code: code
  });
}
export function Chats(user){
  return axios.post(`http://192.168.0.15:3001/api/chats`, {
    user: user,
  });
}
export function Room(id){
  return axios.post(`http://192.168.0.15:3001/api/room`, {
    id: id,
  });
}
export function Logs(id){
  return axios.post(`http://192.168.0.15:3001/user/logs`, {
    id: id,
  });
}
export function accountDelete(user, pass){
  return axios.post(`http://192.168.0.15:3001/api/deleteacc`, {
    user: user,
    pass: pass,
  });
}