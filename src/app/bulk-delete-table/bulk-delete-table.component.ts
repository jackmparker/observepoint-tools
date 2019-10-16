import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { IFolderDomainIdModel } from '../interfaces/interfaces';

@Component({
  selector: 'bulk-delete-table',
  templateUrl: './bulk-delete-table.component.html',
  styleUrls: ['./bulk-delete-table.component.scss']
})
export class BulkDeleteTableComponent implements OnInit {

  @Input() title: string;
  @Input() columns: string[];
  @Input() data: any[];

  dataSource = new MatTableDataSource<IFolderDomainIdModel>();
  selection = new SelectionModel<IFolderDomainIdModel>(true, []);
  displayedColumns: string[] = ['select'];

  constructor() { }

  ngOnInit() {
    this.dataSource.data = this.data;
    this.displayedColumns.concat(this.columns);
  }

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

}
