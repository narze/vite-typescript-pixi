import { defineQuery, defineSystem, System } from "bitecs"
import { Velocity } from "../components/velocity"
import { Input } from "../components/input"

export const createInputSystem = (): System => {
  const inputQuery = defineQuery([Input])

  return defineSystem((world) => {
    const ents = inputQuery(world)

    ents.forEach((eid) => {
      Velocity.x[eid] = 5 * (Input.right[eid] - Input.left[eid])
      Velocity.y[eid] = 5 * (Input.down[eid] - Input.up[eid])
    })

    return world
  })
}
