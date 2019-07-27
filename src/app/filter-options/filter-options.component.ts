import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'filter-options',
  templateUrl: './filter-options.component.html',
  styleUrls: ['./filter-options.component.scss']
})
export class FilterOptionsComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() labels?: Array<any>;
  @Input() folders?: Array<any>;
  @Input() domains?: Array<any>;

  labelsSelected: boolean = false;
  foldersSelected: boolean = false;
  domainsSelected: boolean = false;

  ngOnInit() {
    this.labelField.valueChanges.subscribe(() => {
      this.labelsSelected = (this.labelField.value.indexOf(true) > -1);
    });

    this.folderField.valueChanges.subscribe(() => {
      this.foldersSelected = (this.folderField.value.indexOf(true) > -1);
    });

    this.domainField.valueChanges.subscribe(() => {
      this.domainsSelected = (this.domainField.value.indexOf(true) > -1);
    });
  }

  get labelField() {
    return this.form.get('labels');
  }

  get folderField() {
    return this.form.get('folders');
  }

  get domainField() {
    return this.form.get('domains');
  }

  get labelSearchText() {
    return this.form.get('labelSearchText').value;
  }

}
