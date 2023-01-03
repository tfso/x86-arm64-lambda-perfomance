const fs = require('fs')
const width = 1000;
const height = 1000;
// Based on pseudo code here : https://en.wikipedia.org/wiki/Mandelbrot_set
exports.handler = () => {
    const screen = new Array(width*height)
    for (let xp =0;xp<width;xp++) {
        for (let yp =0;yp<height;yp++) {
            const x0 = ((2.47/width)*xp)-2.0
            const y0 = ((2.24/width)*yp)-1.12
            let x = 0.0
            let y = 0.0
            let iteration = 0
            const max_iteration = 255
            while (x*x + y*y <= 2*2 && iteration < max_iteration) {
                const xtemp = x*x - y*y + x0
                y = 2*x*y + y0
                x = xtemp
                iteration = iteration + 1
            }        
            screen[xp+(yp*width)]=iteration
        
        }
    }
    const image = Buffer.from(screen)       
    console.log(screen[width*height/2])  
}
