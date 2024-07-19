import request from "./request.js";

export async function getLoginFailed() {
    return await request.post("/login_failed/list")
}