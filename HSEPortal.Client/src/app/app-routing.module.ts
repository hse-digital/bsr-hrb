import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './building-registration/start/start.component';

const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'start', component: StartComponent },
  { path: 'building-registration', loadChildren: () => import('./building-registration/building-registration.module').then(m => m.BuildingRegistrationModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
