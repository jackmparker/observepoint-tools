import { Component, OnInit } from '@angular/core';
import { TOOL_NAMES } from '../constants/constants';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProfileModel } from '../interfaces/interfaces';
import { ProfileService } from '../profile-service.service';

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
  showSpinner: boolean = false;

  constructor(private titleService: Title,
              private fb: FormBuilder,
              private profileService: ProfileService) { }

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

  getItems() {
    console.log(this.bulkDeleteForm.value);
  }

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
