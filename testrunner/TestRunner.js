const { InvokeCommand } = require("@aws-sdk/client-lambda")

module.exports = class TestRunner {
    constructor(lambdaClient) {
        this.lambdaClient = lambdaClient
    }

    async runTest(numberOfTimes, funcName,expected) {
        const results = [];
        await this.runTestOnce(funcName,expected) // Run once to avoid cold starts
        for (var x=0;x<numberOfTimes;x++) {
            if (x%10==0) {
                console.log(` -> Running ${funcName} (${x}/${numberOfTimes})`)
            }
            results.push(await this.runTestOnce(funcName,expected))
        }
        return results
    }

    async runTestOnce(name,expected) {
        const invokeCommand = new InvokeCommand({
            FunctionName: name,
            LogType: "Tail"
        })
        const result = await this.lambdaClient.send(invokeCommand);
        return this.parseLogResult(result.LogResult,expected)
    }

    parseLogResult(logResult,expected) {
        const asText = Buffer.from(logResult,'base64').toString()
        const allLines = asText.split('\n')
        const lastLine = allLines[allLines.length-2]
        const infoLine = allLines[allLines.length-4]
        const regexp = new RegExp(/REPORT\sRequestId:.*?Duration:\s([0-9\.]*).*Billed\sDuration:\s([0-9\.]*).*Max\sMemory\sUsed:\s([0-9]*)/)
        const parsedData = lastLine.match(regexp)
        const validate = infoLine.match(expected)
        if (!validate[1]) {
            console.log(validate)
            throw new Error("Not correct value")
        }
        return {
            duration: parseFloat(parsedData[1]),
            billed: parseFloat(parsedData[2]),
            memoryUsed: parseInt(parsedData[3])
        }
    }
}