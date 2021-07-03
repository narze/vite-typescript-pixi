import * as PIXI from "pixi.js"
import HelloWorldScene from "./scenes/HelloWorldScene"

const app = new PIXI.Application({ width: 800, height: 800 })

//Add the canvas that Pixi automatically created for you to the HTML document
document.getElementById("app")?.appendChild(app.view)

new HelloWorldScene(app)
