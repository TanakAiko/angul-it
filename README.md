<div align="center">

# Angul-It - Multi-Stage Captcha System

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)

A sophisticated multi-stage captcha web application built with Angular and Node.js, designed to verify human users through various challenge types including image recognition, text input, and mathematical problems.

![Home Page](imgs/Screenshot%20from%202025-10-16%2000-13-44.png)

</div>

## 🚀 Features

### Core Functionality
- **Multi-Stage Verification**: Three progressive challenge levels
- **Diverse Challenge Types**: Image selection, text input, and math problems
- **State Persistence**: Progress saved across browser sessions
- **Responsive Design**: Optimized for desktop and mobile devices
- **Smooth Animations**: Fluid transitions between challenges
- **Form Validation**: Robust validation for all challenge types

### Challenge Types
1. **Image Recognition**: Select specific objects from image grids
2. **Text Input**: Answer knowledge-based questions
3. **Mathematical**: Solve arithmetic problems

### User Experience
- **Progress Tracking**: Visual progress bar with level indicators
- **Navigation**: Move between completed levels
- **Session Management**: Automatic state saving and restoration
- **Results Dashboard**: Detailed completion statistics
- **Download Results**: Export session data as JSON

## 🏗️ Architecture

### Frontend (Angular 19)
- **Components**: Home, Captcha, Result
- **Services**: CaptchaService, StateService
- **Guards**: CaptchaGuard for route protection
- **State Management**: RxJS-based state management with localStorage persistence
- **Reactive Forms**: Form validation and user input handling

### Backend (Node.js + Express)
- **RESTful API**: Challenge retrieval and answer validation
- **Challenge Management**: JSON-based challenge storage
- **CORS Support**: Cross-origin resource sharing enabled
- **Modular Structure**: Organized route handlers and middleware

## 📁 Project Structure

```
angul-it/
├── frontend/                 # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # UI components
│   │   │   │   ├── home/
│   │   │   │   ├── captcha/
│   │   │   │   └── result/
│   │   │   ├── services/     # Business logic services
│   │   │   ├── guards/       # Route guards
│   │   │   └── models/       # TypeScript interfaces
│   │   └── styles.css        # Global styles
│   └── package.json
├── backend/                  # Node.js API server
│   ├── routes/
│   │   └── captcha.js        # Captcha API endpoints
│   ├── levels/               # Challenge data
│   │   ├── 1.json
│   │   ├── 2.json
│   │   └── 3.json
│   ├── server.mjs            # Express server setup
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Backend Setup
```bash
cd backend
npm install
node server.mjs
```
The backend server will run on `http://localhost:3000`

### Frontend Setup
```bash
cd frontend
npm install
ng serve
```
The frontend application will run on `http://localhost:4200`

## 🎮 Usage

### Starting a Challenge
1. Navigate to the home page
2. Click "Start New Challenge" to begin
3. Complete all three levels sequentially
4. View detailed results upon completion

### Challenge Interface

![Image Selection Challenge](imgs/Screenshot%20from%202025-10-16%2000-14-42.png)
*Example of an image selection challenge where users identify specific objects*

### Challenge Navigation
- **Progress Bar**: Visual indicator of completion status
- **Level Navigation**: Move between completed levels
- **Form Validation**: Real-time validation feedback
- **State Persistence**: Progress automatically saved

### Challenge Types

#### Image Selection
- Select images matching the given criteria
- Multiple selection support
- Visual feedback for selected items
- Validation ensures at least one selection

#### Text Input
- Answer knowledge-based questions
- Case-insensitive validation
- Real-time form validation
- Trim whitespace handling

#### Mathematical Problems
- Solve arithmetic equations
- Numeric input validation
- Integer answer validation
- Clear error messaging

### Completion & Results

![Results Page](imgs/Screenshot%20from%202025-10-16%2000-15-37.png)
*Detailed results dashboard showing session statistics and performance metrics*

## 🔧 API Endpoints

### GET `/api/captcha`
Retrieves a set of challenges for all three levels. Each level randomly selects a challenge from its pool.

**Response Example:**
```json
{
  "level1": {
    "id": 2,
    "type": "text",
    "question": "What is the capital of Senegal?"
  },
  "level2": {
    "id": 2,
    "type": "image-select",
    "question": "Where is Luffy?",
    "images": [
      { "url": "https://...", "id": "img1" },
      { "url": "https://...", "id": "img2" },
      { "url": "https://...", "id": "img3" }
    ]
  },
  "level3": {
    "id": 1,
    "type": "image-select",
    "question": "Select all images with a bus",
    "images": [...]
  }
}
```

> **Note:** Challenge types vary by level. Level 1 includes text and math challenges, Level 2 includes math and image-select challenges, and Level 3 includes various image-select challenges.

### POST `/api/captcha`
Submits an answer for validation.

**Request Examples:**

Text answer:
```json
{
  "id": 2,
  "level": 1,
  "answer": "Dakar"
}
```

Math answer:
```json
{
  "id": 1,
  "level": 2,
  "answer": 42
}
```

Image selection answer:
```json
{
  "id": 2,
  "level": 2,
  "answer": ["img1"]
}
```

**Response:**
```json
{
  "success": true
}
```

Or on error:
```json
{
  "success": false,
  "message": "Answer must be a non-empty string."
}
```

## 🎨 Design Features

### Visual Design
- **Modern UI**: Clean, Apple-inspired design aesthetics
- **Color System**: Comprehensive color palette with gradients
- **Typography**: Optimized font hierarchy and spacing
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first responsive design

### User Experience
- **Accessibility**: WCAG compliant design patterns
- **Loading States**: Clear loading indicators
- **Error Handling**: Comprehensive error messaging
- **Progress Feedback**: Visual progress indicators
- **Session Management**: Seamless state persistence

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
ng test
```

> **Note:** Backend testing is currently not implemented. Contributions are welcome!

## 🔒 Security Features

- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured cross-origin policies
- **State Isolation**: Session-based state management
- **Answer Validation**: Secure server-side answer checking

## 📱 Responsive Design

- **Mobile Optimized**: Touch-friendly interface
- **Tablet Support**: Optimized for medium screens
- **Desktop Enhanced**: Full-featured desktop experience
- **Flexible Layouts**: CSS Grid and Flexbox layouts

## 🙏 Acknowledgments

- Angular team for the excellent framework
- Express.js for the robust backend framework
- Contributors and testers who helped improve the application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">

**⭐ Star this repository if you found it helpful! ⭐**

Made with ❤️ from 🇸🇳

</div>