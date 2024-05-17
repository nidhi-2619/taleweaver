import multer from "multer";

// we can use memory storage as well as disk storage
// app.post (/endpoint, middleware, req,res,next)
const storage = multer.diskStorage({
    destination:function(req, file ,cb){
        cb(null, "./public/temp")
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + "-" +  Math.round(Math.random() * 1E9)
        cb(null, file.filename + "-" + uniqueSuffix)
    }
})

export const upload  = multer({
    storage
})