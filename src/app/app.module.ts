import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import 'hammerjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomepageComponent } from './homepage/homepage.component';
import { BulkEmailComponent } from './bulk-email/bulk-email.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { ProfileSelectorComponent } from './profile-selector/profile-selector.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AddProfileComponent } from './add-profile/add-profile.component';
import { HttpClientModule } from '@angular/common/http';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { FilterOptionsComponent } from './filter-options/filter-options.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FilterPipe } from './filter.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SuccessComponent } from './success/success.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BearerTokenGeneratorComponent } from './bearer-token-generator/bearer-token-generator.component';
import { ClipboardModule } from 'ngx-clipboard';
import { FolderDomainIdsComponent } from './folder-domain-ids/folder-domain-ids.component';
import { AggregatedAuditReportsComponent } from './aggregated-audit-reports/aggregated-audit-reports.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { OpCustomTagBuilderComponent } from './op-custom-tag-builder/op-custom-tag-builder.component';
import { MarkdownModule } from 'ngx-markdown';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RunEntireFolderComponent } from './run-entire-folder/run-entire-folder.component';
import { CopyJourneyComponent } from './copy-journey/copy-journey.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    HomepageComponent,
    BulkEmailComponent,
    ProfileSelectorComponent,
    AddProfileComponent,
    ProfileEditorComponent,
    FilterOptionsComponent,
    FilterPipe,
    SuccessComponent,
    TagListComponent,
    BearerTokenGeneratorComponent,
    FolderDomainIdsComponent,
    AggregatedAuditReportsComponent,
    OpCustomTagBuilderComponent,
    RunEntireFolderComponent,
    CopyJourneyComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    HttpClientModule,
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    ClipboardModule,
    MatSlideToggleModule,
    MatStepperModule,
    MarkdownModule.forRoot(),
    MatSnackBarModule
  ],
  providers: [
    Title,
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' }
    }
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    AddProfileComponent
  ]
})
export class AppModule { }
