# Family Treasure Game

![Family Treasure](public/gamelogo.svg)

A deceptively fun April Fools' application that provides the ultimate "is this working?" experience. This interactive experience takes users through a series of fake loading screens, configuration options, and error messages, all leading up to a hilarious prank reveal.

## Features

- **Engaging User Journey**: Step through a fake game setup process with realistic loading screens and configuration dialogs
- **Dynamic Interactions**: Experience a variety of confirmation dialogs, moving buttons, and surprising interface elements
- **Specialized Loading Screens**: Enjoy multiple themed loading screens including Matrix-style binary rain, system crash effects, and corrupted data simulations
- **Atmospheric Background Music**: Looping theme song with mute/unmute controls enhances the immersive experience
- **Grand Finale**: Build anticipation with a dramatic grand finale sequence before the big reveal
- **April Fools' Reveal**: End with a satisfying "gotcha" moment to share the joke with friends

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

1. Share the application with friends or family, telling them it's a fun family quiz game that will test their knowledge
2. Watch as they follow through the lengthy setup process, dealing with ridiculous confirmations and loading screens
3. Enjoy the moment of realization when they discover it's all an April Fools' joke!

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

## Credits

Created as a fun April Fools' Day project to bring laughter and confusion to friends and family everywhere.

## License

MIT License - Feel free to use, modify, and distribute this project for your own April Fools' pranks!
