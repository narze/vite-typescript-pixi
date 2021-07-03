import { Sprite } from "./sprite"

describe("Sprite", () => {
  it("exists as a component type", () => {
    expect(Sprite).toBeDefined()
    expect(Sprite).toEqual(
      expect.objectContaining({
        texture: expect.any(Uint8Array),
      })
    )
  })
})
