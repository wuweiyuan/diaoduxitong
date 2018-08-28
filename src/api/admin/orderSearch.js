import fetch from 'utils/fetch';
// orderSearch
export function page(query) {
  return fetch({
    url: '/bmapi/orderSearch',   
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/bmapi/partner?obj',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/bmapi/staffmanager/' + id,
    method: 'get'
  })
}

export function putObj(obj) {
  return fetch({
    url: '/bmapi/staffmanager?upUser',
    method: 'put',
    data: obj
  })
}

export function bindObj(obj) {
  return fetch({
    url: '/bmapi/binding',
    method: 'put',
    data: obj
  })
}

export function unBindObj(obj) {
  return fetch({
    url: '/bmapi/removebinding ',
    method: 'put',
    data: obj
  })
}

export function delObj(obj){
  return fetch({
    url: '/bmapi/order',
    method: 'put',
    data: obj
  })
}

export function downObj(form){
  return fetch({
    url: '/bmapi/downOrder?Id='+form.Id+"&token="+form.token,
    method: 'get'
  })
}