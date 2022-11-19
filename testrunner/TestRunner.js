const { InvokeCommand } = require("@aws-sdk/client-lambda")

module.exports = class TestRunner {
    constructor(lambdaClient) {
        this.lambdaClient = lambdaClient
    }

    async runTest(numberOfTimes, funcName) {
        const results = [];
        await this.runTestOnce(funcName) // Run once to avoid cold starts
        for (var x=0;x<numberOfTimes;x++) {
            if (x%10==0) {
                console.log(` -> Running ${funcName} (${x}/${numberOfTimes})`)
            }
            results.push(await this.runTestOnce(funcName))
        }
        return results
    }

    async runTestOnce(name) {
        const invokeCommand = new InvokeCommand({
            FunctionName: name,
            LogType: "Tail"
        })
        const result = await this.lambdaClient.send(invokeCommand);
        return this.parseLogResult(result.LogResult)
    }

    parseLogResult(logResult) {
        const asText = Buffer.from(logResult,'base64').toString()
        const allLines = asText.split('\n')
        const lastLine = allLines[allLines.length-2]
        const regexp = new RegExp(/REPORT\sRequestId:.*?Duration:\s([0-9\.]*).*Billed\sDuration:\s([0-9\.]*).*Max\sMemory\sUsed:\s([0-9]*)/)
        const parsedData = lastLine.match(regexp)
        return {
            duration: parseFloat(parsedData[1]),
            billed: parseFloat(parsedData[2]),
            memoryUsed: parseInt(parsedData[3])
        }
    }
}