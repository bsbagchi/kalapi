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

export const routes: Routes = [
 
  { path: 'login', component: LoginComponent }, // Route for dashboard
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [  
      {path: '', component:DashboardComponent}, // Default route
      { path: 'agent', component: AgentComponent }, // Default route
      { path: 'transport', component: TransportComponent }, // Default route
      { path: 'quality', component: QualityComponent }, // Default route
      { path: 'colors', component: ColorComponent }, // Default route
      { path: 'colour-master', component: ColormasterComponent }, // Default route
      { path: 'customers', component: CustomersComponent }, // Default route
      { path: 'desgins', component: DesignComponent }, // Default route
      { path: 'printing', component: PrintingComponent }, // Default route
    ],
  },
  { path: '**', redirectTo: '' }, // Wildcard route for undefined paths
];

  