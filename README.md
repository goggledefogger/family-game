# Family Treasure Game

![Family Treasure](public/gamelogo.svg)

An engaging interactive family experience that tests your knowledge, patience, and skill. This unique game takes users through an immersive memorable family game show experience that will leave everyone wondering.

## Features

- **Easy Setup**: Simple guided process to get everyone playing quickly
- **Interactive Experience**: Engaging responsive elements
- **Visual Effects**: Custom screens and animations
- **Audio Enhancement**: Epic catchy theme song
- **Surprise Ending**: A finale that brings it all together

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/family-game.git
cd family-game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Audio Setup

For the background music feature:

1. Place your MP3 file in the `/public/audio/` directory
2. Rename it to `theme-song.mp3`
3. If using a different filename, update the `audioSrc` prop in `App.jsx`

The audio player will automatically:
- Loop the audio throughout the entire application
- Provide a mute/unmute button in the bottom right corner
- Handle autoplay restrictions by starting muted if browsers block autoplay

## How to Use

1. Share the application with only those who are ready for a family adventure
2. Encourage patience and persistence
3. Keep going, and enjoy!

## Technology Stack

- React.js
- Vite
- Tailwind CSS
- Lucide React (for icons)

## Development

The application is structured as follows:

- `/src/components`: UI components including various screens
- `/src/data`: Game text, questions, and configuration options
- `/src/styles`: CSS styles and animations
- `/public/audio`: Background music files

## License

MIT License - Feel free to use, modify, and distribute this project for your own family entertainment purposes!
