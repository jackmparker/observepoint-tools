import { Component, OnInit } from '@angular/core';
import { TOOL_NAMES } from '../constants/constants';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-copy-journey',
  templateUrl: './copy-journey.component.html',
  styleUrls: ['./copy-journey.component.scss']
})
export class CopyJourneyComponent implements OnInit {

  title: string = TOOL_NAMES.COPY_JOURNEY.DISPLAY_NAME;
  sidebar: string = TOOL_NAMES.COPY_JOURNEY.PATH;
  description: string = TOOL_NAMES.COPY_JOURNEY.DESCRIPTION;
  copyJourneyForm: FormGroup;
  apiKey: string;

  constructor(
    private titleService: Title,
    private fb: FormBuilder,
    private apiService: ApiService) { }

  ngOnInit() {
    this.setTitle(TOOL_NAMES.COPY_JOURNEY.TITLE);
    this.initForm();
  }

  private initForm() {
    this.copyJourneyForm = this.fb.group({
      name: [null, Validators.required],
      key: [null, Validators.required],
      profile: [null, Validators.required],
      // name2: [null, Validators.required],
      // key2: [null, Validators.required],
      // profile2: [null, Validators.required]
    });
  }

  private setTitle(title: string): void {
    this.titleService.setTitle(title + ' | ObservePoint Tools');
  }

}
