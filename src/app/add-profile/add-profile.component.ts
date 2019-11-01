import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.scss']
})
export class AddProfileComponent implements OnInit {

  newProfileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
  
  ngOnInit() {
    this.dialogRef.updatePosition({ top: '200px' });

    let name = this.data.event === 'edit' ? this.data.profile.name : '';
    let key = this.data.event === 'edit' ? this.data.profile.key : '';

    this.newProfileForm = this.fb.group({
      name: [name, Validators.required],
      key: [key, Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    let profile = {
      name: this.name,
      key: this.key
    };

    this.dialogRef.close(profile);
  }

  get name() {
    return this.newProfileForm.get('name').value;
  }

  get key() {
    return this.newProfileForm.get('key').value;
  }

}
