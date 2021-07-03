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
import { createSpritePhysicsSystem } from "../systems/sprite-physics-system"
import { SpritePhysics } from "../components/sprite-physics"

export default class HelloWorldScene {
  private player: number
  private enemies: number[] = []
  private world: IWorld
  private pipeline: System

  constructor(app: PIXI.Application) {
    const container = new PIXI.Container()

    app.stage.addChild(container)

    // Create a new texture
    const texture = PIXI.Texture.from("assets/ufo.png")

    // // Create a 5x5 grid of bunnies
    // for (let i = 0; i < 25; i++) {
    //   const bunny = new PIXI.Sprite(texture)
    //   bunny.anchor.set(0.5)
    //   bunny.x = (i % 5) * 40
    //   bunny.y = Math.floor(i / 5) * 40

    //   if (i % 2 == 0) {
    //     container.addChild(bunny)
    //   }
    // }

    // // Move container to the center
    // container.x = app.screen.width / 2
    // container.y = app.screen.height / 2

    // // Center bunny sprite in local container coordinates
    // container.pivot.x = container.width / 2
    // container.pivot.y = container.height / 2

    // // Listen for animate update
    // app.ticker.add((delta) => {
    //   // rotate the container!
    //   // use delta to create frame-independent transform
    //   container.rotation -= 0.01 * delta
    // })

    this.world = createWorld()
    this.player = addEntity(this.world)
    // this.enemies.push(addEntity(this.world))

    const spriteSystem = createSpriteSystem(container, [texture])
    // const spritePhysicsSystem = createSpritePhysicsSystem(this, [
    //   "ufo",
    //   "bullet",
    //   "ghost",
    // ])
    const movementSystem = createMovementSystem()
    const inputSystem = createInputSystem()

    this.pipeline = pipe(
      inputSystem,
      movementSystem,
      spriteSystem
      // spritePhysicsSystem
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

    app.ticker.add((delta) => {
      // console.log(delta)
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

  // preload(): void {
  //   this.load.setBaseURL("https://labs.phaser.io")

  //   this.load.image("ufo", "assets/sprites/ufo.png")
  //   this.load.image("bullet", "assets/sprites/bullets/bullet4.png")
  //   this.load.image("ghost", "assets/sprites/ghost.png")
  // }

  // create(): void {
  //   addComponent(this.world, Position, this.player)

  //   Position.x[this.player] = 100
  //   Position.y[this.player] = 100

  //   addComponent(this.world, Velocity, this.player)

  //   Velocity.x[this.player] = 0
  //   Velocity.y[this.player] = 0

  //   addComponent(this.world, Sprite, this.player)

  //   Sprite.texture[this.player] = 0

  //   addComponent(this.world, Input, this.player)

  //   this.enemies.forEach((enemy) => {
  //     addComponent(this.world, Position, enemy)
  //     addComponent(this.world, SpritePhysics, enemy)

  //     Position.x[enemy] = 300
  //     Position.y[enemy] = 300
  //     SpritePhysics.texture[enemy] = 2
  //   })

  //   this.input.keyboard.on("keydown", this.onKeyDown, this)
  // }

  // onKeyDown(event: KeyboardEvent): void {
  //   console.log(event.code)

  //   if (event.code === "Space") {
  //     const newEntity = addEntity(this.world)

  //     addComponent(this.world, Position, newEntity)
  //     addComponent(this.world, Velocity, newEntity)
  //     addComponent(this.world, Sprite, newEntity)

  //     Position.x[newEntity] = Position.x[this.player]
  //     Position.y[newEntity] = Position.y[this.player]

  //     Velocity.x[newEntity] = 10
  //     Velocity.y[newEntity] = 10

  //     Position.a[newEntity] = Math.atan2(
  //       Velocity.y[newEntity],
  //       Velocity.x[newEntity]
  //     )

  //     Sprite.texture[newEntity] = 1
  //   }
  // }

  // update(): void {
  //   const cursors = this.input.keyboard.createCursorKeys()

  //   Input.left[this.player] = cursors.left.isDown ? 1 : 0
  //   Input.right[this.player] = cursors.right.isDown ? 1 : 0
  //   Input.down[this.player] = cursors.down.isDown ? 1 : 0
  //   Input.up[this.player] = cursors.up.isDown ? 1 : 0

  //   this.pipeline(this.world)
  // }
}
