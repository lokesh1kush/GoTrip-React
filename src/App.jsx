import './App.css'
import Header from './header/Header'
import Footer from './footer/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import CreateTrip from './create-trip'
import MyTrip from './my-trip/MyTrip'
import Body from './body/Body'
import Feedback from './feedback'

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Body />} />
              <Route path="/create-trip" element={<CreateTrip />} />
              <Route path="/my-trip" element={<MyTrip />} />
              <Route path="/feedback" element={<Feedback />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ClerkProvider>
  )
}

export default App
