import fetch from 'utils/fetch';

export function page() {
  return fetch({
    url: '/bmapi/orderSearch?State=3',
    method: 'get'
  });
}

