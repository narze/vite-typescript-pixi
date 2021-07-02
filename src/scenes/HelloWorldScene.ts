import Phaser from "phaser"
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

export default class HelloWorldScene extends Phaser.Scene {
  private player: number
  private enemies: number[] = []
  private world: IWorld
  private pipeline: System

  constructor() {
    super("hello-world")

    this.world = createWorld()
    this.player = addEntity(this.world)
    this.enemies.push(addEntity(this.world))

    const spriteSystem = createSpriteSystem(this, ["ufo", "bullet", "ghost"])
    const spritePhysicsSystem = createSpritePhysicsSystem(this, [
      "ufo",
      "bullet",
      "ghost",
    ])
    const movementSystem = createMovementSystem()
    const inputSystem = createInputSystem()

    this.pipeline = pipe(
      inputSystem,
      movementSystem,
      spriteSystem,
      spritePhysicsSystem
    )
  }

  preload(): void {
    this.load.setBaseURL("http://labs.phaser.io")

    // this.load.image("sky", "assets/skies/space3.png")
    // this.load.image("logo", "assets/sprites/phaser3-logo.png")
    // this.load.image("red", "assets/particles/red.png")

    this.load.image("ufo", "assets/sprites/ufo.png")
    this.load.image("bullet", "assets/sprites/bullets/bullet4.png")
    this.load.image("ghost", "assets/sprites/ghost.png")
  }

  create(): void {
    addComponent(this.world, Position, this.player)

    Position.x[this.player] = 100
    Position.y[this.player] = 100

    addComponent(this.world, Velocity, this.player)

    Velocity.x[this.player] = 0
    Velocity.y[this.player] = 0

    addComponent(this.world, Sprite, this.player)

    Sprite.texture[this.player] = 0

    addComponent(this.world, Input, this.player)

    this.enemies.forEach((enemy) => {
      addComponent(this.world, Position, enemy)
      addComponent(this.world, SpritePhysics, enemy)

      Position.x[enemy] = 300
      Position.y[enemy] = 300
      SpritePhysics.texture[enemy] = 2
    })

    // this.add.image(400, 300, "sky")
    // const particles = this.add.particles("red")
    // const emitter = particles.createEmitter({
    //   speed: 100,
    //   scale: { start: 1, end: 0 },
    //   blendMode: "ADD",
    // })
    // const logo = this.physics.add.image(400, 100, "logo")
    // logo.setVelocity(100, 200)
    // logo.setBounce(1, 1)
    // logo.setCollideWorldBounds(true)
    // emitter.startFollow(logo)

    this.input.keyboard.on("keydown", this.onKeyDown, this)
  }

  onKeyDown(event: KeyboardEvent): void {
    console.log(event.code)

    if (event.code === "Space") {
      const newEntity = addEntity(this.world)

      addComponent(this.world, Position, newEntity)
      addComponent(this.world, Velocity, newEntity)
      addComponent(this.world, Sprite, newEntity)

      Position.x[newEntity] = Position.x[this.player]
      Position.y[newEntity] = Position.y[this.player]

      Velocity.x[newEntity] = 10
      Velocity.y[newEntity] = 10

      Position.a[newEntity] = Math.atan2(
        Velocity.y[newEntity],
        Velocity.x[newEntity]
      )

      Sprite.texture[newEntity] = 1
    }
  }

  update(): void {
    const cursors = this.input.keyboard.createCursorKeys()

    Input.left[this.player] = cursors.left.isDown ? 1 : 0
    Input.right[this.player] = cursors.right.isDown ? 1 : 0
    Input.down[this.player] = cursors.down.isDown ? 1 : 0
    Input.up[this.player] = cursors.up.isDown ? 1 : 0

    this.pipeline(this.world)
  }
}
