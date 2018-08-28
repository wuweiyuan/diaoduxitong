import fetch from 'utils/fetch';
// PieceworkStatistics
export function page(query) {
  return fetch({
    url: '/bmapi/PieceworkStatistics',   
    method: 'get',
    params: query
  });
}

