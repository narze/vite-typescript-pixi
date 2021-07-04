import { defineQuery, defineSystem, Not, System } from "bitecs"
import { Position } from "../components/position"
import { Velocity } from "../components/velocity"
import { Physics } from "../components/physics"

export const createMovementSystem = (): System => {
  const movementQuery = defineQuery([Position, Velocity, Not(Physics)])

  return defineSystem((world) => {
    const ents = movementQuery(world)
    for (let i = 0; i < ents.length; i++) {
      const eid = ents[i]
      Position.x[eid] += Velocity.x[eid]
      Position.y[eid] += Velocity.y[eid]
    }

    return world
  })
}
