import { Component } from '@angular/core';
import { tools } from '../database/database';
import { IToolsModel } from '../interfaces/interfaces';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {

  tools: IToolsModel[] = tools;

}
