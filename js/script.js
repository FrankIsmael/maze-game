const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let gameStarted = false
const keys = []
const friction = 0.8
//const gravity = 0.98//0.98
const platforms = []
platform_width = 120
platform_height = 20
let interval


// players and boards
const images = {
    boardBat1: './images/buildingsBat.jpg',
    buildings: './images/buildings1.png',
    boardBat3: './images/wallpaperBat.png',
    gotham: './images/gotham.png',
    batmanR: './images/batmanR.png',
    batmanL: './images/batmanL.png',
    batmanF: './images/batmanF.png',
    supermanL: './images/supermanFL.png',
    supermanR: './images/supermanFR.png',
    joker: './images/joker.png',
    bane: './images/bane.png',
    spaceShip: './images/spaceship.png'        // 20386 × 330 54 frames
}

//  board game
class BatBoard {
    constructor(img) {
        this.x = 0
        this.y = 0
        this.width = canvas.width
        this.height = canvas.height
        this.img = new Image(1300, 500)
        this.img.src = img
        this.img.onload = () => {
            this.draw() // draw image when image has alrady charged
        }
    }
    // METHOD
    draw() {

        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.img, this.x + this.width, this.y, this.width, this.height)
        // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
}

class Character {
    constructor(dx,dy,img,sw,sh,g=.98) {
        this.img = new Image()
        this.img.src = img
        this.sx = 0 
        this.sy = 0
        this.sw = sw
        this.sh = sh
        this.dx = dx
        this.dy = dy
        this.speed = 5
        this.velX = 0
        this.velY = 0
        this.jumping = false
        this.jumpStrength = 5
        this.grounded = false
        this.gravity = g
        this.health = 5
    }
    draw() {
        ctx.drawImage(
            this.img, 
            this.sx, 
            this.sy, 
            this.sw, 
            this.sh, 
            this.dx, 
            this.dy, 
            this.sw, 
            this.sh)
    }

}

class SpaceShip{
    constructor(dx,dy,img,sw,sh){
        this.img = new Image()
        this.img.src = img
        this.sx = 0 
        this.sy = 0
        this.sw = sw
        this.sh = sh
        this.dx = dx
        this.dy = dy
        this.speed = 5
        this.velX = 0
        this.velY = 0
        this.health = 10
    }
    draw() {
        ctx.drawImage(
            this.img, 
            this.sx, 
            this.sy, 
            this.sw, 
            this.sh, 
            this.dx, 
            this.dy, 
            this.sw, 
            this.sh)

            this.sx += 377.5
             if (this.sx > (20386-377.5)) this.sx = 0
    }
}



const boardBatman = new BatBoard(images.boardBat3)
const spaceShip = new SpaceShip(canvas.width/2,0,images.spaceShip,377.5,330)
const batman = new Character(5,canvas.height - 170, images.batmanR,168,160)
const superman = new Character(canvas.width - 200,canvas.height/2, images.supermanR,130,160,.5)
/*const bane = new Character(200,0,images.bane,70,93)
const mario = new Character(100,50,images.mario,40,40) */

// Platforms
// ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
platforms.push({
    x: canvas.width - 170,
    y: 400,
    width: platform_width,
    height: platform_height
})

platforms.push({
    x: 200,
    y: canvas.height - 50,
    width: platform_width,
    height: platform_height
})

platforms.push({
    x: 400,
    y: 400,
    width: platform_width,
    height: platform_height
})

platforms.push({
    x: canvas.width - 170,
    y: canvas.height - 50,
    width: platform_width,
    height: platform_height
})

platforms.push({
    x: -canvas.width,
    y: canvas.height - 15,
    width: canvas.width + canvas.width * 2,
    height: platform_height
})

document.body.addEventListener('keydown', e => {
    if (e.keyCode == 13 && !gameStarted) {
        startGame()
    }
    //para movimiento
    keys[e.keyCode] = true
})

