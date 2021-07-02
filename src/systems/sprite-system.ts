import Phaser from "phaser"
import {
  defineQuery,
  defineSystem,
  enterQuery,
  exitQuery,
  System,
} from "bitecs"
import { Position } from "../components/position"
import { Sprite } from "../components/sprite"

export const createSpriteSystem = (
  scene: Phaser.Scene,
  textures: string[]
): System => {
  const spritesById = new Map<number, Phaser.GameObjects.Sprite>()
  const spriteQuery = defineQuery([Sprite, Position])
  const spriteQueryEnter = enterQuery(spriteQuery)
  const spriteQueryExit = exitQuery(spriteQuery)

  const SpriteSystem = defineSystem((world) => {
    const enterEntities = spriteQueryEnter(world)
    enterEntities.forEach((eid) => {
      spritesById.set(
        eid,
        scene.add.sprite(0, 0, textures[Sprite.texture[eid]])
      )
    })

    const entities = spriteQuery(world)
    entities.forEach((eid) => {
      const sprite = spritesById.get(eid)

      if (sprite) {
        sprite.x = Position.x[eid]
        sprite.y = Position.y[eid]
        sprite.rotation = Position.a[eid]
      }
    })

    const exitEntities = spriteQueryExit(world)
    exitEntities.forEach((eid) => {
      const sprite = spritesById.get(eid)

      if (sprite) {
        sprite.destroy()
        spritesById.delete(eid)
      }
    })

    return world
  })

  return SpriteSystem
}
