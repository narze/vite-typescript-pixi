import { Position } from "./position"

describe("Position", () => {
  it("exists as a component type", () => {
    expect(Position).toBeDefined()
    expect(Position).toEqual(
      expect.objectContaining({
        x: expect.any(Float32Array),
        y: expect.any(Float32Array),
        a: expect.any(Float32Array),
      })
    )
  })
})
