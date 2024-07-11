import request from "./request.js";

export async function getTags(){
    return await request.get("/tags/")
}

export async function updateTag(tag){
    return await request.post('/tags/update', tag)
}

export async function deleteTag(tagId){
    return await request.post(`/tags/del/${tagId}`)
}