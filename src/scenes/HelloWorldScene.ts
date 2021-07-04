import * as PIXI from "pixi.js"
import {
  addComponent,
  addEntity,
  createWorld,
  IWorld,
  pipe,
  System,
} from "bitecs"
import { createInputSystem } from "../systems/input-system"
import { createSpriteSystem } from "../systems/sprite-system"
import { createMovementSystem } from "../systems/movement-system"
import { Input } from "../components/input"
import { Sprite } from "../components/sprite"
import { Velocity } from "../components/velocity"
import { Position } from "../components/position"
import { createPhysicsSystem } from "../systems/physics-system"
import Matter from "matter-js"
import { Physics } from "../components/physics"

export default class HelloWorldScene {
  private player: number
  private enemies: number[] = []
  private world: IWorld
  private pipeline: System
  private engine: Matter.Engine

  constructor(app: PIXI.Application) {
    const container = new PIXI.Container()

    app.stage.addChild(container)

    const textures = [
      PIXI.Texture.from("assets/ufo.png"),
      PIXI.Texture.from("assets/ghost.png"),
    ]

    this.world = createWorld()
    this.player = addEntity(this.world)

    for (let i = 0; i < 15; i++) {
      this.enemies.push(addEntity(this.world))
    }

    this.engine = Matter.Engine.create()

    const spriteSystem = createSpriteSystem(container, textures)
    const movementSystem = createMovementSystem()
    const inputSystem = createInputSystem()
    const physicsSystem = createPhysicsSystem(this.engine)

    this.pipeline = pipe(
      inputSystem,
      movementSystem,
      physicsSystem,
      spriteSystem
    )

    addComponent(this.world, Sprite, this.player)
    Sprite.texture[this.player] = 0

    addComponent(this.world, Position, this.player)
    Position.x[this.player] = 100
    Position.y[this.player] = 100

    addComponent(this.world, Velocity, this.player)
    Velocity.x[this.player] = 0
    Velocity.y[this.player] = 0

    addComponent(this.world, Input, this.player)

    this.enemies.forEach((enemy) => {
      addComponent(this.world, Position, enemy)
      addComponent(this.world, Velocity, enemy)
      addComponent(this.world, Sprite, enemy)
      addComponent(this.world, Physics, enemy)

      Position.x[enemy] = 100 + Math.random() * 600
      Position.y[enemy] = 0 + Math.random() * 500
      Sprite.texture[enemy] = 1
    })

    // Static ground
    const ground = Matter.Bodies.rectangle(400, 800, 800, 1, {
      isStatic: true,
    })

    Matter.Composite.add(this.engine.world, ground)

    const up = this.keyboard("ArrowUp")
    up.press = () => {
      Input.up[this.player] = 1
    }
    up.release = () => {
      Input.up[this.player] = 0
    }

    const down = this.keyboard("ArrowDown")
    down.press = () => {
      Input.down[this.player] = 1
    }
    down.release = () => {
      Input.down[this.player] = 0
    }

    const left = this.keyboard("ArrowLeft")
    left.press = () => {
      Input.left[this.player] = 1
    }
    left.release = () => {
      Input.left[this.player] = 0
    }

    const right = this.keyboard("ArrowRight")
    right.press = () => {
      Input.right[this.player] = 1
    }
    right.release = () => {
      Input.right[this.player] = 0
    }

    app.ticker.add((_dt) => {
      Matter.Engine.update(this.engine)
      this.pipeline(this.world)
    })
  }

  keyboard(value: string) {
    let key: any = {}
    key.value = value
    key.isDown = false
    key.isUp = true
    key.press = undefined
    key.release = undefined
    //The `downHandler`
    key.downHandler = (event: any) => {
      if (event.key === key.value) {
        if (key.isUp && key.press) key.press()
        key.isDown = true
        key.isUp = false
        event.preventDefault()
      }
    }

    //The `upHandler`
    key.upHandler = (event: any) => {
      if (event.key === key.value) {
        if (key.isDown && key.release) key.release()
        key.isDown = false
        key.isUp = true
        event.preventDefault()
      }
    }

    //Attach event listeners
    const downListener = key.downHandler.bind(key)
    const upListener = key.upHandler.bind(key)

    window.addEventListener("keydown", downListener, false)
    window.addEventListener("keyup", upListener, false)

    // Detach event listeners
    key.unsubscribe = () => {
      window.removeEventListener("keydown", downListener)
      window.removeEventListener("keyup", upListener)
    }

    return key
  }
}
