import { createInputSystem } from "./input-system"
import { addComponent, addEntity, createWorld, IWorld, System } from "bitecs"
import { Velocity } from "../components/velocity"
import { Input } from "../components/input"

describe("createInputSystem", () => {
  let system: System
  let world: IWorld
  let eid: number

  beforeEach(() => {
    system = createInputSystem()
    world = createWorld()
    eid = addEntity(world)

    addComponent(world, Velocity, eid)
    addComponent(world, Input, eid)
  })

  it("defines system", () => {
    expect(createInputSystem).toBeDefined()

    expect(system).toBeDefined()
  })

  it("sets velocity x to 5 when right input is 1", () => {
    Input.right[eid] = 1

    system(world)

    expect(Velocity.x[eid]).toEqual(5)
  })

  it("sets velocity x to -5 when left input is 1", () => {
    Input.left[eid] = 1

    system(world)

    expect(Velocity.x[eid]).toEqual(-5)
  })

  it("sets velocity x to 0 when left & right input is both 1", () => {
    Input.left[eid] = 1
    Input.right[eid] = 1

    system(world)

    expect(Velocity.x[eid]).toEqual(0)
  })

  it("sets velocity y to 5 when down input is 1", () => {
    Input.down[eid] = 1

    system(world)

    expect(Velocity.y[eid]).toEqual(5)
  })

  it("sets velocity y to -5 when up input is 1", () => {
    Input.up[eid] = 1

    system(world)

    expect(Velocity.y[eid]).toEqual(-5)
  })

  it("sets velocity y to 0 when up & down input is both 1", () => {
    Input.up[eid] = 1
    Input.down[eid] = 1

    system(world)

    expect(Velocity.y[eid]).toEqual(0)
  })
})
