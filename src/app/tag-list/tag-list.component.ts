import { Component, OnInit, ViewChild } from '@angular/core';
import { TOOL_NAMES } from '../constants/constants';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../api.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ITagModel, ILoginResponseModel, ITagSimpleModel } from '../interfaces/interfaces';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit {

  title: string = TOOL_NAMES.TAG_LIST.DISPLAY_NAME;
  sidebar: string = TOOL_NAMES.TAG_LIST.PATH;
  description: string = TOOL_NAMES.TAG_LIST.DESCRIPTION;
  tags: ITagSimpleModel[];
  displayedColumns: string[] = ['id', 'icon', 'name', 'category'];
  dataSource: MatTableDataSource<ITagSimpleModel>;
  gotTags: boolean = false;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private titleService: Title,
              private apiService: ApiService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.setTitle(TOOL_NAMES.TAG_LIST.TITLE);
    this.getTags();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private getTags() {
    this.apiService.getTags().subscribe((tags: ITagModel[]) => {
      this.tags = tags.filter((tag: ITagModel) => tag.category.id !== 7).map((tag: ITagModel) => {
        return {
          id: tag.id,
          icon: tag.icon,
          name: tag.name,
          category: tag.category.name
        };
      });
      this.dataSource = new MatTableDataSource(this.tags);
      this.gotTags = true;
      this.dataSource.sort = this.sort;
    });
  }

  private setTitle(title: string): void {
    this.titleService.setTitle(title + ' | ObservePoint Tools');
  }

  // -------------------------------------------------------------------
  // Based off https://medium.com/@danny.pule/export-json-to-csv-file-using-javascript-a0b7bc5b00d2
  // -------------------------------------------------------------------

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

  downloadCSV() {
    var headers = {
        id: 'Tag ID',
        name: 'Tag Name',
        category: 'Category'
    };

    var itemsFormatted = [];

    // format the data
    this.tags.forEach((item) => {
        itemsFormatted.push({
            id: item.id,
            name: item.name.replace(/,/g, ''),
            category: item.category.replace(/,/g, '')
        });
    });

    var fileTitle = 'ObservePoint Tag Database';

    this.exportCSVFile(headers, itemsFormatted, fileTitle);
  }

}