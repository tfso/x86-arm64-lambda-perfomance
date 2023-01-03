# Performance tester for lambda
A repository for a performance testing framework for lambdas.

## How to use
First the lambdas must be deployed:  
```
$ cd cdk
$ cdk bootstrap
$ cdk deploy
```

Then you can run the tests
```
$ cd .. # to get back to repository root
$ cd testrunner
$ node runtests.js 
```
The results will be stored in the results directory. The json should be pretty self explainatory.  

## Analyzing results
We have included a very short jupyter notebook in the jupyter folder. It should give you some basics to play around with.  

## Add own tests
You will need to add a file in the tests/ directory. This is the test that will be run. This will need to export a function called handler.  
When that is done, you add it to the cdk-stack (cdk/lib/cdk-stack) and deploy it with
```
$ cdk deploy
```
Then you just need to add it to the testrunner (testrunner/runtests.js)  
  
If you create an interesting test, please feel free to create a pr so we can include it in future tests.  
 

