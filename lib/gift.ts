import confetti from "canvas-confetti"

export function Gift0() {
  confetti({
    particleCount: 300,
    startVelocity: 70,
    spread: 100,
    origin: { y: 1 }
  })
}

export function Gift1() {
  confetti({
    particleCount: 200,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 1 }
  })
  confetti({
    particleCount: 200,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 1 }
  })
  setTimeout(() => {
    confetti({
      particleCount: 200,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
    })
    confetti({
      particleCount: 200,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
    })
  }, 200)
  setTimeout(() => {
    confetti({
      particleCount: 200,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
    })
    confetti({
      particleCount: 200,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
    })
  }, 400)
  setTimeout(() => {
    confetti({
      particleCount: 200,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.4 },
    })
    confetti({
      particleCount: 200,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.4 },
    })
  }, 600)
  setTimeout(() => {
    confetti({
      particleCount: 200,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.2 },
    })
    confetti({
      particleCount: 200,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.2 },
    })
  }, 800)
}

export function Gift2() {
  confetti({
    particleCount: 200,
    startVelocity: 30,
    spread: 360,
    origin: {
      x: Math.random(),
      y: Math.random() - 0.2
    }
  })
  setTimeout(() => {
    confetti({
      particleCount: 200,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2
      }
    })
  }, 200)
  setTimeout(() => {
    confetti({
      particleCount: 200,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2
      }
    })
  }, 400)
  setTimeout(() => {
    confetti({
      particleCount: 200,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2
      }
    })
  }, 600)
  setTimeout(() => {
    confetti({
      particleCount: 200,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2
      }
    })
  }, 800)
  setTimeout(() => {
    confetti({
      particleCount: 200,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2
      }
    })
  }, 1000)
  setTimeout(() => {
    confetti({
      particleCount: 200,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2
      }
    })
  }, 1200)
}