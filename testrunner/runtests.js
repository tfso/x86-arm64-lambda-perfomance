const {  CloudFormationClient  } = require("@aws-sdk/client-cloudformation")
const { LambdaClient } = require("@aws-sdk/client-lambda")
const TestCollection  = require("./TestCollection")
const TestRunner = require('./TestRunner')
const fs = require('fs')

runtests()


async function runtests() {
    console.log("Running tests : ")
    await testRunner("fib",new RegExp(/.*(12586269025).*/));
    await testRunner("uncompress",new RegExp(/.*(1).*/));
    await testRunner("mandelbrot",new RegExp(/.*(255).*/));
}

async function testRunner(name,validatorRegexp) {
    const testCollection = new TestCollection(new CloudFormationClient());
    const testFunctions = await testCollection.getArns(name);
    const testRunner = new TestRunner(new LambdaClient())
    for (const testFunc of testFunctions) {
        console.log(`Running tests for ${testFunc.name}`);
        testFunc.testResult = await testRunner.runTest(100,testFunc.name,validatorRegexp)
    }
    fs.writeFileSync(`../results/${name}.json`,JSON.stringify(testFunctions))
}

