import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'
import isInteger from 'lodash/isInteger'

// 获取列表
export function list(params) {
    return request({
        url: requestUrl('/component/componentbizdata/list'),
        method: 'get',
        params: requestParam(params, 'get')
    })
}

// 获取信息
export function info(id) {
    return request({
        url: requestUrl('/component/componentbizdata/info' + (isInteger(id) ? `/${id}` : '')),
        method: 'get',
        params: requestParam({}, 'get')
    })
}

// 添加
export function add(params) {
    return request({
        url: requestUrl('/component/componentbizdata/save'),
        method: 'post',
        data: requestParam(params)
    })
}

// 修改
export function update(params) {
    return request({
        url: requestUrl('/component/componentbizdata/update'),
        method: 'post',
        data: requestParam(params)
    })
}

// 删除
export function del(params) {
    return request({
        url: requestUrl('/component/componentbizdata/delete'),
        method: 'post',
        data: requestParam(params, 'post', false)
    })
}

// 获取列表
export function querykey(bizkey) {
    return request({
        url: requestUrl('/component/componentbizdata/querykey' + `/${bizkey}`),
        method: 'get',
        params: requestParam({}, 'get')
    })
}

export function querykeyWithParent(params) {
    return request({
        url: requestUrl('/component/componentbizdata/querykeywithparent'),
        method: 'get',
        params: requestParam(params, 'get')
    })
}