//para movimiento
document.body.addEventListener('keyup', e => {
    keys[e.keyCode] = false
})

function intro_screen() {
    ctx.font = '20px Arial'
    ctx.fillText('Press Enter To Start', canvas.width / 2, canvas.height / 2 + 50)
}

function startGame() {
    gameStarted = true
    if (interval) return // tal vez aqui
    interval = setInterval(update, 1000 / 60)
}

// platforms
function drawPlatforms() {
    ctx.fillStyle = 'gray'
    platforms.map(platform =>
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
    )
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    boardBatman.draw() 
    drawPlatforms()
    batman.draw()
    superman.draw()
    spaceShip.draw()

    //jump Batman
    if (keys[38]) {
        if (!batman.jumping) {  
            batman.velY = -batman.jumpStrength * 4
            batman.jumping = true
        }
    }
    //move +x
    if (keys[39]) {
        batman.img.src = images.batmanR
        if (batman.velX < batman.speed) {
            batman.velX++
        }
        batman.sx += 168
        if (batman.sx > 3192) batman.sx = 0
    }
    //move -x
    if (keys[37]) {
        batman.img.src = images.batmanL
        if (batman.velX > -batman.speed) {
            batman.velX--
        }
        batman.sx += 168
        if (batman.sx > 3192) batman.sx = 0
    }
    //jump batman
    batman.dy += batman.velY
    batman.velY += batman.gravity
    //move batman
    batman.dx += batman.velX
    batman.velX *= friction

    //collition batman-platforms
    batman.grounded = false
    platforms.map(platform => {
        const direction = collisionCheck(batman, platform)
        if (direction == 'left' || direction == 'right') {
            batman.velX = 0
        } else if (direction == 'bottom') {
            batman.jumping = false
            batman.grounded = true
        } else if (direction == 'top') {
            batman.velY *= -1
        }
    })
    if (batman.grounded) {
        batman.velY = 0
    }
   //----------------SUPERMAN-------------------------
    //jump superman
    if (keys[87]) {
        if (!superman.jumping) {  
            superman.velY = -superman.jumpStrength * 4
            superman.jumping = true
        }
    }
    //move +x
    if (keys[68]) {
        superman.img.src = images.supermanR
        if (superman.velX < superman.speed) {
            superman.velX++
        }
        superman.sx += 130
        if (superman.sx > 3640) superman.sx = 0
    }
    //move -x
    if (keys[65]) {
        superman.img.src = images.supermanL
        if (superman.velX > -superman.speed) {
            superman.velX--
        }
        superman.sx += 130
        if (superman.sx > 3640) superman.sx = 0
    }
    //jump superman
    superman.dy += superman.velY
    superman.velY += superman.gravity
    //move superman
    superman.dx += superman.velX
    superman.velX *= friction

    //collition superman-platforms
    superman.grounded = false
    platforms.map(platform => {
        const direction = collisionCheck(superman, platform)
        if (direction == 'left' || direction == 'right') {
            superman.velX = 0
        } else if (direction == 'bottom') {
            superman.jumping = false
            superman.grounded = true
        } else if (direction == 'top') {
            superman.velY *= -1
        }
    })
    if (superman.grounded) {
        superman.velY = 0
    }
}


function collisionCheck(char, plat) {
    const vectorX = char.dx + char.sw / 2 - (plat.x + plat.width / 2)
    const vectorY = char.dy + char.sh / 2 - (plat.y + plat.height / 2)

    const halfWidths = char.sw / 2 + plat.width / 2
    const halfHeights = char.sh / 2 + plat.height / 2


    let collisionDirection = null

    if (Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights) {
        var offsetX = halfWidths - Math.abs(vectorX)
        var offsetY = halfHeights - Math.abs(vectorY)
        if (offsetX < offsetY) {
            if (vectorX > 0) {
                collisionDirection = 'left'
                char.dx += offsetX
            } else {
                collisionDirection = 'right'
                char.dx -= offsetX
            }
        } else {
            if (vectorY > 0) {
                collisionDirection = 'top'
                char.dy += offsetY
            } else {
                collisionDirection = 'bottom'
                char.dy -= offsetY
            }
        }
    }
    return collisionDirection
}


