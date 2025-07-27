import { Component, signal } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UserForm } from './components/user-form/user-form';
import { UserList } from './components/user-form-list/user-form-list';
import { User } from './Models/User';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    UserForm,
    UserList
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('User Manager App');

  selectedUser: User | null = null;

  
  refreshList = signal(false);

  onEditUser(user: User) {
    console.log('Editing user:', user); 
    this.selectedUser = { ...user }; 
  }

  onFormSubmit() {
    this.selectedUser = null;

    
    this.refreshList.update(val => !val);
  }
}
