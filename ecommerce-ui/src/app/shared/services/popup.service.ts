import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type PopupType = 'login' | 'signup' | null;

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private popupSubject = new BehaviorSubject<PopupType>(null);

  popup$ = this.popupSubject.asObservable();

  open(type: PopupType) {
    this.popupSubject.next(type);
  }

  close() {
    this.popupSubject.next(null);
  }

}