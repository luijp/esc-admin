import { defineStore } from 'pinia'
import {computed, ref} from "vue";

export const useMsgStore = defineStore('msg', {
    state: ()=>({
        msg: "",
        type: "",

    }),
    getters:{
        ifShow: ()=> this.msg !== ""
    },
    actions:{
        clearMsg(){
             this.msg= ""
        },
        setMsg(msg,type){
            this.msg = msg
            this.type=type
            setTimeout(()=>{
                this.clearMsg()
            },5000)
        }
    }
})