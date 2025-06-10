import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  sessionId = '';
  completionTime = 0;
  totalChallenges = 3;
  completedChallenges = 0;
  results: { [key: number]: boolean | null } = {};
  challenges: { [key: number]: any } = {};
  answers: { [key: number]: any } = {};
  startTime?: Date;
  endTime?: Date;

  constructor(
    private stateService: StateService,
    private router: Router
  ) {}

  ngOnInit() {
    const state = this.stateService.currentState;
    
    if (!state.isCompleted) {
      this.router.navigate(['/captcha']);
      return;
    }

    this.sessionId = state.sessionId;
    this.results = state.results;
    this.challenges = state.challenges;
    this.answers = state.answers;
    this.startTime = state.startTime;
    this.endTime = state.completionTime;
    this.completedChallenges = Object.values(this.results).filter(r => r === true).length;
    this.completionTime = this.stateService.getCompletionTime() || 0;
  }

  getCompletionTimeFormatted(): string {
    if (this.completionTime === 0) return 'N/A';
    
    const seconds = Math.floor(this.completionTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  }

  getSuccessRate(): number {
    return (this.completedChallenges / this.totalChallenges) * 100;
  }

  getChallengeTypeDisplay(type: string): string {
    switch (type) {
      case 'image-select': return 'Image Recognition';
      case 'text': return 'Text Input';
      case 'math': return 'Mathematical';
      default: return type;
    }
  }

  getAnswerDisplay(level: number): string {
    const answer = this.answers[level];
    const challenge = this.challenges[level];
    
    if (!answer || !challenge) return 'No answer';
    
    switch (challenge.type) {
      case 'image-select':
        return Array.isArray(answer) ? `${answer.length} image(s) selected` : 'No images selected';
      case 'text':
        return answer.toString();
      case 'math':
        return answer.toString();
      default:
        return answer.toString();
    }
  }

  startNewChallenge() {
    this.stateService.resetState();
    this.router.navigate(['/captcha']);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  downloadResults() {
    const results = {
      sessionId: this.sessionId,
      completionTime: this.getCompletionTimeFormatted(),
      successRate: this.getSuccessRate(),
      startTime: this.startTime?.toISOString(),
      endTime: this.endTime?.toISOString(),
      challenges: Object.keys(this.challenges).map(level => ({
        level: parseInt(level),
        type: this.getChallengeTypeDisplay(this.challenges[parseInt(level)].type),
        question: this.challenges[parseInt(level)].question,
        answer: this.getAnswerDisplay(parseInt(level)),
        result: this.results[parseInt(level)] ? 'Correct' : 'Incorrect'
      }))
    };

    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `captcha-results-${this.sessionId}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
}