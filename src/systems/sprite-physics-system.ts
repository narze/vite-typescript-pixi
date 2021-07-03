import Phaser from "phaser"
import {
  defineQuery,
  defineSystem,
  enterQuery,
  exitQuery,
  System,
} from "bitecs"
import { Position } from "../components/position"
import { SpritePhysics } from "../components/sprite-physics"

export const createSpritePhysicsSystem = (
  scene: Phaser.Scene,
  textures: string[]
): System => {
  const spritesById = new Map<number, Phaser.GameObjects.Sprite>()
  const spriteQuery = defineQuery([SpritePhysics, Position])
  const spriteQueryEnter = enterQuery(spriteQuery)
  const spriteQueryExit = exitQuery(spriteQuery)

  const SpriteSystem = defineSystem((world) => {
    const enterEntities = spriteQueryEnter(world)
    enterEntities.forEach((eid) => {
      const sprite = scene.add.sprite(
        Position.x[eid],
        Position.y[eid],
        textures[SpritePhysics.texture[eid]]
      )

      spritesById.set(eid, sprite)

      scene.physics.add.existing(sprite)
      ;(sprite as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody).body
        .setVelocity(100, 200)
        .setBounce(1, 1)
        .setCollideWorldBounds(true)
    })

    const entities = spriteQuery(world)
    entities.forEach((eid) => {
      const sprite = spritesById.get(eid)

      if (sprite) {
        Position.x[eid] = sprite.x
        Position.y[eid] = sprite.y

        sprite.rotation =
          Math.atan2(sprite.body.velocity.y, sprite.body.velocity.x) -
          Math.PI / 2
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
