import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HseAngularModule } from 'hse-angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { HseRoute, HseRoutes } from 'src/app/services/hse.route';
import { CheckBeforeStartComponent } from './check-before-start/check-before-start.component';
import { TaskListComponent } from './task-list/task-list.component';
import { KbiFireModule } from './1-fire/kbi.fire.module';
import { KbiEnergyModule } from './2-energy/kbi.energy.module';
import { KbiStructureModule } from './3-structure/kbi.structure.module';
import { KbiRoofModule } from './4-roof/kbi.roof.module';
import { KbiStaircasesModule } from './5-staircases/kbi.staircases.module';
import { KbiWallsModule } from './6-walls/kbi.walls.module';
import { KbiBuildingUseModule } from './7-building-use/kbi.building-use.module';
import { KbiConnectionsModule } from './8-connections/kbi.connections.module';
import { KbiSubmitModule } from './9-submit/kbi.submit.module';
import { KbiSectionsComponent } from './sections/kbi.sections.component';
import { KbiCheckAnswersModule } from './check-answers-building-information/kbi.check-answers-building-information.module';


const routes = new HseRoutes([
  HseRoute.protected(CheckBeforeStartComponent.route, CheckBeforeStartComponent, CheckBeforeStartComponent.title),
  HseRoute.protected(TaskListComponent.route, TaskListComponent, TaskListComponent.title),
  HseRoute.forChildren(":section", KbiSectionsComponent, new HseRoutes([
    HseRoute.forLoadChildren(KbiFireModule.baseRoute, () => import('./1-fire/kbi.fire.module').then(m => m.KbiFireModule)),
    HseRoute.forLoadChildren(KbiEnergyModule.baseRoute, () => import('./2-energy/kbi.energy.module').then(m => m.KbiEnergyModule)),
    HseRoute.forLoadChildren(KbiStructureModule.baseRoute, () => import('./3-structure/kbi.structure.module').then(m => m.KbiStructureModule)),
    HseRoute.forLoadChildren(KbiRoofModule.baseRoute, () => import('./4-roof/kbi.roof.module').then(m => m.KbiRoofModule)),
    HseRoute.forLoadChildren(KbiStaircasesModule.baseRoute, () => import('./5-staircases/kbi.staircases.module').then(m => m.KbiStaircasesModule)),
    HseRoute.forLoadChildren(KbiWallsModule.baseRoute, () => import('./6-walls/kbi.walls.module').then(m => m.KbiWallsModule)),
    HseRoute.forLoadChildren(KbiBuildingUseModule.baseRoute, () => import('./7-building-use/kbi.building-use.module').then(m => m.KbiBuildingUseModule)),
    HseRoute.forLoadChildren(KbiCheckAnswersModule.baseRoute, () => import('./check-answers-building-information/kbi.check-answers-building-information.module').then(m => m.KbiCheckAnswersModule)),
  ])),
  HseRoute.forLoadChildren(KbiConnectionsModule.baseRoute, () => import('./8-connections/kbi.connections.module').then(m => m.KbiConnectionsModule)),
  HseRoute.forLoadChildren(KbiSubmitModule.baseRoute, () => import('./9-submit/kbi.submit.module').then(m => m.KbiSubmitModule)),
]);

@NgModule({
  declarations: [
    CheckBeforeStartComponent,
    TaskListComponent,
    KbiSectionsComponent],
  providers: [HttpClient, ...routes.getProviders()],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule,
    ComponentsModule,
    FormsModule,
    PipesModule,
  ]
})
export class KbiModule {
  static baseRoute: string = "kbi";
}
