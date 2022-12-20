const {  CloudFormationClient  } = require("@aws-sdk/client-cloudformation")
const { LambdaClient } = require("@aws-sdk/client-lambda")
const TestCollection  = require("./TestCollection")
const TestRunner = require('./TestRunner')
const fs = require('fs')
testRunner("mandelbrot");
// runTest("arn:aws:lambda:eu-west-1:786903647681:function:PerformanceTestStack-lambdax8664fib512687E7171-jAEjCHTBH7Gr");

async function testRunner(name) {
    const testCollection = new TestCollection(new CloudFormationClient());
    const testFunctions = await testCollection.getArns(name);
    const testRunner = new TestRunner(new LambdaClient())
    for (const testFunc of testFunctions) {
        console.log(`Running tests for ${testFunc.name}`);
        testFunc.testResult = await testRunner.runTest(100,testFunc.name,new RegExp(/(.*)/))
    }
    fs.writeFileSync(`../results/${name}.json`,JSON.stringify(testFunctions))
}

