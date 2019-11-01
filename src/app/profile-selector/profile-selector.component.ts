import { Component, OnInit, Input, Output } from '@angular/core';
import { IProfileModel } from '../interfaces/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { AddProfileComponent } from '../add-profile/add-profile.component';
import { ProfileService } from '../profile-service.service';
import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public dialog: MatDialog,
    private profileService: ProfileService) { }

  ngOnInit() {
    this.profiles = this.profileService.getProfiles();

    if(this.profiles.length === 1) {
      this.apiKey.setValue(this.profiles[0].key);
      this.onKeyChosen();
    }
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

    dialogRef.afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe(dialog => {
      if(dialog) {
        let newKey: IProfileModel = {
          name: dialog.name,
          key: dialog.key
        };
  
        this.profiles.push(newKey);
        this.profileService.updateProfiles(this.profiles);
        this.apiKey.patchValue(newKey.key);
        this.onKeyChosen();
      }
    });
  }

  onKeyChosen() {
    this.keyEmitter.emit(this.apiKey.value);
  }

  onKeyEntered() {
    let newKey: IProfileModel = {
      name: this.profileName.value,
      key: this.profileKey.value
    };

    this.profiles.push(newKey);
    this.profileService.updateProfiles(this.profiles);
    this.keyEmitter.emit(this.profileKey.value);
    this.apiKey.setValue(newKey.key);
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
