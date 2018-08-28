import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/ETDispatchApi/customerinform',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/ETDispatchApi/customerinform?obj',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/ETDispatchApi/customerinform/' + id,
    method: 'get'
  })
}

export function delObj(Id) {
  return fetch({
    url: '/ETDispatchApi/customerinform/' + Id,
    method: 'delete'  
  })
}

export function putObj(obj) {
  return fetch({
    url: '/ETDispatchApi/customerinform',
    method: 'put',
    data: obj
  })
}
