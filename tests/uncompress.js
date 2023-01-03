const zlib = require("node:zlib");
const fs = require("fs");
const { pipeline } = require("node:stream");

exports.handler=async () => {
    const result = await unzip()
    console.log(result)
}

async function unzip() {
    return new Promise((resolve,reject)=>{
        const unzip = zlib.createUnzip();
        const input = fs.createReadStream("./demo.txt.gz");
        const output = fs.createWriteStream("/tmp/test.txt");
        pipeline(input, unzip, output, (error) => {
            if (error) reject(error);
            resolve(1)
          });
    })
} 
