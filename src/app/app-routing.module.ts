import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ManifestSingleComponent } from './manifestations/manifest/manifest-single.component';
import { ManifestationsSearchComponent } from './manifestations/search/manifestations-search.component';
import { ManifestationsListComponent } from './manifestations/list/manifestations-list.component';
import { ManifestationDetailsComponent } from './manifestations/details/manifestation-details.component';
import { ManifestationsListAllComponent } from './manifestations/list/manifestations-list-all.component';

const routes: Routes = [
  { path: '', redirectTo: '/about', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'register', component: ManifestSingleComponent },
  { path: 'search', component: ManifestationsSearchComponent },
  { path: 'list', component: ManifestationsListComponent },
  { path: 'list-all', component: ManifestationsListAllComponent },
  { path: 'manifestations/:id', component: ManifestationDetailsComponent, runGuardsAndResolvers: 'always' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
