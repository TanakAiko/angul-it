import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(
    private router: Router,
    private stateService: StateService
  ) {}

  startCaptcha() {
    this.stateService.resetState();
    this.router.navigate(['/captcha']);
  }

  continueCaptcha() {
    this.router.navigate(['/captcha']);
  }

  viewResults() {
    if (this.stateService.canAccessResults()) {
      this.router.navigate(['/result']);
    }
  }

  get hasInProgressSession(): boolean {
    const state = this.stateService.currentState;
    return Object.keys(state.challenges).length > 0 && !state.isCompleted;
  }

  get hasCompletedSession(): boolean {
    return this.stateService.canAccessResults();
  }
}