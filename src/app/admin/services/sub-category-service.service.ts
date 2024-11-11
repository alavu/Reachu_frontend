import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subcategory } from '../pages/model/Category';
import {environment} from "../../environment";

const BASIC_URL = environment.apiBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

  constructor(private http: HttpClient) { }

  // Create subcategory
  createSubcategory(subcategory: Partial<Subcategory>, categoryId: number): Observable<Subcategory> {
    return this.http.post<Subcategory>(`${BASIC_URL}/api/admin/subcategory/${categoryId}`, subcategory);
  }
  // Get all subcategories by category ID
  getSubCategoriesByCategoryId(categoryId: number): Observable<any> {
    return this.http.get(`${BASIC_URL}/api/admin/subcategories/${categoryId}`);
  }

  // Update subcategory
  updateSubCategory(id: number, subCategory: any): Observable<any> {
    return this.http.put(`${BASIC_URL}/api/admin/subcategories/${id}`, subCategory);
  }

  // Delete subcategory
  deleteSubCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${BASIC_URL}/api/admin/subcategories/${id}`);
  }

    // Method to check if sub category name exists
checkSubCategoryNameExists(name: string): Observable<boolean> {
  return this.http.get<boolean>(`${BASIC_URL}/api/admin/subcategory/exists/${name}`);
}
}
