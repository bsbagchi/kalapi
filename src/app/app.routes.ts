import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { AgentComponent } from './components/home/agent/agent.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { TransportComponent } from './components/home/transport/transport.component';
import { QualityComponent } from './components/home/quality/quality.component';
import { ColorComponent } from './components/home/colors/colors.component';
import { ColormasterComponent } from './components/home/colormaster/colormaster.component';
import { CustomersComponent } from './components/home/customers/customers.component';
import { DesignComponent } from './components/home/designs/designs.component';
import { PrintingComponent } from './components/home/printing/printing.component';
import { UserProfileComponent } from './components/home/user-profile/user-profile.component';
import { RouterModule } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AgentHomeComponent } from './components/home/agent/home/agenthome.component';
import { AgentAddComponent } from './components/home/agent/add/add.component';
import { TransportAddComponent } from './components/home/transport/add/add.component';
import { TransportHomeComponent } from './components/home/transport/home/transporthome.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [  
      {path: '', component: DashboardComponent},
      { 
        path: 'agent', 
        component: AgentComponent,
        children: [
          { path: '', component: AgentHomeComponent },
          { path: 'add', component: AgentAddComponent }
        ]
      },
      { path: 'transport', component: TransportComponent,
        children: [
          { path: '', component: TransportHomeComponent },
          { path: 'add', component: TransportAddComponent }
        ]
       },
      { path: 'quality', component: QualityComponent },
      { path: 'colors', component: ColorComponent },
      { path: 'colour-master', component: ColormasterComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'designs', component: DesignComponent },
      { path: 'printing', component: PrintingComponent },
      { path: 'user-profile', component: UserProfileComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' },
];

export const appConfig = {
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
};

  