exports.handler = () => {
    for (let i=0;i<1000000;i++) {
        var a = fibonacci(0,1,0,50)
    }
    console.log(a)    
}

function fibonacci(n1,n2,count,max) {
    const nextNumber = n1+n2;
    if (count==max-2) {
        return nextNumber
    }
    else return fibonacci(n2,nextNumber,++count,max);
}
