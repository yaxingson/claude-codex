import express, { type Express } from 'express'

class HTTPServer {
  app: Express

  constructor() {
    this.app = express()
  }

  listenAndServe(port:number, hostname:string, callback?:()=>void) {
    this.app.listen(port, hostname, callback)
  }
}
