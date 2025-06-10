import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CaptchaResponse, CaptchaSubmission, CaptchaResult } from '../models/captcha.model';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getCaptcha(): Observable<CaptchaResponse> {
    return this.http.get<CaptchaResponse>(`${this.apiUrl}/captcha`);
  }

  submitAnswer(submission: CaptchaSubmission): Observable<CaptchaResult> {
    return this.http.post<CaptchaResult>(`${this.apiUrl}/captcha`, submission);
  }
}