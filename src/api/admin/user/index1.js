
// EmployeeManagement1
import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/bmapi/personal',
    method: 'get',
    params: query
  });
}

// export function page(query) {
//   return fetch({
//     url: '/test/comments',
//     method: 'get',
//     params: query
//   });
// }

export function addObj(obj) {
  return fetch({
    url: '/test/comments?obj',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/test/comments/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/test/comments/' + id,
    method: 'delete'
  })
}

// export function putObj(id,obj) {
//   return fetch({
//     url: '/bmapi/personal/' + id,
//     method: 'put',
//     data: obj
//   })
// }

export function putObj(obj) {
  return fetch({
    url: '/bmapi/personal?obj',
    method: 'put',
    data: obj
  })
}

