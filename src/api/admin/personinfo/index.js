import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/ETDispatchApi/personinfo',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/ETDispatchApi/personinfo?obj',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/ETDispatchApi/personinfo/' + id,
    method: 'get'
  })
}

export function delObj(Id) {
  return fetch({
    url: '/ETDispatchApi/personinfo/' + Id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return fetch({
    url: '/ETDispatchApi/personinfo',
    method: 'put',
    data: obj
  })
}
