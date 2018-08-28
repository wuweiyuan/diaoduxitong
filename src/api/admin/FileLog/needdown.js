import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/bmapi/import',   
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/bmapi/import?obj',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/bmapi/import/' + id,
    method: 'get'
  })
}

export function delObj(Id) {
  return fetch({
    url: '/bmapi/import/' + Id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return fetch({
    url: '/bmapi/staffmanager?upUser',
    method: 'put',
    data: obj
  })
}
