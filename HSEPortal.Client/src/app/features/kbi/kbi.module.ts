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
import { EvacuationStrategyComponent } from './evacuation-strategy/evacuation-strategy.component';
import { ProvisionsEquipmentComponent } from './provisions-equipment/provisions-equipment.component';

const routes = new HseRoutes([
  HseRoute.protected(CheckBeforeStartComponent.route, CheckBeforeStartComponent, CheckBeforeStartComponent.title),
  HseRoute.protected(TaskListComponent.route, TaskListComponent, TaskListComponent.title),
  HseRoute.protected(EvacuationStrategyComponent.route, EvacuationStrategyComponent, EvacuationStrategyComponent.title),
  HseRoute.protected(ProvisionsEquipmentComponent.route, ProvisionsEquipmentComponent, ProvisionsEquipmentComponent.title),
]);

@NgModule({
  declarations: [
    CheckBeforeStartComponent,
    TaskListComponent,
    EvacuationStrategyComponent,
    ProvisionsEquipmentComponent
  ],
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
