import Matter from "matter-js"
import {
  defineQuery,
  defineSystem,
  enterQuery,
  exitQuery,
  Not,
  System,
} from "bitecs"
import { Position } from "../components/position"
import { Input } from "../components/input"
import { Velocity } from "../components/velocity"
import { Physics } from "../components/physics"

export const createPhysicsSystem = (engine: Matter.Engine): System => {
  const bodiesById = new Map<number, Matter.Body>()
  const physicsQuery = defineQuery([Position, Velocity, Physics, Not(Input)])
  const physicsQueryEnter = enterQuery(physicsQuery)
  const physicsQueryExit = exitQuery(physicsQuery)

  const SpriteSystem = defineSystem((world) => {
    const enterEntities = physicsQueryEnter(world)

    enterEntities.forEach((eid) => {
      const body = Matter.Bodies.rectangle(
        Position.x[eid],
        Position.y[eid],
        96,
        96,
        {
          restitution: 0.9,
          velocity: { x: Velocity.x[eid], y: Velocity.y[eid] },
        }
      )

      bodiesById.set(eid, body)

      Matter.Composite.add(engine.world, body)
    })

    const entities = physicsQuery(world)
    entities.forEach((eid) => {
      const body = bodiesById.get(eid)

      if (body) {
        Position.x[eid] = body.position.x
        Position.y[eid] = body.position.y
        Position.a[eid] = body.angle
        Velocity.x[eid] = body.velocity.x
        Velocity.y[eid] = body.velocity.y
      }
    })

    const exitEntities = physicsQueryExit(world)
    exitEntities.forEach((eid) => {
      const body = bodiesById.get(eid)

      if (body) {
        // body.destroy()
        bodiesById.delete(eid)
      }
    })

    return world
  })

  return SpriteSystem
}
