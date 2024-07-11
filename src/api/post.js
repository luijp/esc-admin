import request from "./request.js";

export async function getAllPost(pageNum=1, pageSize=10,type=1){
    return await request.get(`/posts/list/${pageNum}/${pageSize}/${type}`)
}

export async function deletePost(id){
    return await request.post(`/posts/del/${id}`)
}

export async function getPost(id){
    return await request.get(`/posts/get/${id}`)
}

export async function updatePost(data){
    return await request.post("/posts/update",data)
}

export async function addTags(tagsIdList,postId){
    return await request.post(`/posts/add/tags/${postId}`,tagsIdList)
}

export async function addCategories(categoriesIdList,postId){
    return await request.post(`/posts/add/categories/${postId}`,categoriesIdList)

}
