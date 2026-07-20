import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './product-section.model';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  constructor(private http: HttpClient) {}

  getProducts(file: string): Observable<Product[]> {
    return this.http.get<Product[]>(file);
  }
}
