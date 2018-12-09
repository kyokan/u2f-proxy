import {Server} from '../Server'

window.onload = () => {
  new Server({
    allowedOrigins: ['https://localhost:9000']
  });
}