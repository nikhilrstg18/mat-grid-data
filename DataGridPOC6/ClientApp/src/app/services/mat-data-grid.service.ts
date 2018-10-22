import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatDataGridService {
  queryParams: HttpParams;

  constructor(private _http: HttpClient) { }

  getRows(uri: string, gridParams: {}): Observable<any> {
    // create HttpParams
    var queryParams = new HttpParams();    
    for(var key in gridParams){
      queryParams = queryParams.set(key, gridParams[key]);
    }
    
    //@ getting data
    return this._http.get(uri,{params:queryParams});
    
  }
}
