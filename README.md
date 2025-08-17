
# Educational Reels Platform 

A TikTok-style interface for educational short-form videos with interactive elements and smooth animations.

<img width="1912" height="972" alt="image" src="https://github.com/user-attachments/assets/fb2fbd9e-13b2-4c20-9e8a-3f25b0b2fc6e" />

## Features ✨

- 🎥 Short-form video player optimized for educational content
- ♥️ Interactive engagement features (likes, shares, comments)
- 🔄 Seamless video transitions
- 📝 Dynamic transcriptions display
- 🏷️ Category tagging system
- 📱 Fully responsive mobile-first design
- 🎨 Beautiful animations and visual effects
- ⚡ Optimized performance with React memoization

## Tech Stack 🛠️

**Frontend:**
- React 18 with Hooks
- Styled Components
- Lucide React Icons
- YouTube IFrame API

**API:**
- JSONBin.io for video metadata storage

## Installation 💻

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/educational-reels.git
   cd educational-reels
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   REACT_APP_VIDEO_API_URL=https://api.jsonbin.io/v3/b/YOUR_VIDEO_BIN_ID
   REACT_APP_TRANSCRIPTION_API_URL=https://api.jsonbin.io/v3/b/YOUR_TRANSCRIPTION_BIN_ID
   REACT_APP_JSONBIN_API_KEY=your-jsonbin-api-key
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Project Structure 📂

```
src/
├── components/
│   ├── Reel.jsx/               # Main reel component
│   ├── VideoPlayer.jsz/        # Video player with controls
│   └── Reelspage.jsx/            #  Main page container
├── App.js
└── index.js
```

## API Data Format 📊

**Videos API Response:**
```json
[
  {
    "id": "video1",
    "url": "https://youtube.com/watch?v=abc123",
    "title": "Introduction to React Hooks",
    "creatorName": "Code Mentor",
    "creatorPicture": "https://.../avatar.jpg",
    "category": "Programming",
    "subcategory": "React",
    "skillLabel": "Beginner"
  }
]
```

**Transcriptions API Response:**
```json
{
  "Programming": [
    "Learn how React Hooks simplify state management",
    "Hooks allow you to use state without classes"
  ],
  "Science": [
    "The mitochondria is the powerhouse of the cell",
    "Quantum physics explains particle behavior"
  ]
}
```

## Customization 🎨

**Theming:**
Modify colors in `src/styles/theme.js`:
```js
export const theme = {
  primary: '#00ADB5',
  secondary: '#FF2E63',
  dark: '#121212',
  light: '#EEEEEE',
  // Add your custom colors
};
````

## Performance Optimizations ⚡

- React.memo for component memoization
- useCallback for stable function references
- useMemo for expensive computations
- Lazy loading components
- Optimized re-renders


## How to Run:
cd youverse-reels
```bash
cd youverse-reels
npm run dev
````
