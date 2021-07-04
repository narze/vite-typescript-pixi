import * as PIXI from "pixi.js"
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
  container: PIXI.Container,
  textures: PIXI.Texture[]
): System => {
  const spritesById = new Map<number, PIXI.Sprite>()
  const spriteQuery = defineQuery([Sprite, Position])
  const spriteQueryEnter = enterQuery(spriteQuery)
  const spriteQueryExit = exitQuery(spriteQuery)

  const SpriteSystem = defineSystem((world) => {
    const enterEntities = spriteQueryEnter(world)
    enterEntities.forEach((eid) => {
      const sprite = new PIXI.Sprite(textures[Sprite.texture[eid]])
      sprite.anchor.set(0.5)

      spritesById.set(eid, container.addChild(sprite))
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
