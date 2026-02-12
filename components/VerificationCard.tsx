'use client';

import { useState, useRef } from "react";
import { ZKPassport } from "@zkpassport/sdk";
import QRCodeDisplay from "./QRCode";
import ResultDisplay from "./ResultDisplay";
import { isItalian } from "../lib/zkpassport";

export default function VerificationCard() {
  const [queryUrl, setQueryUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [nationality, setNationality] = useState<string | undefined>(undefined);
  const [isItalianConfirmed, setIsItalianConfirmed] = useState<boolean | null>(null);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const zkPassportRef = useRef<ZKPassport | null>(null);

  const startVerification = async () => {
    if (requestInProgress) return;
    
    // Reset state
    setQueryUrl("");
    setMessage("");
    setIsVerified(null);
    setNationality(undefined);
    setIsItalianConfirmed(null);
    setRequestInProgress(true);

    try {
      if (!zkPassportRef.current) {
        zkPassportRef.current = new ZKPassport(window.location.hostname);
      }

      const queryBuilder = await zkPassportRef.current.request({
        name: "Italian Passport Verifier 🍕",
        logo: "/logo.svg",
        purpose: "Prove you have Italian nationality to get verified as a real Italian!",
        scope: "italian-passport-verification",
        mode: "fast",
        devMode: process.env.NODE_ENV === "development",
      });

      const {
        url,
        onRequestReceived,
        onGeneratingProof,
        onProofGenerated,
        onResult,
        onReject,
        onError,
      } = queryBuilder
        .disclose("nationality")
        .done();

      setQueryUrl(url);

      onRequestReceived(() => {
        setMessage("📱 Request received! Check your ZKPassport app");
      });

      onGeneratingProof(() => {
        setMessage("🔐 Generating proof... This may take up to 10 seconds");
      });

      const proofs: unknown[] = [];

      onProofGenerated((result: unknown) => {
        proofs.push(result);
        setMessage(`⏳ Proof ${proofs.length} generated...`);
      });

      onResult(({ result, verified, uniqueIdentifier, queryResultErrors }) => {
        const disclosedNationality = result?.nationality?.disclose?.result;
        
        setNationality(disclosedNationality);
        setIsVerified(verified);
        setIsItalianConfirmed(isItalian(disclosedNationality || ""));
        
        // Logic: Check nationality first, verified flag is secondary
        if (disclosedNationality) {
          // We got a nationality result - verification worked!
          if (isItalian(disclosedNationality)) {
            setMessage("🍕 You're Italian!");
          } else {
            setMessage(`Detected: ${disclosedNationality}`);
          }
        } else if (!verified) {
          // No nationality AND verified=false = technical error
          console.error("Verification failed:", queryResultErrors);
          setMessage("❌ Technical error - could not read ID");
        }
        
        setRequestInProgress(false);

        // Debug logging only in development
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
          console.log("Verification result:", {
            nationality: disclosedNationality,
            verified,
            uniqueIdentifier,
            isItalian: isItalian(disclosedNationality || ""),
            proofs: proofs.length,
            errors: queryResultErrors
          });
        }
      });

      onReject(() => {
        setMessage("❌ Request was cancelled");
        setRequestInProgress(false);
      });

      onError((error: unknown) => {
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
          console.error("Verification error:", error);
        }
        setMessage("❌ An error occurred during verification");
        setRequestInProgress(false);
      });

    } catch (error) {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.error("Failed to start verification:", error);
      }
      setMessage("❌ Failed to start verification");
      setRequestInProgress(false);
    }
  };

  const resetVerification = () => {
    setQueryUrl("");
    setMessage("");
    setIsVerified(null);
    setNationality(undefined);
    setIsItalianConfirmed(null);
    setRequestInProgress(false);
  };

  return (
    <div className="verification-card rounded-2xl p-8 max-w-md w-full mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-italian-green"></span>
          {" "}
          Italian Passport Verifier
          {" "}
          <span className="text-italian-red">🍕</span>
        </h1>
        <p className="text-gray-600">
          Prove you have Italian nationality using ZKPassport
        </p>
      </div>

      {!queryUrl && !isVerified && (
        <div className="text-center">
          <button
            onClick={startVerification}
            disabled={requestInProgress}
            className="italian-button text-white font-bold py-4 px-8 rounded-full text-lg w-full"
          >
            {requestInProgress ? "Starting..." : "Verify Italian Nationality"}
          </button>
        </div>
      )}

      {queryUrl && (
        <div className="text-center">
          <QRCodeDisplay value={queryUrl} />
          
          <div className="mt-4 space-y-3">
            <p className="text-sm text-gray-600">
              Scan this QR code with your ZKPassport app
            </p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-4 text-left">
              <div className="flex items-start">
                <span className="text-yellow-600 text-xl mr-2">⚠️</span>
                <div>
                  <p className="text-yellow-800 font-bold text-sm mb-1">
                    IMPORTANT: Use ZKPassport App Only
                  </p>
                  <ul className="text-yellow-700 text-xs space-y-1">
                    <li>• <strong>Open the ZKPassport app first</strong></li>
                    <li>• Tap the scan button (+) inside the app</li>
                    <li>• <strong>Do NOT use your phone's camera</strong> - it may show errors</li>
                    <li>• Scanning from camera can incorrectly report "ID expired"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={resetVerification}
            className="mt-4 text-italian-red hover:underline text-sm"
          >
            Cancel and try again
          </button>
        </div>
      )}

      {message && (
        <div className="text-center mt-6">
          <p className="text-gray-700 font-medium">{message}</p>
        </div>
      )}

      {(nationality || (!requestInProgress && isVerified === false)) && (
        <ResultDisplay
          isVerified={isVerified}
          isItalian={isItalianConfirmed}
          nationality={nationality}
          isLoading={false}
        />
      )}

      {(nationality || isVerified === false) && (
        <div className="text-center mt-6">
          <button
            onClick={resetVerification}
            className="italian-button text-white font-bold py-2 px-6 rounded-full"
          >
            🔃 Verify Again
          </button>
        </div>
      )}
    </div>
  );
}