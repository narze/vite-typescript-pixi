import { SpritePhysics } from "./sprite-physics"

describe("SpritePhysics", () => {
  it("exists as a component type", () => {
    expect(SpritePhysics).toBeDefined()
    expect(SpritePhysics).toEqual(
      expect.objectContaining({
        texture: expect.any(Uint8Array),
      })
    )
  })
})
