import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Quiz from './views/Quiz.vue'
import Result from './views/Result.vue'
import './assets/main.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/quiz', component: Quiz },
    { path: '/result', component: Result },
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
