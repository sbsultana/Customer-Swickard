import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CancellationRequestFormComponent } from './cancellation-request-form/cancellation-request-form.component';

const routes: Routes = [
  { path: '', component: CancellationRequestFormComponent },
  { path: ':id', component: CancellationRequestFormComponent },
  { path: 's/:id', component: CancellationRequestFormComponent },
  {
    path: '**',redirectTo: '',pathMatch: 'full',
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
