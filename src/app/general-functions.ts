import { HttpErrorResponse } from '@angular/common/http';

export function myLittleBoy() {
  console.log('Hello World');
}

export function handleError(operation: string, apiURL: string) {
  return (err: any) => {
    const errMsg = `error in ${operation}() retreiving ${apiURL}`;
    console.log(errMsg, err);
    if (err instanceof HttpErrorResponse) {
      console.log(`status: ${err.status}, ${err.statusText}`);
    }
    throw errMsg;
  };
}
