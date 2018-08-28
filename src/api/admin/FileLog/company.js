import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/ETDispatchApi/companyfile',   
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

export function getObj(id) {
  return fetch({
    url: '/ETDispatchApi/myupload/' + id,
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
