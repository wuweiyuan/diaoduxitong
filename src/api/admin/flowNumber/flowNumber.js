import fetch from 'utils/fetch';

export function search(obj) {
  return fetch({
    url: '/bmapi/lsh?lsh='+obj,   
    method: 'get'
  });
}

//下载
export function downLoad(obj) {
    return fetch({
      url: '/bmapi/downloadLSH',     
      method: 'get',
      params: obj
    });
  }