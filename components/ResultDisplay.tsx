'use client';

interface ResultDisplayProps {
  isVerified: boolean | null;
  isItalian: boolean | null;
  nationality?: string;
  isLoading?: boolean;
}

export default function ResultDisplay({ isVerified, isItalian, nationality, isLoading }: ResultDisplayProps) {
  if (isLoading) {
    return (
      <div className="text-center p-4 sm:p-6">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-italian-green mx-auto mb-4"></div>
        <p className="text-base sm:text-lg font-medium text-gray-700">Verifying your Italian heritage...</p>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">This may take up to 10 seconds</p>
      </div>
    );
  }

  if (isVerified === null) {
    return null;
  }

  // Only check nationality - that&apos;s all we care about!
  if (nationality) {
    if (isItalian) {
      // Italian nationality detected
      return (
        <div className="text-center p-4 sm:p-6 pizza-celebration">
          <div className="text-6xl sm:text-8xl mb-4">🍕</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-italian-green mb-2">
            You&apos;re a real Italian!
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-2">
            Authentic verified!
          </p>
          <p className="text-xs sm:text-sm text-gray-600">
            Nationality: {nationality}
          </p>
          <div className="mt-4 text-3xl sm:text-4xl">🎉🍝🍷</div>
        </div>
      );
    } else {
      // Non-Italian nationality detected
      return (
        <div className="text-center p-4 sm:p-6">
          <div className="text-5xl sm:text-6xl mb-4">🤷‍♂️</div>
          <h2 className="text-xl sm:text-2xl font-bold text-italian-red mb-2">
            Sorry, you&apos;re not a real Italian
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-2">
            Nationality detected: {nationality}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">
            Only authentic Italians get the pizza verification 🍕
          </p>
        </div>
      );
    }
  }

  // No nationality = technical error
  return (
    <div className="text-center p-4 sm:p-6">
      <div className="text-5xl sm:text-6xl mb-4">❌</div>
      <h2 className="text-xl sm:text-2xl font-bold text-italian-red mb-2">
        Verification Failed
      </h2>
      <p className="text-base sm:text-lg text-gray-700 mb-2">
        Could not read your ID nationality.
      </p>
      <p className="text-xs sm:text-sm text-gray-600">
        Please try scanning again.
      </p>
    </div>
  );
}