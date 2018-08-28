import fetch from 'utils/fetch';

export function page(obj) {
  return fetch({
    url: '/bmapi/viewLog',   
    method: 'get',
    params:obj
  });
}