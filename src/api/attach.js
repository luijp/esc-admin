import request from "./request.js";

export async function getAllAttach(pageNum = 1, pageSize = 50) {
    return await request.post(`/attach/list/${pageNum}/${pageSize}`)
}

export async function delAttach(uuid) {
    return await request.post(`/attach/del/${uuid}`)
}

export async function updateAttach({file}) {
    const formData = new FormData()
    formData.append('files', file)
    const result = await request.post(`/attach/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    console.log(result)
    if (result.code !== 0 || result.data[0].success !== true) {
        throw new Error()
    }
    return result

}

export function getAttachUrl(uuid, type = 1) {
    if (type === 1) {
        return request.defaults.baseURL + `/attach/download/${uuid}`
    } else {
        return request.defaults.baseURL + `/attach/image/${uuid}`
    }

}