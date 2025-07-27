import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { UserService } from '../../Services/UserService';
import { User } from '../../Models/User';

@Component({
  selector: 'app-user-form-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './user-form-list.html',
  styleUrls: ['./user-form-list.scss']
})
export class UserList implements OnInit, OnChanges {
  @Input() refresh: boolean = false;
  @Output() editUser = new EventEmitter<User>();

  users: User[] = [];
  showDeleted = false;

  displayedColumns: string[] = ['name', 'email', 'username', 'phone', 'actions'];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refresh'] && !changes['refresh'].firstChange) {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    if (this.showDeleted) {
      this.userService.getDeletedUsers().subscribe({
        next: data => {
          this.users = data;
          console.log('Deleted users loaded:', data);
        },
        error: err => console.error('Failed to load deleted users:', err)
      });
    } else {
      this.userService.getUsers().subscribe({
        next: data => {
          this.users = data;
          console.log('Active users loaded:', data);
        },
        error: err => console.error('Failed to load users:', err)
      });
    }
  }

  toggleDeleted(): void {
    this.showDeleted = !this.showDeleted;
    this.loadUsers();
  }

  onEdit(user: User): void {
    this.editUser.emit({ ...user });
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.softDeleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: err => console.error('Failed to delete user:', err)
      });
    }
  }

  restoreUser(id: number): void {
    if (confirm('Are you sure you want to restore this user?')) {
      this.userService.restoreUser(id).subscribe({
        next: () => this.loadUsers(),
        error: err => console.error('Failed to restore user:', err)
      });
    }
  }
}
