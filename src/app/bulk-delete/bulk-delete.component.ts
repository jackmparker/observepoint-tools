import { Component, OnInit } from '@angular/core';
import { TOOL_NAMES } from '../constants/constants';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProfileModel, IFolderModel } from '../interfaces/interfaces';
import { ProfileService } from '../profile-service.service';
import { ApiService } from '../api.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

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
    this.showSpinner = false;
    this.getApiKey();
    this.getFolders();
  }
  

  /*
   *  FOLDERS
   *
  */
 
  folders: IFolderModel[];
  displayedColumns: string[] = ['select', 'name', 'domains', 'apps', 'createdBy'];
  dataSource = new MatTableDataSource<IFolderModel>();
  selection = new SelectionModel<IFolderModel>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  private getFolders() {
    this.apiService.getFolders(this.apiKey).subscribe((folders: IFolderModel[]): void => {
      this.folders = folders;
      this.showSpinner = false;
      this.formSubmitted = true;
      this.displayFolders();  
    });
  }
  
  private displayFolders() {
    this.dataSource.data = this.folders;
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
