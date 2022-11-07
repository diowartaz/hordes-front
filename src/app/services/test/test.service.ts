import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { handleError } from 'src/app/general-functions';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor(private httpClient: HttpClient) {}

  getCatFacts(): Observable<any> {
    let url: string = 'https://catfact.ninja/fact';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(handleError('getCatFacts', url))
    );
  }
}
