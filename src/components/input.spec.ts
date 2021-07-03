import { Input } from "./input"

describe("Input", () => {
  it("exists as a component type", () => {
    expect(Input).toBeDefined()
    expect(Input).toEqual(
      expect.objectContaining({
        up: expect.any(Int8Array),
        down: expect.any(Int8Array),
        left: expect.any(Int8Array),
        right: expect.any(Int8Array),
      })
    )
  })
})
