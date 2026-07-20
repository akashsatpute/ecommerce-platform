import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyOutComponent } from './buy-out.component';
import { provideRouter } from '@angular/router';

describe('BuyOutComponent', () => {
  let component: BuyOutComponent;
  let fixture: ComponentFixture<BuyOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyOutComponent],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
