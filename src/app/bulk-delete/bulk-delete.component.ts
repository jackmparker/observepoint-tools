import { Component, OnInit } from '@angular/core';
import { TOOL_NAMES } from '../constants/constants';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProfileModel, IFolderDomainIdModel } from '../interfaces/interfaces';
import { ProfileService } from '../profile-service.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'bulk-delete',
  templateUrl: './bulk-delete.component.html',
  styleUrls: ['./bulk-delete.component.scss']
})
export class BulkDeleteComponent implements OnInit {

  title: string = TOOL_NAMES.BULK_ITEM_DELETER.DISPLAY_NAME;
  sidebar: string = TOOL_NAMES.BULK_ITEM_DELETER.PATH;
  description: string = TOOL_NAMES.BULK_ITEM_DELETER.DESCRIPTION;
  bulkDeleteForm: FormGroup;
  profiles: IProfileModel[];
  formSubmitted: boolean = false;
  showSpinner: boolean = false;
  apiKey: string;
  folderObj: any;

  constructor(private titleService: Title,
              private fb: FormBuilder,
              private profileService: ProfileService,
              private apiService: ApiService) { }

  ngOnInit() {
    this.setTitle(TOOL_NAMES.BULK_EMAIL.TITLE);
    this.profiles = this.profileService.getProfiles();
    this.initForm();
  }

  private initForm() {
    this.bulkDeleteForm = this.fb.group({
      name: [null, Validators.required],
      key: [null, Validators.required],
      profile: [null, Validators.required]
    });

    if(this.profiles.length) {
      this.name.disable();
      this.key.disable();
    } else {
      this.profile.disable();
    }
  }

  private setTitle(title: string): void {
    this.titleService.setTitle(title + ' | ObservePoint Tools');
  }

  private getApiKey(): void {
    let form = this.bulkDeleteForm.value;
    this.apiKey = form.profile ? form.profile : form.key;
  }

  getItems() {
    this.showSpinner = true;
    this.formSubmitted = true;
    this.getApiKey();
    this.getFolders();
  }
  

  /*
   *  FOLDERS
   *
  */
 
  folders: IFolderDomainIdModel[];

  private getFolders() {
    this.apiService.getFolders(this.apiKey).subscribe((folders: IFolderDomainIdModel[]): void => {
      this.folderObj = {
        
      }

      this.folders = folders;
    });
  }


  /*
   *  FORM GETTERS
   *
  */

  get name() {
    return this.bulkDeleteForm.get('name');
  }

  get key() {
    return this.bulkDeleteForm.get('key');
  }

  get profile() {
    return this.bulkDeleteForm.get('profile');
  }
}
