import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/ETDispatchApi/upload',   
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/ETDispatchApi/staffmanager?obj',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/ETDispatchApi/myupload/' + id,
    method: 'get'
  })
}

export function delObj(Id) {
  return fetch({
    url: '/ETDispatchApi/staffmanager/' + Id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return fetch({
    url: '/ETDispatchApi/staffmanager?upUser',
    method: 'put',
    data: obj
  })
}


export default{
    handleChange(file, fileList) {
        this.fileList = fileList; 
        var ids=handleUpOrDel(fileList);  
    },  
    handleRemove(file, fileList){
        this.fileList = fileList;  
        var ids=handleUpOrDel(fileList);
    },
    handleUpOrDel(fileList){
       let ids="";
       if(fileList){
            for(var i =0; i < fileList.length; i++){ 
                console.log(fileList[i].response);
                var obj = fileList[i].response; 
                if(obj){
                    if(obj.code){
                         ids +=obj.record.successResponse[0].id;
                         if(i < fileList.length - 1){
                            ids +=",";
                         }
                    }
                }
            } 
        }
        return ids;  
    }
}