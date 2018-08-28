import fetch from 'utils/fetch';
// LoginByEmail

export function loginByEmail(name, password,lockinnum) {
  const data = {
    name,
    password,
    lockinnum
  };
//   return fetch({
//     url: '/login/login',
//     method: 'get'
    
   
//   });
// }

return fetch({
  url: '/bmapi/login',
  method: 'get',
  data: data
});
}



export function logout() {
  return fetch({
    url: '/api/auth/jwt/invalid',
    method: 'post'
  });
}

// export function getInfo(token) {
//   return fetch({
//     url: '/api/admin/user/front/info',
//     method: 'get',
//     params: { token }
//   });
// }

export function getInfo(token) {
  return fetch({
    url: '/bmapi/info',
    method: 'get',
    params: { token }
  })
}


// export function getMenus(token) {
//   return fetch({
//     url: '/api/admin/user/front/menus',
//     method: 'get',
//     params: { token }
//   });
// }



export function getMenus(token) {
  return fetch({
    url: '/bmapi/menu',
    method: 'get',
    params: { token }
  });
}