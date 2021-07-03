const Phaser = jest.requireActual("phaser")

Phaser.Scene = jest.fn().mockImplementation(() => ({
  add: {
    sprite: jest.fn(() => ({
      setVelocity: jest.fn().mockReturnThis(),
      body: {
        velocity: { x: 0, y: 0 },
        setVelocity: jest.fn().mockReturnThis(),
        setBounce: jest.fn().mockReturnThis(),
        setCollideWorldBounds: jest.fn().mockReturnThis(),
      },
    })),
  },
  physics: {
    add: {
      existing: jest.fn(),
      sprite: jest.fn(),
    },
  },
}))

export default Phaser
