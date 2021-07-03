/**
 * @jest-environment jsdom
 */

import { createSpriteSystem } from "./sprite-system"
import { addComponent, addEntity, createWorld, IWorld, System } from "bitecs"
import { Sprite } from "../components/sprite"
import { Position } from "../components/position"
import * as PIXI from "pixi.js"

describe("createSpriteSystem", () => {
  let system: System
  let world: IWorld
  let eid: number

  beforeEach(() => {
    const container = new PIXI.Container()
    const texture = PIXI.Texture.from("assets/enemy.png")

    system = createSpriteSystem(container, [texture])

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
    // expect(scene.add.sprite).toHaveBeenCalledWith(0, 0, "ufo")
  })
})
