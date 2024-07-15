import {ref, watchEffect} from "vue";

const siteTitle = ref('ESC Admin')
const routeTitle = ref('')

watchEffect(() => {
    document.title = `${routeTitle.value} - ${siteTitle.value}`
})

export default {siteTitle, routeTitle};