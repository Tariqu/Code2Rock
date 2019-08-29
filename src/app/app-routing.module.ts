import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterComponent } from './master/master.component';


const routes: Routes = [
  { path: "", redirectTo: "IDE", pathMatch: "full" },
  { path: "IDE", component: MasterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
