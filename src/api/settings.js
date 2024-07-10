import request from "./request.js";

export async function getGlobal() {
    return await request.get('settings/global')
}

export async function getCustom() {
    return await request.get('settings/custom')
}

export async function updateGlobal(globalSettings) {
    return await request.post('settings/global',globalSettings)
}

export async function updateCustom(customSettings) {
    return await request.post('settings/custom',customSettings)
}