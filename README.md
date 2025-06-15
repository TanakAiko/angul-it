# Angul-It - Multi-Stage Captcha System

A sophisticated multi-stage captcha web application built with Angular and Node.js, designed to verify human users through various challenge types including image recognition, text input, and mathematical problems.

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
npm start
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

## 🔧 API Endpoints

### GET `/api/captcha`
Retrieves a set of challenges for all three levels.

**Response:**
```json
{
  "level1": {
    "id": 1,
    "type": "text",
    "question": "What is the capital of Japan?"
  },
  "level2": {
    "id": 1,
    "type": "image-select",
    "question": "Select all images with a bus",
    "images": [...]
  },
  "level3": {
    "id": 1,
    "type": "text",
    "question": "What is the capital of Senegal?"
  }
}
```

### POST `/api/captcha`
Submits an answer for validation.

**Request:**
```json
{
  "id": 1,
  "level": 1,
  "answer": "Tokyo"
}
```

**Response:**
```json
{
  "success": true
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

### Backend Testing
```bash
cd backend
npm test
```

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

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
ng build --prod
```

### Backend Deployment
```bash
cd backend
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Angular team for the excellent framework
- Express.js for the robust backend framework
- Contributors and testers who helped improve the application

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using Angular 19 and Node.js**