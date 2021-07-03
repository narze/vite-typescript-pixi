import { Velocity } from "./velocity"

describe("Velocity", () => {
  it("exists as a component type", () => {
    expect(Velocity).toBeDefined()
    expect(Velocity).toEqual(
      expect.objectContaining({
        x: expect.any(Int8Array),
        y: expect.any(Int8Array),
      })
    )
  })
})
