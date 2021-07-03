const Phaser = jest.requireActual("phaser")

Phaser.Scene = jest.fn().mockImplementation(() => ({
  add: {
    sprite: jest.fn().mockReturnThis(),
  },
  physics: {
    add: {
      sprite: jest.fn(() => ({
        setVelocity: jest.fn().mockReturnThis(),
        setBounce: jest.fn().mockReturnThis(),
        setCollideWorldBounds: jest.fn().mockReturnThis(),
        body: { velocity: { x: 0, y: 0 } },
      })),
    },
  },
}))

export default Phaser
