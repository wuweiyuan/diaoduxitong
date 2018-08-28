import fetch from 'utils/fetch';
// PastYearStatistics

// export function page(query) {
//   return fetch({
//     url: '/ETDispatchApi/CurrentYearStatistics',   
//     method: 'get',
//     params: query
//   });
// }


export function page(query) {
  return fetch({
    url: '/bmapi/CurrentYearStatistics',   
    method: 'get',
    params: query
  });
}



// export function page(query) {
//   return fetch({
//     url: '/bmapi/CurrentYearStatistics',   
//     method: 'get',
//     params: query
//   });
// }


export function pageTable(query) {
  return fetch({
    url: '/bmapi/CurrentYearTable',   
    method: 'get',
    params: query
  });
}


