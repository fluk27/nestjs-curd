import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  export interface Response<T> {
    data: T;
  }
  
  @Injectable()
  export class NewsInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<Response<T>> {
      const res = context.switchToHttp().getResponse();
  
      return next.handle().pipe(
        map((data) => {
           const[{files}]=data
          if (res.statusCode===200) {
            if (files.length > 0) {
              files.map((e) => {
                e.path = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/news/${e.fileName}`;
              });
            }
  
            return data;
          }
        }),
      );
    }
  }
  