intro_screen()



























/*
// drawing platforms
function drawPlatforms() {
    ctx.fillStyle = 'gray'
    platforms.map(platform =>
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
    )
}

function startGame() {
    gameStarted = true
    if (interval) return // tal vez aqui
    interval = setInterval(update, 1000 / 60)
  }

  // platforms
  function drawPlatforms() {
    ctx.fillStyle = 'gray'
    platforms.map(platform =>
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
    )
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    boardBatman.draw()
    drawPlatforms()
    player.draw()

    //jump
    if (keys[38] || keys[32]) {
      if (!player.jumping) {
        player.velY = -player.jumpStrength * 4
        player.jumping = true
      }
    }

    //movimiento
    if (keys[39]) {
      if (player.velX < player.speed) {
        player.velX++
      }
    }

    if (keys[37]) {
      if (player.velX > -player.speed) {
        player.velX--
      }
    }

    //jump
    player.y += player.velY
    player.velY += gravity

    //movimiento
    player.x += player.velX
    player.velX *= friction

    //collition
    batman.grounded = false
    platforms.map(platform => {
      const direction = collisionCheck(batman, platform)
      if (direction == 'left' || direction == 'right') {
        batman.velX = 0
      } else if (direction == 'bottom') {
        batman.jumping = false
        batman.grounded = true
      } else if (direction == 'top') {
        batman.velY *= -1
      }
    })

    if (player.grounded) {
      player.velY = 0
    }
  }

/*
function collisionCheck(char, plat) {
    const vectorX = char.x + char.width / 2 - (plat.x + plat.width / 2)
    const vectorY = char.y + char.height / 2 - (plat.y + plat.height / 2)
    console.log(vectorY)
    const halfWidths = char.width / 2 + plat.width / 2
    const halfHeights = char.height / 2 + plat.height / 2

    let collisionDirection = null

    if (Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights) {
        var offsetX = halfWidths - Math.abs(vectorX)
        var offsetY = halfHeights - Math.abs(vectorY)
        if (offsetX < offsetY) {
            if (vectorX > 0) {
                collisionDirection = 'left'
                char.x += offsetX
            } else {
                collisionDirection = 'right'
                char.x -= offsetX
            }
        } else {
            if (vectorY > 0) {
                collisionDirection = 'top'
                char.y += offsetY
            } else {
                collisionDirection = 'bottom'
                char.y -= offsetY
            }
        }
    }
    return collisionDirection
}*/
/*
function startGame() {
    gameStarted = true
    if (interval) return
    interval = setInterval(update, 1000 / 500)
}

document.body.addEventListener('keydown', e => {
    if (e.keyCode == 13 && !gameStarted) {
        startGame()
    }
    //para movimiento
    keys[e.keyCode] = true
})

//para movimiento
document.body.addEventListener('keyup', e => {
    keys[e.keyCode] = false
})

function intro_screen() {
    ctx.font = '20px Arial'
    ctx.fillText('Press Enter To Start', canvas.width / 2, canvas.height / 2 + 50)
}*/


//intro_screen()
/*
// EVENT
addEventListener('keydown', e => {
    if (e.keyCode == 32) startGame()
    else if (e.keyCode == 39) batman.moveRight()
    else if (e.keyCode == 37) batman.moveLeft()
    else if (e.keyCode == 38) batman.moveUp()
    else if (e.keyCode == 40) batman.moveDown()
})
*/
/* addEventListener('keydown',e =>{
    switch(e.keyCode){
        case 68:
          return superman.moveRight()
        case 65:
          return superman.moveLeft()
        case 87:
          return superman.moveUp()
        case 83:
          return superman.moveDown()
      }
})
*/