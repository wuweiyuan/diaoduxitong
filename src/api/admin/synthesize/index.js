import fetch from 'utils/fetch';

export function page1(query) {
    return fetch({
        url: '/bmapi/FtpAmend/GetFtp',
        method: 'get',
        params: query
    });
}

export function page2(query) {
    return fetch({
        url: '/bmapi/FtpAmend/GetDebug',
        method: 'get',
        params: query
    });
}

export function addObj(obj) {
    return fetch({
        url: '/bmapi/FtpAmend',
        method: 'post',
        data: obj
    });
}

export function getObj(id) {
    return fetch({
        url: '/bmapi/admin/gateLog/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return fetch({
        url: '/bmapi/admin/gateLog/' + id,
        method: 'delete'
    })
}

export function putObj(obj) {
    return fetch({
        url: '/bmapi/FtpAmend/updateftppwd',
        method: 'put',
        data: obj
    })
}


export function putLog(obj) {
    return fetch({
        url: '/bmapi/FtpAmend/updatebugflg',
        method: 'put',
        data: obj
    })
}

