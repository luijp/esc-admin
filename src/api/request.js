import axios from 'axios';

import {ElMessage, ElMessageBox} from "element-plus";
import {h, ref} from 'vue'

import * as authApi from './auth'

const instance = axios.create({
    baseURL: "/api",
    withCredentials: true,
});
instance.interceptors.response.use(function (resp) {
    if (resp.data.code === -403) {
        const username = ref("")
        const password = ref("")
        ElMessageBox({
            title: "请先登录",
            message: h("div", null, [
                h("input", {
                    placeholder: "用户名",
                    modelValue: username.value,
                    onChange: (value) => {
                        username.value = value.target.value
                    },
                    style: "margin-bottom:10px;height: 30px;width: 100%;border-radius: 5px;border: 1px solid #b4b4c7;padding-left:10px;",
                }, ""),
                h("input", {
                    placeholder: "密码",
                    modelValue: password.value,
                    type: "password",
                    style: "  height: 30px;width: 100%;border-radius: 5px;border: 1px solid #b4b4c7;padding-left:10px;",
                    onChange: (value) => {
                        password.value = value.target.value
                    }

                }, "")
            ]),
            confirmButtonText: '登录',
            beforeClose: async (action, instance, done) => {
                const status = await authApi.login(username.value, password.value)
                if (status.code === 0) {
                    done();
                }
            }
        }).then(() => {
            ElMessage({
                message: '登录成功',
                type: 'success',
            })
        })
    } else if (resp.data.code !== 0) {
        ElMessage.error(resp.data.msg)
        return null;
    }
    return resp.data;
}, function (error) {
    ElMessage.error("服务器无法连接")
});
export default instance;