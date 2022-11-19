const {  ListExportsCommand   } = require("@aws-sdk/client-cloudformation");


module.exports = class TestCollection {
    constructor(cloudFormationClient) {
        this.cloudFormationClient = cloudFormationClient
        this.arcs = {
            x8664: "x86",
            arm64: "ARM"
        }
    }

    async getArns(name){
        const allExports = await this.listPaginated();        
        return allExports.filter(x=>x.Name.indexOf(`perftest-${name}`)==0).map(x=>this.createPerfTest(x))
    }

    createPerfTest(exportObj) {
        const regexp = new RegExp(/(.*)-(.*)-(.*)-(\d*)/)
        const match = exportObj.Name.match(regexp)
        return {
            name: match[2],
            architecture: this.arcs[match[3]],
            memory: parseInt(match[4]),
            name: exportObj.Value
        }
        
    }

    async listPaginated() {
        const exports = []
        let nextPage = undefined
        do {
            const listExportsCommand = new ListExportsCommand({
                NextToken: nextPage
            });
            const result = await this.cloudFormationClient.send(listExportsCommand)
            exports.push(...result.Exports)
            nextPage=result.NextToken
        } while (nextPage)
        return exports;
    }
}