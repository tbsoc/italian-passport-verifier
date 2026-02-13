import VerificationCard from "../components/VerificationCard";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-6 sm:mb-8 bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-3 sm:mb-4" style={{textShadow: '3px 3px 6px rgba(0,0,0,0.8)'}}>
            Italian Passport Verifier 🍕
          </h1>
          <p className="text-base sm:text-xl text-white font-semibold" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
            Verify your Italian nationality with ZKPassport
          </p>
          <p className="text-sm sm:text-lg text-white mt-2 font-medium" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
            Get verified as a real Italian and receive your pizza emoji! 🍕
          </p>
        </div>

        <VerificationCard />

        <div className="mt-6 sm:mt-8 text-center bg-black/30 backdrop-blur-sm rounded-xl p-3 sm:p-4">
          <p className="mb-2 text-white font-medium text-xs sm:text-base" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
            🛡️ Privacy-preserving verification using zero-knowledge proofs
          </p>
          <p className="text-white font-medium text-xs sm:text-base" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
            🔒 No personal data is stored - only verification results
          </p>
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 inline-flex items-center space-x-2 sm:space-x-4 text-white font-medium text-xs sm:text-sm" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.8)'}}>
            <span>Powered by</span>
            <a 
              href="https://zkpassport.id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-yellow-300 transition-colors underline font-semibold"
            >
              ZKPassport
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}