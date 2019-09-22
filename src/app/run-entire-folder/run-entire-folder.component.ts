import { Component, OnInit } from '@angular/core';
import { TOOL_NAMES } from '../constants/constants';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { forkJoin, of } from 'rxjs';
import { IFolderDomainIdModel, IAuditModel, IJourneyModel } from '../interfaces/interfaces';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'run-entire-folder',
  templateUrl: './run-entire-folder.component.html',
  styleUrls: ['./run-entire-folder.component.scss']
})
export class RunEntireFolderComponent implements OnInit {

  title: string = TOOL_NAMES.RUN_ENTIRE_FOLDER.DISPLAY_NAME;
  sidebar: string = TOOL_NAMES.RUN_ENTIRE_FOLDER.PATH;
  description: string = TOOL_NAMES.RUN_ENTIRE_FOLDER.DESCRIPTION;
  showSpinner: boolean = false;
  runEntireFolderForm: FormGroup;
  apiKey: string;
  gotData: boolean = false;
  folders;
  searchText: string;

  constructor(
    private titleService: Title,
    private fb: FormBuilder,
    private apiService: ApiService) { }

  ngOnInit() {
    this.setTitle(TOOL_NAMES.RUN_ENTIRE_FOLDER.TITLE);
    this.initForm();
  }

  private setTitle(title: string): void {
    this.titleService.setTitle(title + ' | ObservePoint Tools');
  }

  private initForm() {
    this.runEntireFolderForm = this.fb.group({
      name: [null, Validators.required],
      key: [null, Validators.required],
      profile: [null, Validators.required]
    });
  }

  getItems(): void {
    this.showSpinner = true;
    this.apiKey = this.key ? this.key : this.profile;

    let foldersReq = this.apiService.getFolders(this.apiKey);
    let auditsReq = this.apiService.getAudits(this.apiKey);
    let webJourneysReq = this.apiService.getWebJourneys(this.apiKey);
    let appJourneysReq = this.apiService.getAppJourneys(this.apiKey);

    forkJoin(foldersReq, auditsReq, webJourneysReq, appJourneysReq)
      .subscribe(([folders, audits, webJourneys, appJourneys]) => {
        this.showSpinner = false;
        this.gotData = true;
        
        this.parseData(folders, audits, webJourneys, appJourneys);
      });
  }

  private parseData(folders, audits, webJourneys, appJourneys) {
    let data = [];
    
    folders.forEach((folder: IFolderDomainIdModel) => {
      let obj = {
        name: folder.name,
        audits: [],
        webJourneys: [],
        appJourneys: [],
        running: false
      };

      audits.forEach((audit: IAuditModel) => {
        if(audit.folderId === folder.id) {
          obj.audits.push({
            name: audit.name,
            id: audit.id
          });
        }
      });

      webJourneys.forEach((webJourney: IJourneyModel) => {
        if(webJourney.folderId === folder.id) {
          obj.webJourneys.push({
            name: webJourney.name,
            id: webJourney.id
          });
        }
      });

      appJourneys.forEach((appJourney: IJourneyModel) => {
        if(appJourney.folderId === folder.id) {
          obj.appJourneys.push({
            name: appJourney.name,
            id: appJourney.id
          });
        }
      });

      obj.audits.sort((a: any, b: any) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
      obj.webJourneys.sort((a: any, b: any) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
      obj.appJourneys.sort((a: any, b: any) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);

      data.push(obj);
    });

    this.folders = data
      .filter(item => item.audits.length || item.webJourneys.length || item.appJourneys.length)
      .sort((a: any, b: any) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
  }

  runEntireFolder(folder) {
    folder.running = true;

    folder.audits.forEach((audit: IAuditModel) => {
      this.apiService.runAudit(this.apiKey, audit.id).subscribe(response => {
        console.log(response);
      });
    });

    folder.webJourneys.forEach((webJourney: IJourneyModel) => {
      this.apiService.runWebJourney(this.apiKey, webJourney.id).subscribe(response => {
        console.log(response);
      });
    });

    folder.appJourneys.forEach((appJourney: IJourneyModel) => {
      this.apiService.runAppJourney(this.apiKey, appJourney.id).subscribe(response => {
        console.log(response);
      });
    });
  }

  get key() {
    return this.runEntireFolderForm.get('key').value;
  }

  get profile() {
    return this.runEntireFolderForm.get('profile').value;
  }
}
