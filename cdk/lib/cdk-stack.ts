import * as cdk from 'aws-cdk-lib';
import { CfnOutput, Fn } from 'aws-cdk-lib';
import { Architecture, Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.setupFibonacciSequence();
  }

  setupFibonacciSequence() {
    const memoryConfig = [128,256,512,1024]
    for (const memconfig of memoryConfig) {
      this.createFunction("fibonacci.handler",memconfig,"fib")      
    }
  }

  createFunction(handler:string, memconfig:number, name:string) {
    const architectures = [Architecture.X86_64, Architecture.ARM_64]
    for (const arc of architectures) {
      const f = new Function(this,`lambda_${arc.name}_${name}_${memconfig}`,{
        code: Code.fromAsset("../tests/"),
        runtime: Runtime.NODEJS_16_X,
        handler: handler,
        architecture: arc,
        memorySize: memconfig
      })

      new CfnOutput(this,`output_${arc.name}_${name}_${memconfig}`,{
        value: f.functionName,
        exportName: `perftest-${name}-${arc.name.replace('_',"")}-${memconfig}`,        
      })  
    }

  }
}
