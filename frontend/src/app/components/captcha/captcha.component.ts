import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CaptchaService } from '../../services/captcha.service';
import { StateService } from '../../services/state.service';
import { CaptchaChallenge, CaptchaSubmission } from '../../models/captcha.model';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  captchaForm: FormGroup;
  currentChallenge: CaptchaChallenge | null = null;
  selectedImages: string[] = [];
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  showLevelTransition = false;

  // State from service
  currentLevel = 1;
  results: { [key: number]: boolean | null } = {};
  challenges: { [key: number]: CaptchaChallenge } = {};

  constructor(
    private captchaService: CaptchaService,
    private stateService: StateService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Initialize the form with validation
    this.captchaForm = this.fb.group({
      textAnswer: ['', [Validators.required, Validators.minLength(1)]],
      mathAnswer: ['', [Validators.required, Validators.pattern(/^\d+$/)]]
    });
  }

  ngOnInit() {
    this.captchaForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((input: any) => {
        const value = this.currentChallenge?.type === 'text' ? input.textAnswer?.trim() : input.mathAnswer;
        if (value === null || value === undefined) {
          return;
        }
        this.stateService.setAnswer(this.currentLevel, value);
      });

    // Subscribe to state changes
    this.stateService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.currentLevel = state.currentLevel;
        this.results = state.results;
        this.challenges = state.challenges;
        this.updateCurrentChallenge();
        this.updateSelectedImages();
      });

    // Load captcha if not already loaded
    if (Object.keys(this.challenges).length === 0) {
      this.loadCaptcha();
    } else {
      this.updateCurrentChallenge();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCaptcha() {
    this.isLoading = true;
    this.errorMessage = '';

    this.captchaService.getCaptcha().subscribe({
      next: (data) => {
        const challenges: { [key: number]: CaptchaChallenge } = {
          1: data.level1,
          2: data.level2,
          3: data.level3
        };

        // Shuffle images if the challenge type is 'image-select'
        for (const level in challenges) {
          const challenge = challenges[level];
          if (challenge.type === 'image-select' && Array.isArray(challenge.images)) {
            challenge.images = this.shuffleArray(challenge.images);
          }
        }

        this.stateService.setChallenges(challenges);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading captcha:', error);
        this.isLoading = false;
        this.errorMessage = 'Failed to load captcha. Please try again.';
      }
    });
  }

  updateCurrentChallenge() {
    this.currentChallenge = this.challenges[this.currentLevel] || null;
    if (this.results[this.currentLevel]) {
      this.resetForm();
    }
  }

  updateSelectedImages() {
    const currentAnswer = this.stateService.currentState.answers[this.currentLevel];
    if (Array.isArray(currentAnswer)) {
      this.selectedImages = [...currentAnswer];
    } else {
      this.selectedImages = [];
    }
  }

  resetForm() {
    this.captchaForm.reset();
    this.selectedImages = [];
    this.errorMessage = '';
  }

  onImageSelect(imageId: string) {
    const index = this.selectedImages.indexOf(imageId);

    if (index > -1) {
      this.selectedImages.splice(index, 1);
    } else {
      this.selectedImages.push(imageId);
    }

    this.stateService.setAnswer(this.currentLevel, [...this.selectedImages]);
  }

  isImageSelected(imageId: string): boolean {
    return this.selectedImages.includes(imageId);
  }

  // onTextAnswerChange(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   const value = input.value.trim();
  //   console.log('-----------------------------> Current input:', value);
  //   this.stateService.setAnswer(this.currentLevel, value);
  // }

  // onMathAnswerChange(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   const value = input.value.trim();
  //   console.log('-----------------------------> Current input:', value);
  //   const numValue = value ? parseInt(value, 10) : undefined;
  //   this.stateService.setAnswer(this.currentLevel, numValue);
  // }

  canSubmit(): boolean {
    // console.log('Checking 0');

    if (!this.currentChallenge) return false;

    // console.log('Checking 1');

    const currentAnswer = this.stateService.currentState.answers[this.currentLevel];

    // console.log('Checking 2', this.currentChallenge.type, currentAnswer);

    switch (this.currentChallenge.type) {
      case 'image-select':
        return this.selectedImages.length > 0;
      case 'text':
        return currentAnswer && currentAnswer.trim().length > 0;
      case 'math':
        return currentAnswer !== undefined && currentAnswer !== '';
      default:
        return false;
    }
  }

  submitAnswer() {
    if (!this.currentChallenge || !this.canSubmit()) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    const currentAnswer = this.stateService.currentState.answers[this.currentLevel];

    const submission: CaptchaSubmission = {
      id: this.currentChallenge.id,
      level: this.currentLevel,
      answer: currentAnswer
    };

    this.captchaService.submitAnswer(submission).subscribe({
      next: (result) => {
        this.stateService.setResult(this.currentLevel, result.success);
        this.isSubmitting = false;

        if (result.success) {
          if (this.currentLevel < 3) {
            this.showLevelTransition = true;
            setTimeout(() => {
              this.stateService.setCurrentLevel(this.currentLevel + 1);
              this.showLevelTransition = false;
            }, 1500);
          } else {
            // All levels completed
            setTimeout(() => {
              this.router.navigate(['/result']);
            }, 2000);
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

  goToPreviousLevel() {
    if (this.currentLevel > 1) {
      this.stateService.setCurrentLevel(this.currentLevel - 1);
    }
  }

  canGoToPreviousLevel(): boolean {
    return this.currentLevel > 1;
  }

  goToNextLevel() {
    this.stateService.setCurrentLevel(this.currentLevel + 1);
  }

  canGoToNextLevel(): boolean {
    return this.results[this.currentLevel] === true && this.currentLevel < 3;
  }

  restart() {
    this.stateService.resetState();
    this.loadCaptcha();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  getProgressPercentage(): number {
    const completedLevels = Object.values(this.results).filter(result => result === true).length;
    return (completedLevels / 3) * 100;
  }

  getFormControl(controlName: string) {
    return this.captchaForm.get(controlName);
  }

  isFormControlInvalid(controlName: string): boolean {
    const control = this.getFormControl(controlName);
    return !!(control && control.invalid && (control.dirty));
  }

  private shuffleArray<T>(array: T[]): T[] {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
}