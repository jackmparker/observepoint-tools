import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IAuditObjectModel } from './interfaces/interfaces';

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

  getAudits(key: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'api_key ' + key
      })
    };

    return this.http.get(this.url + 'web-audits', httpOptions);
  }

  getWebJourneys(key: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'api_key ' + key
      })
    };

    return this.http.get(this.url + 'web-journeys', httpOptions);
  }

  getMobileApps(key: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'api_key ' + key
      })
    };

    return this.http.get(this.url + 'apps', httpOptions);
  }

  getRules(key: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'api_key ' + key
      })
    };

    return this.http.get(this.url + 'rules', httpOptions);
  }

  getWebJourneyActions(key: string, journey) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'api_key ' + key
      })
    };

    return this.http.get(this.url + 'web-journeys/' + journey.id, httpOptions);
  }

  updateAudit(key: string, audit) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'api_key ' + key
      })
    };

    return this.http.put(this.url + 'web-audits/' + audit.id, audit, httpOptions);
  }

  updateWebJourney(key: string, journey) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'api_key ' + key
      })
    };

    return this.http.put(this.url + 'web-journeys/' + journey.id, journey, httpOptions);
  }

  updateApp(key: string, app) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'api_key ' + key
      })
    };

    return this.http.put(this.url + 'apps/' + app.id, app, httpOptions);
  }

  updateRule(key: string, rule) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'api_key ' + key
      })
    };

    return this.http.put(this.url + 'rules/' + rule.id, rule, httpOptions);
  }

  getTags() {
    return this.http.get('https://guarded-journey-73055.herokuapp.com/tag-list/');
  }

  getAccountTags(key: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'api_key ' + key
      })
    };

    return this.http.get(this.url + 'tags', httpOptions);
  }

  login(creds) {
    return this.http.post('https://auth.observepoint.com/login', creds);
  }

  getFolderIds(key: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'api_key ' + key
      })
    };

    return this.http.get(this.url + 'folders', httpOptions);
  }

  getDomainIds(key: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'api_key ' + key
      })
    };

    return this.http.get(this.url + 'domains', httpOptions);
  }

  getAuditRuns(key: string, auditId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'api_key ' + key
      })
    };

    return this.http.get(this.url + 'web-audits/' + auditId + '/runs', httpOptions);
  }

  getAuditRunSummaries(key: string, audit: IAuditObjectModel) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'api_key ' + key
      })
    };

    return this.http.get(this.url + 'web-audits/' + audit.id + '/runs/' + audit.runId + '/results/variable/summary', httpOptions);
  }

  sendFatKatRequest(payload) {
    return this.http.post('https://guarded-journey-73055.herokuapp.com/fatkat/', JSON.stringify(payload));
  }

}
