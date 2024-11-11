import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../pages/model/Category';
import {environment} from "../../environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  addCategory(data: any): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/api/category'/category`, data);
  }

  categories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/api/category'/categories`);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/api/category'/update/category/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/category'/delete/category/${id}`);
  }

  checkCategoryNameExists(name: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/api/category'/exists/${name}`);
  }


  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/api/category'/categories/${id}`);
  }
}
