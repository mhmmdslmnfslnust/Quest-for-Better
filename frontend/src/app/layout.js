import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'HabitQuest - Gamified Wellness Journey',
  description: 'Transform your habits into an exciting adventure. Track progress, earn achievements, and build the life you want.',
  keywords: 'habits, wellness, gamification, productivity, health, fitness',
  authors: [{ name: 'HabitQuest Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
