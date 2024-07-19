import request from './request.js'

export async function listAll(pageNum=1,pageSize=10){
    return await request.post(`/comment/listAll/${pageNum}/${pageSize}`)
}

export async function pass(commentId){
    return await request.post(`/comment/pass/${commentId}`)
}

export async function deny(commentId){
    return await request.post(`/comment/deny/${commentId}`)
}

export async function del(commentId){
    return await request.post(`/comment/del/${commentId}`)
}