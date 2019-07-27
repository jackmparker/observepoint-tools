import { Component, OnInit, Input, Output } from '@angular/core';
import { IProfileModel } from '../interfaces/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { AddProfileComponent } from '../add-profile/add-profile.component';
import { ProfileService } from '../profile-service.service';
import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'profile-selector',
  templateUrl: './profile-selector.component.html',
  styleUrls: ['./profile-selector.component.scss']
})
export class ProfileSelectorComponent implements OnInit {

  @Input() form: FormGroup;
  @Output() keyEmitter = new EventEmitter();

  name: string;
  key: string;
  profiles: IProfileModel[];

  constructor(
    public dialog: MatDialog,
    private profileService: ProfileService) { }

  ngOnInit() {
    this.profiles = this.profileService.getProfiles();
  }

  enterNewKey() {
    const dialogRef = this.dialog.open(AddProfileComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        event: 'new',
        profile: {
          name: '',
          key: ''
        }
      }
    });

    dialogRef.afterClosed().subscribe(dialog => {
      if(dialog) {
        let newKey: IProfileModel = {
          name: dialog.name,
          key: dialog.key
        };
  
        this.profiles.push(newKey);
        this.profileService.updateProfiles(this.profiles);
      }
    });
  }

  onKeyChosen() {
    this.keyEmitter.emit(this.apiKey.value);
  }

  onKeyEntered() {
    this.keyEmitter.emit(this.profileKey.value);
  }

  get apiKey() {
    return this.form.get('profile');
  }

  get profileName() {
    return this.form.get('name');
  }

  get profileKey() {
    return this.form.get('key');
  }

}
