import { } from "./util/polyfills";
import { registerSW } from 'virtual:pwa-register'
import App from './App.svelte'


const updateSW = registerSW({
  onOfflineReady() {
    console.log("[ServiceWorker] Ready to work offline!")
  }
})

const app = new App({
  target: document.getElementById('app')
})

export default app
