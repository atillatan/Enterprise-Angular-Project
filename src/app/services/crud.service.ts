import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ServiceResponse, PagingDto, BaseDto, ResultType } from '../code/dto';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http: HttpClient) { }

  //#region BaseMethods

  // Create
  post(dto: BaseDto, apiPath: string): Observable<ServiceResponse<number>> {
    return this.http.post<ServiceResponse<number>>(apiPath, dto, httpOptions).pipe(
      tap((id: ServiceResponse<number>) => this.log(`post dto w/ id=${id}`)),
      catchError(this.handleError<ServiceResponse<number>>('postModel'))
    );
  }

  // Read
  get(id: number, apiPath: string): Observable<ServiceResponse<BaseDto>> {
    return this.http.get<ServiceResponse<BaseDto>>(`${apiPath}/${id}`).pipe(
      tap(_ => this.log(`fetched dto id=${id}`)),
      catchError(this.handleError<ServiceResponse<BaseDto>>(`getModel id=${id}`))
    );
  }

  // Update
  put(dto: BaseDto, apiPath: string): Observable<BaseDto> {
    return this.http.put(`${apiPath}/${dto.Id}`, dto, httpOptions).pipe(
      tap(_ => this.log(`updated dto id=${dto.Id}`)),
      catchError(this.handleError<any>('putModel'))
    );
  }

  // Delete
  delete(dto: BaseDto | number, apiPath: string): Observable<BaseDto> {
    const id = typeof dto === 'number' ? dto : dto.Id;
    const url = `${apiPath}/${id}`;
    return this.http.delete<BaseDto>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted dto id=${id}`)),
      catchError(this.handleError<any>('deleteModel'))
    );
  }

  // List
  list(searchDto: BaseDto, pagingDto: PagingDto, apiPath: string): Observable<ServiceResponse<BaseDto[]>> {

    const dictionary = {};
    dictionary['searchDto'] = searchDto;
    dictionary['pagingDto'] = pagingDto;

    return this.http.post<ServiceResponse<BaseDto[]>>(apiPath, dictionary, httpOptions).pipe(
      tap((serviceResponse: ServiceResponse<BaseDto[]>) => this.log(`fetched dtos:` + serviceResponse.Data.length)),
      catchError(this.handleError<ServiceResponse<BaseDto[]>>(`getModels`)));
  }

  //#endregion BaseMethods

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    // this.messageService.add('HeroService: ' + message);
    console.log(message);
  }
}
