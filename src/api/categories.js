import request from "./request.js";

export async function getAllCategories() {
    return await request.get('categories/')
}

export async function getCategoriesList() {
    return await request.get('categories/list')
}

export async function updateCategories(category) {
    return await request.post('/categories/update', category)
}

export async function delCategories(id){
    return await request.post(`categories/del/${id}`)
}

export async function getCategoriesByPostId(postId){
    return await request.get(`/categories/get/${postId}`)
}