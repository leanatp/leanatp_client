/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth(key) {
    return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 获取路由名称, 根据url地址
 * @param {*} url
 */
export function getRouteNameByUrl(url) {
    let val = /.*\/(.*)\.html/.exec(url)
    return val && val.length >= 1 ? val[1] : ''
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate(data, id = 'id', pid = 'parentId') {
    var res = []
    var temp = {}
    for (var i = 0; i < data.length; i++) {
        temp[data[i][id]] = data[i]
    }
    for (var k = 0; k < data.length; k++) {
        if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
            if (!temp[data[k][pid]]['children']) {
                temp[data[k][pid]]['children'] = []
            }
            if (!temp[data[k][pid]]['_level']) {
                temp[data[k][pid]]['_level'] = 1
            }
            data[k]['_level'] = temp[data[k][pid]]._level + 1
            temp[data[k][pid]]['children'].push(data[k])
        } else {
            res.push(data[k])
        }
    }
    return res
}

/**
 * 获取字符串字节长度
 * @param {*} s
 */
export function getStringLength(s) {
    return s.replace(/[\u4e00-\u9fa5\uff00-\uffff]/g, '**').length
}

/**
 * 获取uuid
 */
export function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
    })
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslateForCategory(data, id = 'id', pid = 'parentId') {
    var res = []
    var temp = {}
    for (var i = 0; i < data.length; i++) {
        temp[data[i][id]] = data[i]
    }
    for (var k = 0; k < data.length; k++) {
        if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
            if (!temp[data[k][pid]]['children']) {
                temp[data[k][pid]]['children'] = []
            }
            if (!temp[data[k][pid]]['_level']) {
                temp[data[k][pid]]['_level'] = 1
            }
            data[k]['_level'] = temp[data[k][pid]]._level + 1
            temp[data[k][pid]]['children'].push(data[k])
        } else {
            res.push(data[k])
        }
    }
    return res
}

//for component
export function getTick4Category(API, categoryType) {
    switch (categoryType) {
        case "component":
            return API.categorycomponent;
        case "bizflow":
            return API.categorybizflow;
        case "testcase":
            return API.categorytestcase;
        default:
            return null;
    }
}

export function ArraySortBy(attr, rev) {
    if (rev == undefined) {
        rev = 1;
    } else {
        rev = rev ? 1 : -1;
    }
    return function(a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
            return rev * -1;
        }
        if (a > b) {
            return rev * 1;
        }
        return 0;
    };
}

export function relTreeDataTranslate(data) {
    let temp = {};
    if (data.length === 0) return temp;
    temp = data[0];
    let _node = temp;
    for (var i = 1; i < data.length; i++) {
        _node.children = [data[i]];
        _node.expand = true
        _node = _node.children[0];
    }
    return temp;
}