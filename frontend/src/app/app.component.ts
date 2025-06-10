import { Component } from '@angular/core';
import { CaptchaComponent } from './components/captcha/captcha.component';

@Component({
  selector: 'app-root',
  imports: [CaptchaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Captcha System';
}