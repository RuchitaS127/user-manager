import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../Models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:5001/api/users';

  constructor(private http: HttpClient) {}

  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  
getDeletedUsers(): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl}/deleted`);
}


softDeleteUser(id: number): Observable<void> {
  return this.http.patch<void>(`${this.apiUrl}/softdelete/${id}`, {});
}


restoreUser(id: number): Observable<void> {
  return this.http.patch<void>(`${this.apiUrl}/restore/${id}`, {});
}


  
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  
  updateUser(id: number, user: User): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, user);
  }

  
  validateEmail(email: string): Observable<string> {
    const params = new HttpParams().set('email', email);
    return this.http.get(`${this.apiUrl}/validateuser`, {
      params,
      responseType: 'text'
    });
  }
}
