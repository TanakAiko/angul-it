import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CaptchaService } from '../../services/captcha.service';
import { CaptchaResponse, CaptchaChallenge, CaptchaSubmission } from '../../models/captcha.model';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent implements OnInit {
  captchaData: CaptchaResponse | null = null;
  currentLevel = 1;
  answers: { [key: number]: any } = {};
  selectedImages: { [key: number]: string[] } = {};
  isLoading = false;
  isSubmitting = false;
  results: { [key: number]: boolean | null } = { 1: null, 2: null, 3: null };
  showSuccess = false;
  errorMessage = '';

  constructor(private captchaService: CaptchaService) {}

  ngOnInit() {
    this.loadCaptcha();
  }

  loadCaptcha() {
    this.isLoading = true;
    this.captchaService.getCaptcha().subscribe({
      next: (data) => {
        this.captchaData = data;
        this.isLoading = false;
        this.resetState();
      },
      error: (error) => {
        console.error('Error loading captcha:', error);
        this.isLoading = false;
        this.errorMessage = 'Failed to load captcha. Please try again.';
      }
    });
  }

  resetState() {
    this.currentLevel = 1;
    this.answers = {};
    this.selectedImages = {};
    this.results = { 1: null, 2: null, 3: null };
    this.showSuccess = false;
    this.errorMessage = '';
  }

  getCurrentChallenge(): CaptchaChallenge | null {
    if (!this.captchaData) return null;
    
    switch (this.currentLevel) {
      case 1: return this.captchaData.level1;
      case 2: return this.captchaData.level2;
      case 3: return this.captchaData.level3;
      default: return null;
    }
  }

  onImageSelect(imageId: string) {
    if (!this.selectedImages[this.currentLevel]) {
      this.selectedImages[this.currentLevel] = [];
    }
    
    const selected = this.selectedImages[this.currentLevel];
    const index = selected.indexOf(imageId);
    
    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(imageId);
    }
    
    this.answers[this.currentLevel] = [...selected];
  }

  isImageSelected(imageId: string): boolean {
    return this.selectedImages[this.currentLevel]?.includes(imageId) || false;
  }

  canSubmit(): boolean {
    const challenge = this.getCurrentChallenge();
    if (!challenge) return false;

    switch (challenge.type) {
      case 'image-select':
        return this.selectedImages[this.currentLevel]?.length > 0;
      case 'text':
        return this.answers[this.currentLevel]?.trim().length > 0;
      case 'math':
        return this.answers[this.currentLevel] !== undefined && this.answers[this.currentLevel] !== '';
      default:
        return false;
    }
  }

  submitAnswer() {
    const challenge = this.getCurrentChallenge();
    if (!challenge || !this.canSubmit()) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    let answer = this.answers[this.currentLevel];
    if (challenge.type === 'math') {
      answer = Number(answer);
    }

    const submission: CaptchaSubmission = {
      id: challenge.id,
      level: this.currentLevel,
      answer: answer
    };

    this.captchaService.submitAnswer(submission).subscribe({
      next: (result) => {
        this.results[this.currentLevel] = result.success;
        this.isSubmitting = false;

        if (result.success) {
          if (this.currentLevel < 3) {
            setTimeout(() => {
              this.currentLevel++;
            }, 1000);
          } else {
            this.showSuccess = true;
          }
        } else {
          this.errorMessage = result.message || 'Incorrect answer. Please try again.';
        }
      },
      error: (error) => {
        console.error('Error submitting answer:', error);
        this.isSubmitting = false;
        this.errorMessage = 'Failed to submit answer. Please try again.';
      }
    });
  }

  restart() {
    this.loadCaptcha();
  }

  getProgressPercentage(): number {
    const completedLevels = Object.values(this.results).filter(result => result === true).length;
    return (completedLevels / 3) * 100;
  }
}