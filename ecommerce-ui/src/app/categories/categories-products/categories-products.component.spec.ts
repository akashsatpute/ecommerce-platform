import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { CategoriesProductsComponent } from './categories-products.component';

describe('CategoriesProductsComponent', () => {
  let component: CategoriesProductsComponent;
  let fixture: ComponentFixture<CategoriesProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesProductsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ categoryName: 'mobiles-laptops' }))
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
