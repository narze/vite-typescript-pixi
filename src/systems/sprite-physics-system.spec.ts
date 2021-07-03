/**
 * @jest-environment jsdom
 */

import { createSpritePhysicsSystem } from "./sprite-physics-system"
import { addComponent, addEntity, createWorld, IWorld, System } from "bitecs"
import Phaser from "phaser"
import { Position } from "../components/position"
import { SpritePhysics } from "../components/sprite-physics"

describe("createSpritePhysicsSystem", () => {
  let system: System
  let world: IWorld
  let eid: number
  let scene: Phaser.Scene

  beforeEach(() => {
    scene = new Phaser.Scene("test")
    system = createSpritePhysicsSystem(scene as unknown as Phaser.Scene, [
      "ufo",
    ])

    world = createWorld()
    eid = addEntity(world)

    addComponent(world, Position, eid)
    addComponent(world, SpritePhysics, eid)

    SpritePhysics.texture[eid] = 0
  })

  it("defines system", () => {
    expect(createSpritePhysicsSystem).toBeDefined()

    expect(system).toBeDefined()
  })

  it("sets sprite with position attributes", () => {
    system(world)

    // scene.add.sprite(0, 0, textures[Sprite.texture[eid]])
    expect(scene.add.sprite).toHaveBeenCalledWith(0, 0, "ufo")
    expect(scene.physics.add.existing).toHaveBeenCalled()
  })
})
