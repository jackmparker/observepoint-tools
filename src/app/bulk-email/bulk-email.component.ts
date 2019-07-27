import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TOOL_NAMES } from '../constants/constants';
import { FormBuilder, Validators, FormGroup, AbstractControl, FormArray } from '@angular/forms';
import { IProfileModel } from '../interfaces/interfaces';
import { ProfileService } from '../profile-service.service';
import { ApiService } from '../api.service';
import { ToolValidators } from '../validators';

@Component({
  selector: 'bulk-email',
  templateUrl: './bulk-email.component.html',
  styleUrls: ['./bulk-email.component.scss']
})
export class BulkEmailComponent implements OnInit {

  title: string = TOOL_NAMES.BULK_EMAIL.DISPLAY_NAME;
  sidebar: string = TOOL_NAMES.BULK_EMAIL.PATH;
  description: string = TOOL_NAMES.BULK_EMAIL.DESCRIPTION;
  profiles: IProfileModel[];
  bulkEmailForm: FormGroup;
  addRemoveSelection: string = 'Add emails to:';
  labelData: any;
  labelsSelected: boolean = false;
  folderData: any;
  foldersSelected: boolean = false;
  domainData: any;
  domainsSelected: boolean = false;


  constructor(
    private titleService: Title,
    private fb: FormBuilder,
    private profileService: ProfileService,
    private apiService: ApiService) { }

  ngOnInit() {
    this.setTitle(TOOL_NAMES.BULK_EMAIL.TITLE);
    this.profiles = this.profileService.getProfiles();

    this.bulkEmailForm = this.fb.group({
      addRemove: ['add', Validators.required],
      name: [null, Validators.required],
      key: [null, Validators.required],
      profile: [null, Validators.required],
      emails: [null, [Validators.required, ToolValidators.emails]],
      labels: [[], Validators.required],
      folders: this.fb.array([]),
      domains: this.fb.array([]),
      applyTo: this.fb.group({
        audits: [null],
        journeys: [null],
        apps: [null],
        rules: [null]
      }),
      checkboxValidator: [null, Validators.required],
      labelSearchText: [null]
    });

    if(this.profiles.length) {
      this.name.disable();
      this.key.disable();
    } else {
      this.profile.disable();
    }

    this.addRemove.valueChanges.subscribe(change => {
      this.addRemoveSelection = change == 'add' ? 'Add emails to:' : 'Remove emails from:';
    });

    this.applyTo.valueChanges.subscribe(change => {
      if(Object.values(change).indexOf(true) > -1) {
        this.checkboxValidator.patchValue(true);
      } else {
        this.checkboxValidator.patchValue(null);
      }
    });

    this.bulkEmailForm.valueChanges.subscribe(() => {
      console.log(this.bulkEmailForm);
    });
  }

  private setTitle(title: string): void {
    this.titleService.setTitle(title + ' | ObservePoint Tools');
  }

  getFilters(key: string): void {
    
    // labels
    this.apiService.getLabels(key).subscribe(
      data => {
        console.log(data);
        console.log(typeof data);
        this.labelData = data;
        this.labelData.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
        this.addFilters(this.labelData, this.labels);
      },
      error => {
        this.handleError(error);
      }
    );

    // folders
    this.apiService.getFolders(key).subscribe(
      data => {
        this.folderData = data;
        this.folderData.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
        this.addFilters(this.folderData, this.folders);
      },
      error => {
        this.handleError(error);
      }
    );

    // domains
    this.apiService.getDomains(key).subscribe(
      data => {
        this.domainData = data;
        this.domainData.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
        this.addFilters(this.domainData, this.domains);
      },
      error => {
        this.handleError(error);
      }
    );

  }

  addFilters(filters: Array<any>, field: any): void {
    filters.map(() => {
      field.push(this.fb.control(false));
    });
  }

  handleError(error) {
    if(error.error.errorCode === 1) {
      if(this.profiles.length) {
        this.profile.setErrors({ invalidApiKey: true });
      } else {
        this.key.setErrors({ invalidApiKey: true });
      }
    }
  }

  onSubmit(form) {
    console.log(form.value);
  }

  get addRemove() { 
    return this.bulkEmailForm.get('addRemove');
  }

  get name() {
    return this.bulkEmailForm.get('name');
  }

  get key() {
    return this.bulkEmailForm.get('key');
  }

  get profile() {
    return this.bulkEmailForm.get('profile');
  }

  get emails() {
    return this.bulkEmailForm.get('emails');
  }

  get labels() {
    return this.bulkEmailForm.get('labels') as FormArray;
  }

  get folders() {
    return this.bulkEmailForm.get('folders') as FormArray;
  }

  get domains() {
    return this.bulkEmailForm.get('domains') as FormArray;
  }

  get applyTo() {
    return this.bulkEmailForm.get('applyTo');
  }

  get checkboxValidator() {
    return this.bulkEmailForm.get('checkboxValidator');
  }
  
}
