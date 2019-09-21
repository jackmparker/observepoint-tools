import { Component, OnInit } from '@angular/core';
import { TOOL_NAMES } from '../constants/constants';
import { Title } from '@angular/platform-browser';
import { scripts } from './op-custom-tag-builder.data';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-op-custom-tag-builder',
  templateUrl: './op-custom-tag-builder.component.html',
  styleUrls: ['./op-custom-tag-builder.component.scss']
})
export class OpCustomTagBuilderComponent implements OnInit {

  title: string = TOOL_NAMES.OP_CUSTOM_TAG_BUILDER.DISPLAY_NAME;
  sidebar: string = TOOL_NAMES.OP_CUSTOM_TAG_BUILDER.PATH;
  description: string = TOOL_NAMES.OP_CUSTOM_TAG_BUILDER.DESCRIPTION;
  data = scripts.sort((a: any, b: any) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : -1);
  selectedCode: string[] = [];
  compressed: string;

  constructor(
    private titleService: Title,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.setTitle(TOOL_NAMES.OP_CUSTOM_TAG_BUILDER.TITLE);
  }

  private setTitle(title: string): void {
    this.titleService.setTitle(title + ' | ObservePoint Tools');
  }

  onCheckboxChange(checked: boolean, index: number, code: string): void {
    checked ? this.selectedCode.push(code) : this.selectedCode.splice(this.selectedCode.indexOf(code), 1);
    
    this.handleCode();
  }

  private handleCode(): void {
    this.compressed = '';

    if(this.selectedCode.length) {
      this.compressed += 'function opReqGetAsync(e,t,n){var s="https://opreq.observepoint.com/?acct="+t,o=new XMLHttpRequest;o.onreadystatechange=function(){4==o.readyState&&200==o.status&&n(o.responseText)},o.open("POST",s,!0),o.send(JSON.stringify(e))}';
      this.compressed += this.selectedCode.join();
    }
  }

  showCopyMessage(): void {
    this.snackBar.open('Copied!', '', {
      duration: 2000,
      horizontalPosition: 'left'
    });
  }
}
