import fetch from 'utils/fetch';
// PastYearStatistics
// export function page(query) {
//   return fetch({
//     url: '/ETDispatchApi/PastYearStatistics',   
//     method: 'get',
//     params: query
//   });
// }

export function page(query) {
  return fetch({
    url: '/bmapi/PastYearStatistics',   
    method: 'get',
    params: query
  });
}

//更新往年统计表
export function pageTable(query) {
  return fetch({
    url: '/bmapi/PastYearStatisticsTable',   
    method: 'get',
    params: query
  });
}
