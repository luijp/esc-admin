import request from "./request.js";

export async function login(username, password) {
    return await request.post('/auth/login', {username: username, password: password});
}

export async function logout() {
    return await request.post('/auth/logout');
}