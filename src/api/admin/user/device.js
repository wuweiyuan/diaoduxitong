import fetch from 'utils/fetch';
// PipelineManagement
// ProcessModification
export function page(query) {
  return fetch({
    url: '/bmapi/pl',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/bmapi/pl',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/bmapi/process?id='+id ,
    method: 'get'
  })
}

export function delObj(Id) {
  return fetch({
    url: '/bmapi/staffmanager/' + Id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return fetch({
    url: '/bmapi/pl',
    method: 'put',
    data: obj
  })
}

export function setObj(obj) {
  return fetch({
    url: '/bmapi/pl/setplforuser',
    method: 'put',
    data: obj
  })
}

export function weightObj(obj) {
  return fetch({
    url: '/bmapi/UpdateWeight',
    method: 'post',
    data: obj
  })
}


export function updateName(obj) {
  return fetch({
    url: '/bmapi/UpdatePlName',
    method: 'post',
    data: obj
  })
}