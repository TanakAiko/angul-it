export interface CaptchaImage {
  url: string;
  id: string;
}

export interface CaptchaChallenge {
  id: number;
  type: 'image-select' | 'text' | 'math';
  question: string;
  images?: CaptchaImage[];
}

export interface CaptchaResponse {
  level1: CaptchaChallenge;
  level2: CaptchaChallenge;
  level3: CaptchaChallenge;
}

export interface CaptchaSubmission {
  id: number;
  level: number;
  answer: string | number | string[];
}

export interface CaptchaResult {
  success: boolean;
  message?: string;
}