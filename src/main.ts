import './assets/base.css'
import 'vfonts/Lato.css'

import { createApp } from 'vue'
import pinia from './stores/pinia'

import App from './App.vue'
import router from './router'

import setupDirectives from './directives'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const app = createApp(App)

app.use(pinia)
app.use(router)
setupDirectives(app)
app.mount('#app')
