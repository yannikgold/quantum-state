import { Countdown } from './components/Countdown';
import { QuantumState } from './components/QuantumState';
import { TLSChecker } from './components/TLSChecker';
import { Explainer } from './components/Explainer';
import { ManagementFAQ } from './components/ManagementFAQ';
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-6 mb-8">
        <h1 className="text-4xl font-bold text-center">State of Post-Quantum Security</h1>
        <p className="text-center text-gray-600 mt-2">
          A live, vendor-neutral overview with a TLS self-check.
        </p>
      </header>

      <main className="container mx-auto px-4 max-w-7xl">
        <Countdown />
        <QuantumState />
        <TLSChecker />
        <Explainer />
        <ManagementFAQ />
        
        <footer className="mt-12 mb-8 text-center">
          <a 
            href="mailto:contact@example.com"
            className="text-blue-600 hover:underline mr-4"
          >
            Contact for Consultation
          </a>
          <a 
            href="https://github.com/yourusername/state-of-quantum"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </footer>
      </main>
    </div>
  )
}

export default App
