import { Component, OnInit, ViewChild } from '@angular/core';
import { TOOL_NAMES } from '../constants/constants';
import { Title } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api.service';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { IProfileModel } from '../interfaces/interfaces';
import { ProfileService } from '../profile-service.service';

@Component({
  selector: 'app-folder-domain-ids',
  templateUrl: './folder-domain-ids.component.html',
  styleUrls: ['./folder-domain-ids.component.scss']
})
export class FolderDomainIdsComponent implements OnInit {

  @ViewChild('folderSort', { static: true }) folderSort: MatSort;
  @ViewChild('domainSort', { static: true }) domainSort: MatSort;

  title: string = TOOL_NAMES.FOLDER_DOMAIN_IDS.DISPLAY_NAME;
  sidebar: string = TOOL_NAMES.FOLDER_DOMAIN_IDS.PATH;
  description: string = TOOL_NAMES.FOLDER_DOMAIN_IDS.DESCRIPTION;
  profiles: IProfileModel[];
  apiKey: string;
  apiKeyForm: FormGroup;
  showSpinner: boolean = false;
  displayedColumns: string[] = ['name', 'id'];
  folderDataSource: MatTableDataSource<any>;
  domainDataSource: MatTableDataSource<any>;
  folderIds: any;
  domainIds: any;

  constructor(private titleService: Title,
              private apiService: ApiService,
              private fb: FormBuilder,
              private profileService: ProfileService) { }

  ngOnInit() {
    this.setTitle(TOOL_NAMES.FOLDER_DOMAIN_IDS.TITLE);
    this.initForm();
  }

  private initForm() {
    this.apiKeyForm = this.fb.group({
      name: [null, Validators.required],
      key: [null, Validators.required],
      profile: [null, Validators.required]
    });
  }

  private setTitle(title: string): void {
    this.titleService.setTitle(title + ' | ObservePoint Tools');
  }

  private evalProfiles() {
    this.profiles = this.profileService.getProfiles();

    if(this.profiles.length) {
      this.name.disable();
      this.key.disable();
      this.profile.enable();
    } else {
      this.name.enable();
      this.key.enable();
      this.profile.disable();
    }
  }

  onProfileSelection(key: string): void {
    this.evalProfiles();
    this.apiKey = key;
  }

  getIds() {
    this.showSpinner = true;
    this.apiKey = this.key.value ? this.key.value : this.profile.value;

    let folders = this.apiService.getFolderIds(this.apiKey);
    let domains = this.apiService.getDomainIds(this.apiKey);

    forkJoin(folders, domains).subscribe(([folderIds, domainIds]) => {
      // folders
      this.folderIds = folderIds;
      this.folderIds = this.folderIds
      .map(folder => {
        return {
          name: folder.name,
          id: folder.id
        };
      })
      .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);;
      this.folderDataSource = new MatTableDataSource(this.folderIds);
      this.folderDataSource.sort = this.folderSort;
      
      // domains
      this.domainIds = domainIds;
      this.domainIds = this.domainIds
      .map(domain => {
        return {
          name: domain.name,
          id: domain.id
        };
      })
      .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);;
      this.domainDataSource = new MatTableDataSource(this.domainIds);
      this.domainDataSource.sort = this.domainSort;
      this.showSpinner = false;
    });
  }

  folderFilter(filterValue: string) {
    this.folderDataSource.filter = filterValue.trim().toLowerCase();
  }

  domainFilter(filterValue: string) {
    this.domainDataSource.filter = filterValue.trim().toLowerCase();
  }

  convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
  }

  exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);
    var csv = this.convertToCSV(jsonObject);
    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
  }

  downloadFolderCSV() {
    var headers = {
      name: 'Folder Name',
      id: 'Folder ID'
    };

    var itemsFormatted = [];

    // format the data
    this.folderIds.forEach((item) => {
        itemsFormatted.push({
          name: item.name.replace(/,/g, ''),
          id: item.id
        });
    });

    var fileTitle = 'Folder IDs';

    this.exportCSVFile(headers, itemsFormatted, fileTitle);
  }

  downloadDomainCSV() {
    var headers = {
      name: 'Domain Name',
      id: 'Domain ID'
    };

    var itemsFormatted = [];

    // format the data
    this.domainIds.forEach((item) => {
      itemsFormatted.push({
        name: item.name.replace(/,/g, ''),
        id: item.id
      });
    });

    var fileTitle = 'Domain IDs';

    this.exportCSVFile(headers, itemsFormatted, fileTitle);
  }

  get name() {
    return this.apiKeyForm.get('name');
  }

  get key() {
    return this.apiKeyForm.get('key');
  }

  get profile() {
    return this.apiKeyForm.get('profile');
  }

}
