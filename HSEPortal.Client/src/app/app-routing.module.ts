import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationModule } from './features/application/application.module';
import { LandingComponent } from './features/landing/landing.component';
import { TimeoutComponent } from './features/timeout/timeout.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: TimeoutComponent.route, component: TimeoutComponent},
  { path: ApplicationModule.baseRoute, loadChildren: () => import('./features/application/application.module').then(m => m.ApplicationModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
