import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CaptchaChallenge } from '../models/captcha.model';

export interface CaptchaState {
    challenges: { [key: number]: CaptchaChallenge };
    currentLevel: number;
    answers: { [key: number]: any };
    results: { [key: number]: boolean | null };
    isCompleted: boolean;
    sessionId: string;
    startTime: Date;
    completionTime?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class StateService {
    private readonly STORAGE_KEY = 'angul-it-captcha-state';
    private stateSubject = new BehaviorSubject<CaptchaState>(this.getInitialState());

    constructor() {
        this.loadStateFromStorage();
    }

    get state$(): Observable<CaptchaState> {
        return this.stateSubject.asObservable();
    }

    get currentState(): CaptchaState {
        return this.stateSubject.value;
    }

    private getInitialState(): CaptchaState {
        return {
            challenges: {},
            currentLevel: 1,
            answers: {},
            results: { 1: null, 2: null, 3: null },
            isCompleted: false,
            sessionId: this.generateSessionId(),
            startTime: new Date()
        };
    }

    private generateSessionId(): string {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    setChallenges(challenges: { [key: number]: CaptchaChallenge }) {
        const newState = {
            ...this.currentState,
            challenges,
            startTime: new Date(),
            sessionId: this.generateSessionId()
        };
        this.updateState(newState);
    }

    setCurrentLevel(level: number) {
        const newState = {
            ...this.currentState,
            currentLevel: level
        };
        this.updateState(newState);
    }

    setAnswer(level: number, answer: any) {
        const newState = {
            ...this.currentState,
            answers: {
                ...this.currentState.answers,
                [level]: answer
            }
        };
        this.updateState(newState);
    }

    setResult(level: number, result: boolean) {
        const results = {
            ...this.currentState.results,
            [level]: result
        };

        const isCompleted = Object.values(results).every(r => r === true);

        const newState = {
            ...this.currentState,
            results,
            isCompleted,
            completionTime: isCompleted ? new Date() : undefined
        };
        this.updateState(newState);
    }

    resetState() {
        const newState = this.getInitialState();
        this.updateState(newState);
    }

    canAccessResults(): boolean {
        return this.currentState.isCompleted;
    }

    getCompletionTime(): number | null {
        if (!this.currentState.startTime || !this.currentState.completionTime) {
            return null;
        }
        return this.currentState.completionTime.getTime() - this.currentState.startTime.getTime();
    }

    private updateState(newState: CaptchaState) {        
        this.stateSubject.next(newState);
        this.saveStateToStorage(newState);
    }

    private saveStateToStorage(state: CaptchaState) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
                ...state,
                startTime: state.startTime.toISOString(),
                completionTime: state.completionTime?.toISOString()
            }));            
        } catch (error) {
            console.error('Failed to save state to localStorage:', error);
        }
    }

    private loadStateFromStorage() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const parsedState = JSON.parse(stored);
                const state: CaptchaState = {
                    ...parsedState,
                    startTime: new Date(parsedState.startTime),
                    completionTime: parsedState.completionTime ? new Date(parsedState.completionTime) : undefined
                };
                this.stateSubject.next(state);
            }
        } catch (error) {
            console.error('Failed to load state from localStorage:', error);
            this.resetState();
        }
    }
}