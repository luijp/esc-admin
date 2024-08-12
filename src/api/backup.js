import request from "./request.js";

export async function backupDatabase() {
    return await request.post('/backup/backup-database');
}

export async function backupUpload() {
    return await request.post('/backup/backup-upload');
}

export async function deleteBackup(fileName) {
    return await request.post('/backup/delete-backup',{"fileName":fileName});
}

export async function listBackup() {
    return await request.post('/backup/list-backup');
}

export function getBackup(fileName) {
    return request.defaults.baseURL + `/backup/get/${fileName}`
}