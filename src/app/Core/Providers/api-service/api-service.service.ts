import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
//   })
// };
@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  Url = `${environment.apiUrl}`;
  constructor(private http: HttpClient) { }

  postmethod(url: string, obj: object): Observable<any> {
    return this.http.post(`${this.Url}${url}`, obj)
      .pipe(map(
        (res: Response) => {
          return res;
        }));
  }
  getmethod(url: string): Observable<any> {
    return this.http.get(`${this.Url}${url}`);
  }
}
