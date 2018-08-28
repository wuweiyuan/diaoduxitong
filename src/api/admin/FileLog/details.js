import fetch from 'utils/fetch';

export function details(query) {
  return fetch({
    url: '/ETDispatchApi/details',   //http://localhost/ETDispatchApi/details?id=655
    method: 'get',
    params: query
  });
}
