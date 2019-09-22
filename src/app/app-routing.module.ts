import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { BulkEmailComponent } from './bulk-email/bulk-email.component';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { BearerTokenGeneratorComponent } from './bearer-token-generator/bearer-token-generator.component';
import { FolderDomainIdsComponent } from './folder-domain-ids/folder-domain-ids.component';
import { AggregatedAuditReportsComponent } from './aggregated-audit-reports/aggregated-audit-reports.component';
import { OpCustomTagBuilderComponent } from './op-custom-tag-builder/op-custom-tag-builder.component';
import { RunEntireFolderComponent } from './run-entire-folder/run-entire-folder.component';


const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'bulk-email', component: BulkEmailComponent },
  { path: 'manage-profiles', component: ProfileEditorComponent },
  { path: 'tag-list', component: TagListComponent },
  { path: 'bearer-token', component: BearerTokenGeneratorComponent },
  { path: 'folder-domain-ids', component: FolderDomainIdsComponent },
  { path: 'audit-reports', component: AggregatedAuditReportsComponent },
  { path: 'op-custom-tag-builder', component: OpCustomTagBuilderComponent },
  { path: 'run-entire-folder', component: RunEntireFolderComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
