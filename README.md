# Anime Watchlist

![Anime Watchlist](https://raw.githubusercontent.com/Greycode009/anime-list/main/public/logo192.png)

A modern web application to track, rate, and organize your favorite anime series with an elegant UI and robust features.

## Features

- **Anime Collection Management**: Add, edit, and delete anime entries
- **Rating System**: Rate your anime on a scale of 0-10
- **Tier Ranking**: Organize anime into S, A, B, C, D tiers, or leave them unranked
- **Watch Status Tracking**: Track anime as Watchlist, Completed, Abandoned, or Dropped
- **Image Integration**: Upload custom images or use automatic image search via Jikan API
- **Dark & Light Themes**: Full theme support with polished UI in both modes
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing
- **Drag & Drop**: Easily organize your anime between tiers
- **Search & Filter**: Find anime by title, status, or rating

## Tech Stack

- **Frontend**: React 19
- **Styling**: TailwindCSS 3.3
- **Animations**: Framer Motion 12
- **State Management**: React Context API
- **API Integration**: Jikan API (Anime data)
- **Image Handling**: Browser File API + URL Object API

## Screenshots

*Place screenshots here in the future*

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Greycode009/anime-list.git
   cd anime-list
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser

## Project Structure

```
src/
├── components/           # UI Components
│   ├── AnimeCard.jsx     # Card display for anime entries
│   ├── AnimeForm.jsx     # Form for adding/editing anime
│   ├── AnimeList.jsx     # List view of anime entries
│   ├── AnimeListRow.jsx  # Row component for list view
│   ├── Footer.jsx        # Application footer
│   ├── Navbar.jsx        # Navigation bar
│   ├── Navigation.jsx    # Navigation controls
│   └── RankingPage.jsx   # Tier-based ranking view
├── context/              # State management
│   ├── AnimeContext.jsx  # Anime data context provider
│   └── ThemeContext.jsx  # Theme (dark/light) context
├── App.js                # Main application component
└── index.js              # Application entry point
```

## Usage

1. **Adding Anime**: Click "Add New Anime" button and enter details
2. **Rating Anime**: Use the slider to set a rating from 0-10
3. **Ranking Anime**: Assign a tier (S/A/B/C/D) for each anime
4. **View Modes**: Switch between List and Ranking views
5. **Dark Mode**: Toggle between light and dark themes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Legal Documentation

Anime Watchlist includes the following legal documents:

- [Privacy Policy](/public/docs/privacy-policy.html) - Details how we collect, use, and protect user data
- [Terms of Service](/public/docs/terms-of-service.html) - Outlines the rules and guidelines for using our application

These documents are designed to protect both users and the application developers.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

GitHub: [Greycode009](https://github.com/Greycode009)  
X: [@dipeshmalla29](https://x.com/dipeshmalla29)

## Acknowledgments

- [Jikan API](https://jikan.moe/) for anime data
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Create React App](https://create-react-app.dev/) for project bootstrapping

---

© 2025 Anime Watchlist. All rights reserved.
