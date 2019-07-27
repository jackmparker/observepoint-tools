import { Component, Input } from '@angular/core';
import { tools } from '../database/database';
import { IToolsModel } from '../interfaces/interfaces';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  @Input() current: string;

  tools: IToolsModel[] = tools;

}
