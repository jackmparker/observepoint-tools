import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TOOL_NAMES, ITEM_TYPES } from '../constants/constants';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { IProfileModel } from '../interfaces/interfaces';
import { ProfileService } from '../profile-service.service';
import { ApiService } from '../api.service';
import { ToolValidators } from '../validators';
import { Subject, forkJoin, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';

@Component({
  selector: 'bulk-email',
  templateUrl: './bulk-email.component.html',
  styleUrls: ['./bulk-email.component.scss']
})
export class BulkEmailComponent implements OnInit {

  title: string = TOOL_NAMES.BULK_EMAIL.DISPLAY_NAME;
  sidebar: string = TOOL_NAMES.BULK_EMAIL.PATH;
  description: string = TOOL_NAMES.BULK_EMAIL.DESCRIPTION;
  profiles: IProfileModel[];
  bulkEmailForm: FormGroup;
  addRemoveSelection: string = 'Add emails to:';
  labelData: any;
  folderData: any;
  domainData: any;
  audits: any;
  journeys: any;
  apps: any;
  rules: any;
  apiKey: string;
  filterBy: string;
  filterList: Array<number>;
  emailsToAddRemove: Array<string>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  updatedItems = {
    audits: {
      success: 0,
      failures: 0,
      errors: []
    },
    journeys: {
      success: 0,
      failures: 0,
      errors: []
    },
    apps: {
      success: 0,
      failures: 0,
      errors: []
    },
    rules: {
      success: 0,
      failures: 0,
      errors: []
    }
  };
  noItemsToFilter: number = 0;
  itemsCompleted: number = 0;
  showSpinner: boolean = false;
  errorsFound: boolean = false;
  showSuccess: boolean = false;
  successMessage: Array<string> = [];
  // showSuccess: boolean = true;
  // successMessage: Array<string> = ['Updated 45 audits', 'Updated 10 journeys', 'Updated 12 rules'];

  constructor(
    private titleService: Title,
    private fb: FormBuilder,
    private profileService: ProfileService,
    private apiService: ApiService) { }

  ngOnInit() {
    this.setTitle(TOOL_NAMES.BULK_EMAIL.TITLE);

    this.bulkEmailForm = this.fb.group({
      addRemove: ['add', Validators.required],
      name: [null, Validators.required],
      key: [null, Validators.required],
      profile: [null, Validators.required],
      emails: [null, [Validators.required, ToolValidators.emails]],
      filters: this.fb.group({
        labels: [[]],
        folders: [[]],
        domains: [[]]
      }),
      applyTo: this.fb.group({
        audits: [false],
        journeys: [false],
        apps: [false],
        rules: [false]
      }),
      checkboxValidator: [null, Validators.required]
    });

    this.profiles = this.profileService.getProfiles();

    this.evalProfiles();

    this.addRemove.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(change => {
      this.addRemoveSelection = change === 'add' ? 'Add emails to:' : 'Remove emails from:';
    });

    this.applyTo.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(change => {
      if(Object.values(change).indexOf(true) > -1) {
        this.checkboxValidator.patchValue(true);
      } else {
        this.checkboxValidator.patchValue(null);
      }
    });
  }

  private setTitle(title: string): void {
    this.titleService.setTitle(title + ' | ObservePoint Tools');
  }

  private evalProfiles() {
    this.profiles = this.profileService.getProfiles();

    if(this.profiles.length) {
      this.name.disable();
      this.key.disable();
      this.profile.enable();
    } else {
      this.name.enable();
      this.key.enable();
      this.profile.disable();
    }
  }

  getFilters(key: string): void {
    this.evalProfiles();
    this.apiKey = key;
    
    // labels
    this.apiService.getLabels(key).subscribe(
      data => {
        this.labelData = data;
        this.labelData.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
      },
      error => {
        this.handleError(error);
      }
    );

    // folders
    this.apiService.getFolders(key).subscribe(
      data => {
        this.folderData = data;
        this.folderData.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
      },
      error => {
        this.handleError(error);
      }
    );

    // domains
    this.apiService.getDomains(key).subscribe(
      data => {
        this.domainData = data;
        this.domainData.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
      },
      error => {
        this.handleError(error);
      }
    );

  }

  private handleError(error) {
    if(error.error.errorCode === 1) {
      if(this.profiles.length) {
        this.profile.setErrors({ invalidApiKey: true });
        this.profile.markAsTouched();
      } else {
        this.key.setErrors({ invalidApiKey: true });
        this.profile.markAsTouched();
      }
    }
  }

  onSubmit(form) {
    this.resetVariables();
    this.showSpinner = true;
    let values = form.value;

    this.setFilterOptions();
    this.emailsToAddRemove = values.emails.split('\n').map(e => e.trim()).filter(e => e !== '');

    if(values.applyTo.audits) this.processAudits();
    if(values.applyTo.journeys) this.processWebJourneys();
    if(values.applyTo.apps) this.processApps();
    if(values.applyTo.rules) this.processRules();
  }

  private processAudits(): void {
    this.apiService.getAudits(this.apiKey).subscribe(audits => {
      this.audits = audits;

      if(this.audits.length) {
        this.audits = this.filterAudits(this.audits);

        if(this.audits.length) {
          this.updateAudits(this.prepAudits(this.audits));
        } else {
          this.itemsCompleted++;
          this.checkIfComplete();
        }
      } else {
        this.itemsCompleted++;
        this.checkIfComplete();
      }
    });
  }

  private processWebJourneys(): void {
    this.apiService.getWebJourneys(this.apiKey).subscribe(journeys => {
      this.journeys = journeys;

      if(this.journeys.length) {
        let journeyObservables = this.journeys.map(journey => {
          return this.apiService.getWebJourneyActions(this.apiKey, journey);
        });
  
        forkJoin(journeyObservables).subscribe(response => {
          response.map((journey, index) => {
            // ensure we don't assign the wrong actions to the wrong journey
            if(this.journeys[index].id === journey['id']) {
              this.journeys[index].actions = journey['actions'];
            }
          });
  
          this.journeys = this.filterWebJourneys(this.journeys);
  
          if(this.journeys.length) {
            this.updateWebJourneys(this.prepJourneys(this.journeys));
          } else {
            this.itemsCompleted++;
            this.checkIfComplete();
          }
        });
      } else {
        this.itemsCompleted++;
        this.checkIfComplete();
      }
    });
  }

  private processApps(): void {
    this.apiService.getMobileApps(this.apiKey).subscribe(apps => {
      this.apps = apps;

      if(this.apps.length) {
        this.apps = this.filterApps(this.apps);

        if(this.apps.length) {
          this.updateApps(this.prepApps(this.apps));
        } else {
          this.itemsCompleted++;
          this.checkIfComplete();
        }
      } else {
        this.itemsCompleted++;
        this.checkIfComplete();
      }
    });
  }

  private processRules(): void {
    this.apiService.getRules(this.apiKey).subscribe(rules => {
      this.rules = rules;

      // remove pre-defined rules
      if(this.rules.length) this.rules = this.rules.filter(rule => rule.fromTemplate === false);

      if(this.rules.length) {
        this.rules = this.filterRules(this.rules);
        
        if(this.rules.length) {
          this.updateRules(this.prepRules(this.rules));
        } else {
          this.itemsCompleted++;
          this.checkIfComplete();
        }
      } else {
        this.itemsCompleted++;
        this.checkIfComplete();
      }
    });
  }

  private filterAudits(audits) {
    // first filter based on criteria chosen by user
    // only if they've chosen a filter
    if(this.getFilterType()) {
      audits = audits.filter(audit => {
      
        if(this.filterBy === ITEM_TYPES.LABELS) {
          let labels = this.filters.value[this.filterBy];

          let matches = labels.filter(label => {
            if(label.audits.length) {
              if(label.audits.indexOf(audit.id) > -1) {
                return audit;
              }
            }
          });

          if(matches.length) {
            return audit;
          }
        }
  
        if(this.filterBy === ITEM_TYPES.FOLDERS) {
          return (this.filterList.indexOf(audit.folderId) > -1);
        }
  
        if(this.filterBy === ITEM_TYPES.DOMAINS) {
          return (this.filterList.indexOf(audit.domainId) > -1);
        }
  
      });
    }

    // then remove audits that don't need an update
    return audits.filter(audit => {
      let intersection = audit.recipients.filter(x => this.emailsToAddRemove.includes(x));

      if(this.addRemove.value === 'add') {
        if(intersection.length < this.emailsToAddRemove.length) {
          return audit;
        }
      } else {
        if(intersection.length !== 0 && intersection.length <= this.emailsToAddRemove.length) {
          return audit;
        }
      }
    });
  }

  private filterWebJourneys(journeys) {
    // first filter based on criteria chosen by user
    // only if they've chosen a filter
    if(this.getFilterType()) {
      journeys = journeys.filter(journey => {

        if(this.filterBy === ITEM_TYPES.LABELS) {
          let labels = this.filters.value[this.filterBy];

          let matches = labels.filter(label => {
            if(label.webJourney.length) {
              if(label.webJourney.indexOf(journey.id) > -1) {
                return journey;
              }
            }
          });

          if(matches.length) {
            return journey;
          }
        }

        if(this.filterBy === ITEM_TYPES.FOLDERS) {
          return (this.filterList.indexOf(journey.folderId) > -1);
        }
  
        if(this.filterBy === ITEM_TYPES.DOMAINS) {
          return (this.filterList.indexOf(journey.domainId) > -1);
        }
  
      });
    }

    // then remove journeys that don't need an update
    return journeys.filter(journey => {
      let intersection = journey.emails.filter(x => this.emailsToAddRemove.includes(x));

      if(this.addRemove.value === 'add') {
        if(intersection.length < this.emailsToAddRemove.length) {
          return journey;
        }
      } else {
        if(intersection.length !== 0 && intersection.length <= this.emailsToAddRemove.length) {
          return journey;
        }
      }
    });
  }

  private filterApps(apps) {
    // first filter based on criteria chosen by user
    // only if they've chosen a filter
    if(this.getFilterType()) {
      return apps.filter(app => {

        if(this.filterBy === ITEM_TYPES.FOLDERS) {
          return (this.filterList.indexOf(app.folderId) > -1);
        }
  
      });
    }

    // then remove apps that don't need an update
    return apps.filter(app => {
      if(!app.recipients) app.recipients = [];
      let intersection = app.recipients.filter(x => this.emailsToAddRemove.includes(x));
      
      if(this.addRemove.value === 'add') {
        if(intersection.length < this.emailsToAddRemove.length) {
          return app;
        }
      } else {
        if(intersection.length !== 0 && intersection.length <= this.emailsToAddRemove.length) {
          return app;
        }
      }
    });
  }

  private filterRules(rules) {
    // first filter based on criteria chosen by user
    // only if they've chosen a filter
    if(this.getFilterType()) {
      rules = rules.filter(rule => {
      
        if(this.filterBy === ITEM_TYPES.LABELS) {
          let labels = this.filters.value[this.filterBy];

          let matches = labels.filter(label => {
            if(label.rules.length) {
              if(label.rules.indexOf(rule.id) > -1) {
                return rule;
              }
            }
          });

          if(matches.length) {
            return rule;
          }
        }
  
      });
    }

    // then remove rules that don't need an update
    return rules.filter(rule => {
      let intersection = rule.recipients.filter(x => this.emailsToAddRemove.includes(x));
      
      if(this.addRemove.value === 'add') {
        if(intersection.length < this.emailsToAddRemove.length) {
          return rule;
        }
      } else {
        if(intersection.length !== 0 && intersection.length <= this.emailsToAddRemove.length) {
          return rule;
        }
      }
    });
  }

  private prepAudits(audits) {
    return audits.map(audit => {
      if(this.addRemove.value === 'add') {
        let emails = audit.recipients.concat(this.emailsToAddRemove);
        let set = new Set(emails);
        audit.recipients = [...set];
      } else {
        audit.recipients = audit.recipients.filter(email => this.emailsToAddRemove.indexOf(email) === -1);
      }

      return audit;
    });
  }

  private prepJourneys(journeys) {
    return journeys.map(journey => {
      if(this.addRemove.value === 'add') {
        let emails = journey.emails.concat(this.emailsToAddRemove);
        let set = new Set(emails);
        journey.emails = [...set];
      } else {
        journey.emails = journey.emails.filter(email => this.emailsToAddRemove.indexOf(email) === -1);
      }

      return journey;
    });
  }

  private prepApps(apps) {
    return apps.map(app => {
      if(this.addRemove.value === 'add') {
        let emails = app.recipients.concat(this.emailsToAddRemove);
        let set = new Set(emails);
        app.recipients = [...set];
      } else {
        app.recipients = app.recipients.filter(email => this.emailsToAddRemove.indexOf(email) === -1);
      }

      return app;
    });
  }

  private prepRules(rules) {
    return rules.map(rule => {
      if(this.addRemove.value === 'add') {
        let emails = rule.recipients.concat(this.emailsToAddRemove);
        let set = new Set(emails);
        rule.recipients = [...set];
      } else {
        rule.recipients = rule.recipients.filter(email => this.emailsToAddRemove.indexOf(email) === -1);
      }

      return rule;
    });
  }

  private updateAudits(audits): void {
    let auditObservables = audits.map(audit => {
      return this.apiService.updateAudit(this.apiKey, audit).pipe(catchError(error => {
        this.errorsFound = true;
        this.updatedItems.audits.failures++;
        this.updatedItems.audits.errors.push({ error: error, item: audit });
        return of([]);
      }));
    });

    forkJoin(auditObservables).subscribe(
      response => {
        this.updatedItems.audits.success = response.length - this.updatedItems.audits.failures;
        this.itemsCompleted++;
        this.checkIfComplete();
      },
      error => {
        console.log(error);
      }
    );
  }

  private updateWebJourneys(journeys): void {
    let journeyObservables = journeys.map(journey => {
      return this.apiService.updateWebJourney(this.apiKey, journey).pipe(catchError(error => {
        this.errorsFound = true;
        this.updatedItems.journeys.failures++;
        this.updatedItems.journeys.errors.push({ error: error, item: journey });
        return of([]);
      }));
    });

    forkJoin(journeyObservables).subscribe(
      response => {
        this.updatedItems.journeys.success = response.length - this.updatedItems.journeys.failures;
        this.itemsCompleted++;
        this.checkIfComplete();
      },
      error => {
        console.log(error);
      }
    );
  }

  private updateApps(apps): void {
    let appObservables = apps.map(app => {
      return this.apiService.updateApp(this.apiKey, app).pipe(catchError(error => {
        this.errorsFound = true;
        this.updatedItems.apps.failures++;
        this.updatedItems.apps.errors.push({ error: error, item: app });
        return of([]);
      }));
    });

    forkJoin(appObservables).subscribe(
      response => {
        this.updatedItems.apps.success = response.length - this.updatedItems.apps.failures;
        this.itemsCompleted++;
        this.checkIfComplete();
      },
      error => {
        console.log(error);
      }
    );
  }

  private updateRules(rules): void {
    let ruleObservables = rules.map(rule => {
      return this.apiService.updateRule(this.apiKey, rule).pipe(catchError(error => {
        this.errorsFound = true;
        this.updatedItems.rules.failures++;
        this.updatedItems.rules.errors.push({ error: error, item: rule });
        return of([]);
      }));
    });
    
    forkJoin(ruleObservables).subscribe(
      response => {
        this.updatedItems.rules.success = response.length - this.updatedItems.rules.failures;
        this.itemsCompleted++;
        this.checkIfComplete();
      },
      error => {
        console.log(error);
      }
    );
  }

  private setFilterOptions(): void {
    this.filterBy = this.getFilterType();
    if(this.filterBy) {
      this.filterList = this.filters.value[this.filterBy].map(filter => filter.id);
    }
  }

  private getFilterType(): string {
    let filters = this.filters.value;
    
    if(filters.labels.length) return ITEM_TYPES.LABELS;
    if(filters.folders.length) return ITEM_TYPES.FOLDERS;
    if(filters.domains.length) return ITEM_TYPES.DOMAINS;
    
    return null;
  }

  private checkIfComplete(): void {
    let applyToCount = this.getApplyToCount();

    if(this.itemsCompleted === applyToCount) {
      this.showSpinner = false;
      this.displayResults();
    }
  }

  private getApplyToCount() {
    let count: number = 0;
    let applyTo: any = this.applyTo.value;

    Object.keys(applyTo).map((key) => {
      if(applyTo[key] === true) count++;
    });

    return count;
  }

  private displayResults(): void {
    this.generateSuccessMessage();
    
    window.scroll({
      top: 0, 
      left: 0, 
      behavior: 'smooth'
    });

    setTimeout(() => {
      this.showSuccess = true;
    }, 500);
  }

  private generateSuccessMessage() {
    let numAudits = this.updatedItems.audits.success;
    if(numAudits) {
      this.successMessage.push('Updated ' + numAudits + ' web audits');
    }

    let numJourneys = this.updatedItems.journeys.success;
    if(numJourneys) {
      this.successMessage.push('Updated ' + numJourneys + ' web journeys');
    }

    let numApps = this.updatedItems.apps.success;
    if(numApps) {
      this.successMessage.push('Updated ' + numApps + ' apps');
    }

    let numRules = this.updatedItems.rules.success;
    if(numRules) {
      this.successMessage.push('Updated ' + numRules + ' rules');
    }
  }

  private resetVariables() {
    this.successMessage = [];
    this.noItemsToFilter = 0;
    this.itemsCompleted = 0;
    this.errorsFound = false;
    this.showSuccess = false;
    this.updatedItems = {
      audits: {
        success: 0,
        failures: 0,
        errors: []
      },
      journeys: {
        success: 0,
        failures: 0,
        errors: []
      },
      apps: {
        success: 0,
        failures: 0,
        errors: []
      },
      rules: {
        success: 0,
        failures: 0,
        errors: []
      }
    }
  }

  resetForm() {
    this.bulkEmailForm.reset();
  }

  get addRemove() { 
    return this.bulkEmailForm.get('addRemove');
  }

  get name() {
    return this.bulkEmailForm.get('name');
  }

  get key() {
    return this.bulkEmailForm.get('key');
  }

  get profile() {
    return this.bulkEmailForm.get('profile');
  }

  get emails() {
    return this.bulkEmailForm.get('emails');
  }

  get labels() {
    return this.bulkEmailForm.get('labels');
  }

  get folders() {
    return this.bulkEmailForm.get('folders');
  }

  get domains() {
    return this.bulkEmailForm.get('domains');
  }

  get filters() {
    return this.bulkEmailForm.get('filters');
  }

  get applyTo() {
    return this.bulkEmailForm.get('applyTo');
  }

  get checkboxValidator() {
    return this.bulkEmailForm.get('checkboxValidator');
  }
  
}
