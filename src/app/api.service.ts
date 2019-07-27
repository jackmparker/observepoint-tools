import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url: string = 'https://api.observepoint.com/v2/';

  constructor(private http: HttpClient) { }

  getLabels(key: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'api_key ' + key
      })
    };

    return this.http.get(this.url + 'labels', httpOptions);
  }

  getFolders(key: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'api_key ' + key
      })
    };

    return this.http.get(this.url + 'folders', httpOptions);
  }

  getDomains(key: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'api_key ' + key
      })
    };

    return this.http.get(this.url + 'domains', httpOptions);
  }

}
