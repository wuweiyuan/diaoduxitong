import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/ETDispatchApi/partner',   
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/ETDispatchApi/staffmanager?obj',
    method: 'post',
    data: obj
  });
}

export function setOtherOpen(query) {
  return fetch({
    url: '/ETDispatchApi/addme',   
    method: 'get',
    params: query
  });
}

export function getObj(id) {
  return fetch({
    url: '/ETDispatchApi/staffmanager/' + id,
    method: 'get'
  })
}

export function delObj(Id) {
  return fetch({
    url: '/ETDispatchApi/staffmanager/' + Id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return fetch({
    url: '/ETDispatchApi/staffmanager?upUser',
    method: 'put',
    data: obj
  })
}

export function putconfig(obj) {
  return fetch({
    url: '/ETDispatchApi/config?obj',
    method: 'put',
    data: obj
  })
}