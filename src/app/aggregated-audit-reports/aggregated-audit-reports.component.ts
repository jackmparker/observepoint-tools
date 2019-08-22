import { Component, OnInit, ViewChild } from '@angular/core';
import { TOOL_NAMES } from '../constants/constants';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IProfileModel, IAuditModel, IAuditRunModel, IAuditObjectModel, ITagListModel, ITagModel } from '../interfaces/interfaces';
import { ProfileService } from '../profile-service.service';
import { ToolValidators } from '../validators';
import { ApiService } from '../api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';
import { FilterPipe } from '../filter.pipe';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-aggregated-audit-reports',
  templateUrl: './aggregated-audit-reports.component.html',
  styleUrls: ['./aggregated-audit-reports.component.scss'],
  providers: [ FilterPipe ]
})
export class AggregatedAuditReportsComponent implements OnInit {

  title: string = TOOL_NAMES.AGGREGATED_AUDIT_REPORTS.DISPLAY_NAME;
  sidebar: string = TOOL_NAMES.AGGREGATED_AUDIT_REPORTS.PATH;
  description: string = TOOL_NAMES.AGGREGATED_AUDIT_REPORTS.DESCRIPTION;
  fatkatForm: FormGroup;
  profiles: IProfileModel[];
  audits: any;
  apiKey: string;
  stepOneCompleted: boolean = false;
  stepTwoCompleted: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  auditIds: number[] = [];
  auditRunIds: number[] = [];
  tags: ITagModel[];
  tagList: ITagListModel[];
  tagsSelected: any = [];
  tagsSelectedIds: any = [];
  variablesSelected: any = [];
  showSpinner: boolean = false;
  payload: any;
  showSuccess: boolean = false;

  constructor(private titleService: Title,
              private fb: FormBuilder,
              private profileService: ProfileService,
              private apiService: ApiService,
              private pipe: FilterPipe) { }

  ngOnInit() {
    this.setTitle(TOOL_NAMES.AGGREGATED_AUDIT_REPORTS.TITLE);
    this.initForm();
    this.filterAudits();
    this.filterTags();
  }

