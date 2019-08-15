import { Component, OnInit } from '@angular/core';
import { TOOL_NAMES } from '../constants/constants';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IProfileModel } from '../interfaces/interfaces';
import { ProfileService } from '../profile-service.service';
import { ToolValidators } from '../validators';

@Component({
  selector: 'app-aggregated-audit-reports',
  templateUrl: './aggregated-audit-reports.component.html',
  styleUrls: ['./aggregated-audit-reports.component.scss']
})
export class AggregatedAuditReportsComponent implements OnInit {

  title: string = TOOL_NAMES.AGGREGATED_AUDIT_REPORTS.DISPLAY_NAME;
  sidebar: string = TOOL_NAMES.AGGREGATED_AUDIT_REPORTS.PATH;
  description: string = TOOL_NAMES.AGGREGATED_AUDIT_REPORTS.DESCRIPTION;
  fatkatForm: FormGroup;
  profiles: IProfileModel[];
  stepOneCompleted: boolean = false;
  stepTwoCompleted: boolean = false;

  constructor(private titleService: Title,
              private fb: FormBuilder,
              private profileService: ProfileService) { }

  ngOnInit() {
    this.setTitle(TOOL_NAMES.AGGREGATED_AUDIT_REPORTS.TITLE);
    this.initForm();
  }

  private initForm() {
    this.fatkatForm = this.fb.group({
      name: [null, Validators.required],
      key: [null, Validators.required],
      profile: [null, Validators.required],
      audits: [null, Validators.required],
      includeVariables: [true],
      includeTagFiles: [false],
      preferredTags: [null],
      preferredVariables: [null],
      emails: [null, [Validators.required, ToolValidators.emails]],
      fileName: [null, Validators.required]
    });

    this.profiles = this.profileService.getProfiles();

    if(this.profiles.length) {
      this.name.disable();
      this.key.disable();
    } else {
      this.profile.disable();
    }
  }

  private setTitle(title: string): void {
    this.titleService.setTitle(title + ' | ObservePoint Tools');
  }

  markStepOneAsCompleted() {
    this.stepOneCompleted = true;
  }

  getAudits() {
    console.log('test')
  }

  onSubmit(fatkatForm) {
    console.log(fatkatForm.value);
  }

  get name() {
    return this.fatkatForm.get('name');
  }

  get key() {
    return this.fatkatForm.get('key');
  }

  get profile() {
    return this.fatkatForm.get('profile');
  }

  get emails() {
    return this.fatkatForm.get('emails');
  }

  get fileName() {
    return this.fatkatForm.get('fileName');
  }

  get includeVariables() {
    return this.fatkatForm.get('includeVariables');
  }

  get tagIds() {
    return this.fatkatForm.get('tagIds');
  }

  get preferredVariables() {
    return this.fatkatForm.get('preferredVariables');
  }

  get tagFiles() {
    return this.fatkatForm.get('tagFiles');
  }

}
