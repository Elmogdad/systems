import {z} from 'zod';
import { ErrorRequestHandler, Response } from 'express';
import { BAD_REQUEST,INTERNAL_SERVER_ERROR } from '../constants/http.js';
import AppError from '../utils/AppError.js';


const handleZodError = (res:Response, err: z.ZodError) => {

const errors = err.issues.map((err) => ({
  path: err.path.join('.'),
  message: err.message
}))

    return res.status(BAD_REQUEST).json({
        message:err.message,
        errors
    })
  };

const handleAppError = (res: Response, error : AppError ) => {
  return res.status(error.statusCode).json({
    message : error.message,
    errorCode : error.errorCode,
  });
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(`Path: ${req.path}`, err);

    if (err instanceof z.ZodError) {
       return handleZodError(res, err);
    }

    if (err instanceof AppError) {
     return handleAppError(res, err)
    }

    return res.status(INTERNAL_SERVER_ERROR).send('Internal server error');
  };
  
export default errorHandler;