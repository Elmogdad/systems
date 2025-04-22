
import AppErrorCode from "../constants/AppErrorCode.js";
import { HttpStatusCode } from "../constants/http.js";


 class AppError extends Error {
    constructor (
        public statusCode: HttpStatusCode,
        public message : string,
        public errorCode?: AppErrorCode,
    ) {
        super(message)
    }
}


export default AppError