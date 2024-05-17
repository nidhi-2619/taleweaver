class ApiError extends Error{
    statusCode = 500
    message="Something Went Wrong"
    constructor(statusCode, message){
        super(message)
        this.statusCode = statusCode
    }
}
export {ApiError}