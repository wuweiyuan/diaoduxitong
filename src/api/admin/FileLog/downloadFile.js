import fetch from 'utils/fetch';

export function downloadFile(query) {
  return fetch({
    url: '/ETDispatchApi/dowonload',   
    method: 'get',
    responseType: 'arraybuffer',    
    params: query
  });
}