  private initForm() {
    this.fatkatForm = this.fb.group({
      name: [null, Validators.required],
      key: [null, Validators.required],
      profile: [null, Validators.required],
      auditSearchText: [''],
      tagSearchText: [''],
      includeVariables: [true],
      includeTagFiles: [false],
      tagPicker: ['all'],
      preferredTags: [null],
      preferredVariables: [null],
      emails: [null, [Validators.required, ToolValidators.emails]],
      fileName: [null, Validators.required],
      runsSelectedValidator: [null, Validators.required]
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

  onProfileSelection(key: string): void {
    this.apiKey = key;
    this.stepOneCompleted = true;
    this.getAudits();
    this.getTags();
  }

  getAudits(): void {
    this.apiService.getAudits(this.apiKey).subscribe((audits: IAuditModel[]) => {
      this.audits = audits.map((audit: IAuditModel) => {
        return {
          name: audit.name,
          id: audit.id
        };
      });

      this.audits.sort((a: any, b: any) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
    });
  }

  getTags() {
    this.apiService.getAccountTags(this.apiKey).subscribe((tags: ITagModel[]) => {
      this.tags = tags;
    });
  }

  filterAudits(): void {
    this.auditSearchTextField.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(text => {
      this.pipe.transform(this.audits, text);
    });
  }

  filterTags(): void {
    this.tagSearchTextField.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(text => {
      this.pipe.transform(this.tagList, text);
    });
  }

  updateSelectedAudits(event: MatCheckboxChange, audit: IAuditModel): void {
    if(event.checked) {
      this.auditIds.push(audit.id);
    } else {
      let index = this.auditIds.indexOf(audit.id);
      this.auditIds.splice(index, 1);
    }

    this.updateValidator();
  }

  updateValidator(): void {
    if(this.auditIds.length) {
      this.runsSelectedValidator.patchValue(true);
      this.stepTwoCompleted = true;
    } else {
      this.runsSelectedValidator.patchValue(null);
      this.stepTwoCompleted = false;
    }
  }

  getLatestRuns(): void {
    let auditObservables = this.auditIds.map((id: number) => {
      return this.apiService.getAuditRuns(this.apiKey, id);
    });

    forkJoin(auditObservables).subscribe((runs: IAuditRunModel[]) => {
      let latestRuns = runs.map((run: IAuditRunModel): number => {
        return run[0].completed ? run[0].id : run[1].id;
      });

      this.auditRunIds = latestRuns;
      this.createAuditObjects(latestRuns);
    });
  }

  createAuditObjects(latestRuns: number[]) {
    let auditsObject = this.auditIds.map((id: number, index: number): IAuditObjectModel => {
      return {
        id: id,
        runId: latestRuns[index]
      };
    });

    this.getRunSummaries(auditsObject);
  }

  getRunSummaries(audits: IAuditObjectModel[]): void {
    let summariesObservables = audits.map((audit: IAuditObjectModel) => {
      return this.apiService.getAuditRunSummaries(this.apiKey, audit);
    });

    forkJoin(summariesObservables).subscribe(results => {
      this.createTagList(results);
    });
  }

  createTagList(results: any): void {
    let tags = [];

    results.map(result => {
      result.variableSummaries[0].summaries.map(summary => {
        let tagVariables = [];

        summary.accounts.map(account => {
          if(account.variables) {
            account.variables.map(variable => {
              tagVariables.push(variable);
            });
          }
        });

        // https://dev.to/vuevixens/removing-duplicates-in-an-array-of-objects-in-js-with-sets-3fep
        tagVariables = Array.from(new Set(tagVariables.map(a => a.name))).map(name => {
          return tagVariables.find(a => a.name === name);
        });

        tags.push({
          name: summary.tag.name,
          id: summary.tag.id,
          tagData: this.tags.find((tag: ITagModel) => { return tag.id === summary.tag.id }),
          variables: tagVariables.sort((a: any, b: any) => {
            let aName = a.friendlyName ? a.friendlyName : a.name;
            let bName = b.friendlyName ? b.friendlyName : b.name;
            return (aName.toLowerCase() > bName.toLowerCase()) ? 1 : -1;
          })
        });
      });
    });

    tags.sort((a: any, b: any) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);

    // https://dev.to/vuevixens/removing-duplicates-in-an-array-of-objects-in-js-with-sets-3fep
    this.tagList = Array.from(new Set(tags.map(a => a.id))).map(id => {
      return tags.find(a => a.id === id);
    });
  }

  onTagSelected(event, tag) {
    if(event.checked) {
      this.tagsSelected.push(tag);
    } else {
      this.tagsSelected.find((item, index) => {
        if(item.id === tag.id) {
          this.tagsSelected.splice(index, 1);
          return true;
        }        
      });
    }

    let preferredTags = this.tagsSelected.map(tag => {
      return tag.id;
    });

    this.preferredTags.patchValue(preferredTags);
  }

  onVariableSelected(event, variable) {
    if(event.checked) {
      this.variablesSelected.push(variable.name);
    } else {
      let index = this.variablesSelected.indexOf(variable.name);
      this.variablesSelected.splice(index, 1);
    }

    this.preferredVariables.patchValue(this.variablesSelected);
  }

  createPayload() {
    let requestData = this.fatkatForm.value;
    return {
      email: requestData.emails.split('\n').join(', '),
      filenameStart: requestData.fileName,
      auditRunIds: this.auditRunIds,
      includeVariables: requestData.includeVariables,
      tagFiles: requestData.includeTagFiles,
      tagIds: requestData.tagPicker === 'all' ? [] : requestData.preferredTags,
      preferredVariables: requestData.tagPicker === 'all' ? [] : requestData.preferredVariables,
    };
  }

  onSubmit() {
    this.showSuccess = false;
    this.showSpinner = true;
    this.payload = this.createPayload();
    
    this.apiService.sendFatKatRequest(this.payload).subscribe(response => {
      this.showSpinner = false;
      
      window.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth'
      });
  
      setTimeout(() => {
        this.showSuccess = true;
      }, 500);

      console.log('fatkat api response: ', response);
    });
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

  get auditSearchTextField() {
    return this.fatkatForm.get('auditSearchText');
  }

  get auditSearchText() {
    return this.fatkatForm.get('auditSearchText').value;
  }

  get tagSearchTextField() {
    return this.fatkatForm.get('tagSearchText');
  }

  get tagSearchText() {
    return this.fatkatForm.get('tagSearchText').value;
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

  get tagPicker() {
    return this.fatkatForm.get('tagPicker');
  }

  get preferredTags() {
    return this.fatkatForm.get('preferredTags');
  }

  get preferredVariables() {
    return this.fatkatForm.get('preferredVariables');
  }

  get tagFiles() {
    return this.fatkatForm.get('tagFiles');
  }

  get runsSelectedValidator() {
    return this.fatkatForm.get('runsSelectedValidator');
  }

}
