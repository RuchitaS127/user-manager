import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  AsyncValidatorFn,
  ReactiveFormsModule
} from '@angular/forms';
import {
  debounceTime,
  switchMap,
  catchError,
  map,
  of
} from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { UserService } from '../../Services/UserService';
import { User } from '../../Models/User';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.scss']
})
export class UserForm implements OnInit, OnChanges {
  @Input() user: User | null = null;
  @Output() formSubmit = new EventEmitter<User>();

  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.userForm) {
      if (this.user) {
        console.log('Form received user to edit:', this.user);
        this.setFormData(this.user);
      } else {
        this.userForm.reset();
      }
    }
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      username: ['', Validators.required],
      phone: ['', [Validators.pattern(/^\d{10}$/)]],
      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.emailExistsValidator()],
        updateOn: 'blur'
      }]
    });
  }

  private setFormData(user: User): void {
    this.userForm.reset(); 
    this.userForm.patchValue(user);
  }

 submitForm(): void {
  if (this.userForm.invalid) return;

  const { id, name, username, email, phone } = this.userForm.value;

  const userToSubmit: Partial<User> = {
    name,
    username,
    email,
    phone
  };

  if (id) {
    userToSubmit.id = id; 
    this.userService.updateUser(id, userToSubmit as User).subscribe({
      next: () => {
        alert('User updated successfully!');
        this.userForm.reset();
        this.formSubmit.emit();
      },
      error: err => {
        console.error('Update failed:', err.error);
      }
    });
  } else {
    this.userService.addUser(userToSubmit as User).subscribe({
      next: () => {
        alert('User added successfully!');
        this.userForm.reset();
        this.formSubmit.emit();
      },
      error: err => {
        console.error('Add user failed:', err.error);
      }
    });
  }
} 


  emailExistsValidator(): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const email = control.value;
    const currentEmail = this.user?.email;

   
    if (!email || email === currentEmail) {
      return of(null);
    }

    return of(email).pipe(  
      debounceTime(400),
      switchMap(email =>
        this.userService.validateEmail(email).pipe(
          map(message => message ? { emailExists: message } : null),
          catchError(() => of(null))
        )
      )
    );
  };
}

}
