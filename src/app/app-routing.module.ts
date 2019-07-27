import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { BulkEmailComponent } from './bulk-email/bulk-email.component';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';


const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'bulk-email', component: BulkEmailComponent },
  { path: 'manage-profiles', component: ProfileEditorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
