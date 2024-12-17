import { Component, input } from '@angular/core';
import { Member } from '../../_Models/Member';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-member-table',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './member-table.component.html',
  styleUrl: './member-table.component.css'
})
export class MemberTableComponent {
 member = input.required<Member>();
}
