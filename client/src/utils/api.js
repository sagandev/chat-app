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

export function Login(username, password) {
  return axios.post(`http://192.168.0.15:3001/auth/login`, {
    username: username,
    password: password
  });
}

export function GenerateKey(email) {
  return axios.post(`http://192.168.0.15:3001/auth/recovery-key`, {
    email: email,
  });
}

export function RecoveryPass(email, key, pass, passconf) {
  return axios.post(`http://192.168.0.15:3001/auth/password-recovery`, {
    email: email,
    recoveryKey: key,
    newPassword: pass,
    newPasswordConf: passconf
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