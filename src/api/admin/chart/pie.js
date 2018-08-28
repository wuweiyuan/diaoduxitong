import fetch from 'utils/fetch';
// TemplateStatistics
export function page(query) {
  return fetch({
    url: '/bmapi/TemplateStatistics',   
    method: 'get',
    params: query
  });
}

