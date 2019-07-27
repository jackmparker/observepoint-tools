import { Component, OnInit, ViewChild } from '@angular/core';
import { IProfileModel } from '../interfaces/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ProfileService } from '../profile-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AddProfileComponent } from '../add-profile/add-profile.component';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss']
})
export class ProfileEditorComponent implements OnInit {

  profiles: IProfileModel[];
  dataSource = new MatTableDataSource<IProfileModel>();
  selection = new SelectionModel<IProfileModel>(true, []);
  displayedColumns: string[] = ['select', 'name', 'key', 'edit'];
  name: string;
  key: string;

  constructor(
    private profileService: ProfileService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.profiles = this.profileService.getProfiles();
    this.dataSource.data = this.profiles;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  deleteProfiles() {
    let diff = this.profiles.filter(x => !this.selection.selected.includes(x));
    this.profiles = diff;
    this.dataSource.data = diff;
    this.selection.clear();
    this.profileService.updateProfiles(diff);
  }

  addNewProfile() {
    const dialogRef = this.dialog.open(AddProfileComponent, {
      width: '600px',
      restoreFocus: false,
      autoFocus: false,
      data: {
        event: 'new',
        profile: {
          name: '',
          key: ''
        }
      }
    });

    dialogRef.afterClosed().subscribe((dialog: IProfileModel) => {
      if(dialog) {
        this.profiles.push(dialog);
        this.sortProfiles(this.profiles);
        this.dataSource.data = this.profiles;
        this.profileService.updateProfiles(this.dataSource.data);
      }
    });
  }

  onEdit(profile: IProfileModel) {
    const dialogRef = this.dialog.open(AddProfileComponent, {
      width: '600px',
      autoFocus: false,
      data: {
        event: 'edit',
        profile: profile
      }
    });

    dialogRef.afterClosed().subscribe((dialog: IProfileModel) => {
      if(dialog) {
        let diff = this.dataSource.data.filter(x => ![profile].includes(x));
        diff.push(dialog);

        this.sortProfiles(diff);
        
        this.profiles = diff;
        this.dataSource.data = diff;
        this.profileService.updateProfiles(diff);
      }
    });
  }

  private sortProfiles(profiles: IProfileModel[]) {
    profiles.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
  }

}
