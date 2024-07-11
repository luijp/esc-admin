import request from "./request.js";

export async function getTags(){
    return (await request.get("/tags/")).data
}

export async function updateTag(tag){
    return (await request.post('/tags/update', tag)).data
}

export async function deleteTag(tagId){
    return (await request.post(`/tags/del/${tagId}`)).data
}