import fetch from 'utils/fetch';
// orderDetail


export function page(query) {
  return fetch({
    url: '/bmapi/bedinfo',   
    method: 'get',
    params: query
  });
}

//床信息
export function pageBed(query) {
  return fetch({
    url: '/bmapi/bedinfo?Id='+query,   
    method: 'get',
  });
}

// 工序列表
export function pageStep(id) {
  return fetch({
    url: '/bmapi/orderDetailProcess?ModelId='+id,   
    method: 'get'
  });
}


// 生产单详情
export function pageProduct(query) {
  return fetch({
    url: '/bmapi/OrderDetail?Id='+query,   
    method: 'get'
  });
}
//加载床信息
export function getbedlist(query) {
  return fetch({
    url: '/bmapi/orderDetail',   
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
    url: '/bmapi/styleDetailProcess' ,
    method: 'get'
  })
}

export function delObj(Id) {
  return fetch({
    url: '/bmapi/staffmanager/' + Id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return fetch({
    url: '/bmapi/staffmanager?upUser',
    method: 'put',
    data: obj
  })
}

export function podObj(obj) {
  return fetch({
    url: '/bmapi/podinfo?id='+obj,   
    method: 'get'
  })
}

//重置工序
export function resetProcess(obj) {
  return fetch({
    url: '/bmapi/pc',   
    method: 'post',
    data:obj
  })
}

//新增产量链接
export function GetProInfo(obj) {
  return fetch({
    url: '/bmapi/GetProInfo?orderId='+obj,   
    method: 'get'
  })
}