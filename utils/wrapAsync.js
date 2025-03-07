function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((error)=>{
            next(error); //calling the next error handling middleware
        })
    }
}

module.exports = wrapAsync;