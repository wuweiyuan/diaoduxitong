import Cookies from 'js-cookie'

const TokenKey = 'ETDispatch-Token'
const RoleKey = 'ETDispatch-role'
const UserKey = 'ETDispatch-userId'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function setRole(token) {
  return Cookies.set(RoleKey, token)
}
export function getRole() {
  return Cookies.get(RoleKey)
}
export function setUserId(token) {
  // console.log(UserKey)
  return Cookies.set(UserKey,token)
}
export function getUserId() {
  return Cookies.get(UserKey)
}
export function removeUserId() {
  return Cookies.remove(UserKey)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function removeRole() {
  return Cookies.remove(RoleKey)
}