/**
 * @jest-environment jsdom
 */

import { createSpriteSystem } from "./sprite-system"
import { addComponent, addEntity, createWorld, IWorld, System } from "bitecs"
import Phaser from "phaser"
import { Sprite } from "../components/sprite"
import { Position } from "../components/position"

describe("createSpriteSystem", () => {
  let system: System
  let world: IWorld
  let eid: number
  let scene: Phaser.Scene

  beforeEach(() => {
    scene = new Phaser.Scene("test")
    system = createSpriteSystem(scene as unknown as Phaser.Scene, ["ufo"])

    world = createWorld()
    eid = addEntity(world)

    addComponent(world, Position, eid)
    addComponent(world, Sprite, eid)

    Sprite.texture[eid] = 0
  })

  it("defines system", () => {
    expect(createSpriteSystem).toBeDefined()

    expect(system).toBeDefined()
  })

  it("sets sprite with position attributes", () => {
    system(world)

    // scene.add.sprite(0, 0, textures[Sprite.texture[eid]])
    expect(scene.add.sprite).toHaveBeenCalledWith(0, 0, "ufo")
  })
})
