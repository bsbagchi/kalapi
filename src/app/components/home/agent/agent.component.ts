import { Component } from '@angular/core';


@Component({
  selector: 'app-agent', // Correct selector for the Dashboard component
  standalone: true, // Marks this component as standalone
  templateUrl: './agent.component.html', // Points to the correct HTML file
})
export class AgentComponent {
  title = 'Agent'; // A title property for display or logic
}
