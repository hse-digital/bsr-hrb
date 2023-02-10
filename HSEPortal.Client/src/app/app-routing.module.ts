import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationModule } from './features/application/application.module';
import { LandingComponent } from './features/landing/landing.component';
import { TimeoutComponent } from './features/timeout/timeout.component';
import { HseRoute, HseRoutes } from './services/hse.route';

const routes = new HseRoutes([
  HseRoute.unsafe('', LandingComponent),
  HseRoute.unsafe(TimeoutComponent.route, TimeoutComponent),
  HseRoute.forChildren(ApplicationModule.baseRoute, () => import('./features/application/application.module').then(m => m.ApplicationModule) ),
]);

@NgModule({
  imports: [RouterModule.forRoot(routes.getRoutes(), {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

