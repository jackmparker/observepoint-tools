import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'filter-options',
  templateUrl: './filter-options.component.html',
  styleUrls: ['./filter-options.component.scss']
})
export class FilterOptionsComponent implements OnChanges{

  @Input() form: FormGroup;
  @Input() labels?: Array<any>;
  @Input() folders?: Array<any>;
  @Input() domains?: Array<any>;
  
  disableLabels: boolean = false;
  disableFolders: boolean = false;
  disableDomains: boolean = false;

  gotLabelData: boolean = false;
  gotFolderData: boolean = false;
  gotDomainData: boolean = false;

  showTabs: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    this.gotLabelData = changes.labels && changes.labels.currentValue;
    this.gotFolderData = changes.folders && changes.folders.currentValue;
    this.gotDomainData = changes.domains && changes.domains.currentValue;

    if(this.gotLabelData && this.gotFolderData && this.gotDomainData && !this.showTabs) {
      this.setDisabledState();
      this.showTabs = true;
    }
  }

  onCheckboxChange(event, type) {
    let checkboxValue = event.source.value;

    if(type === 'label') {
      if(event.checked === true) {
        this.labelField.push(checkboxValue);
      } else {
        let index = this.labelField.indexOf(checkboxValue);
        this.labelField.splice(index, 1);
      }
    }

    if(type === 'folder') {
      if(event.checked === true) {
        this.folderField.push(checkboxValue);
      } else {
        let index = this.folderField.indexOf(checkboxValue);
        this.folderField.splice(index, 1);
      }
    }

    if(type === 'domain') {
      if(event.checked === true) {
        this.domainField.push(checkboxValue);
      } else {
        let index = this.domainField.indexOf(checkboxValue);
        this.domainField.splice(index, 1);
      }
    }

    this.setDisabledState();
  }

  setDisabledState() {
    this.disableLabels = this.folderField.length > 0 || this.domainField.length > 0;
    this.disableFolders = this.labelField.length > 0 || this.domainField.length > 0;
    this.disableDomains = this.labelField.length > 0 || this.folderField.length > 0;
  }

  findObject(obj) {
    console.log(obj);
  }

  get labelField() {
    return this.form.get('filters').get('labels').value;
  }

  get folderField() {
    return this.form.get('filters').get('folders').value;
  }

  get domainField() {
    return this.form.get('filters').get('domains').value;
  }

}
