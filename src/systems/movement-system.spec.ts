import { createMovementSystem } from "./movement-system"
import { addComponent, addEntity, createWorld, IWorld, System } from "bitecs"
import { Velocity } from "../components/velocity"
import { Position } from "../components/position"

describe("createMovementSystem", () => {
  let system: System
  let world: IWorld
  let eid: number

  beforeEach(() => {
    system = createMovementSystem()
    world = createWorld()
    eid = addEntity(world)

    addComponent(world, Position, eid)
    addComponent(world, Velocity, eid)
  })

  it("defines system", () => {
    expect(createMovementSystem).toBeDefined()

    expect(system).toBeDefined()
  })

  it("adds position x by velocity x", () => {
    Velocity.x[eid] = 5

    system(world)

    expect(Position.x[eid]).toEqual(5)

    system(world)

    expect(Position.x[eid]).toEqual(10)

    Velocity.x[eid] = -3

    system(world)

    expect(Position.x[eid]).toEqual(7)

    system(world)

    expect(Position.x[eid]).toEqual(4)
  })

  it("adds position y by velocity y", () => {
    Velocity.y[eid] = 5

    system(world)

    expect(Position.y[eid]).toEqual(5)

    system(world)

    expect(Position.y[eid]).toEqual(10)

    Velocity.y[eid] = -3

    system(world)

    expect(Position.y[eid]).toEqual(7)

    system(world)

    expect(Position.y[eid]).toEqual(4)
  })
})
