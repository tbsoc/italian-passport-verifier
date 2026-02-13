'use client';

import { useState, useRef, useEffect } from "react";
import { ZKPassport } from "@zkpassport/sdk";
import QRCodeDisplay from "./QRCode";
import ResultDisplay from "./ResultDisplay";
import { isItalian } from "../lib/zkpassport";
import { useDeviceDetection } from "../lib/useDeviceDetection";

export default function VerificationCard() {
  const [queryUrl, setQueryUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [nationality, setNationality] = useState<string | undefined>(undefined);
  const [isItalianConfirmed, setIsItalianConfirmed] = useState<boolean | null>(null);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQrFallback, setShowQrFallback] = useState(false);
  const zkPassportRef = useRef<ZKPassport | null>(null);

  const { isMobile } = useDeviceDetection();

  const resetVerification = () => {
    setQueryUrl("");
    setMessage("");
    setIsVerified(null);
    setNationality(undefined);
    setIsItalianConfirmed(null);
    setRequestInProgress(false);
    setCopied(false);
    setShowQrFallback(false);
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const startVerification = async () => {
    if (requestInProgress) return;

    resetVerification();
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

      // Store URL - do NOT auto-open the app, let user tap the button
      setQueryUrl(url);

      onRequestReceived(() => {
        setMessage("📱 Request received! Generating proof...");
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

        if (disclosedNationality) {
          if (isItalian(disclosedNationality)) {
            setMessage("🍕 Verification complete!");
          } else {
            setMessage(`Nationality detected: ${disclosedNationality}`);
          }
        } else if (!verified) {
          console.error("Verification failed:", queryResultErrors);
          setMessage("❌ Technical error - could not read ID");
        }

        setRequestInProgress(false);

        if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
          console.log("Verification result:", {
            nationality: disclosedNationality,
            verified,
            uniqueIdentifier,
            isItalian: isItalian(disclosedNationality || ""),
            proofs: proofs.length,
            errors: queryResultErrors,
          });
        }
      });

      onReject(() => {
        setMessage("❌ Request was cancelled");
        setRequestInProgress(false);
      });

      onError((error: unknown) => {
        if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
          console.error("Verification error:", error);
        }
        setMessage("❌ An error occurred during verification");
        setRequestInProgress(false);
      });
    } catch (error) {
      if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
        console.error("Failed to start verification:", error);
      }
      setMessage("❌ Failed to start verification");
      setRequestInProgress(false);
    }
  };

  // Auto-show QR fallback on mobile after 5 seconds if no response
  useEffect(() => {
    if (isMobile && queryUrl && requestInProgress && !showQrFallback) {
      const timer = setTimeout(() => {
        setShowQrFallback(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, queryUrl, requestInProgress, showQrFallback]);

  const hasResult = nationality || isVerified === false;

  return (
    <div className="verification-card rounded-2xl p-5 sm:p-8 max-w-md w-full mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Italian Passport Verifier
          {" "}
          <span className="text-italian-red">🍕</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Prove you have Italian nationality using ZKPassport
        </p>
      </div>

      {/* Start Button */}
      {!queryUrl && !hasResult && (
        <div className="text-center">
          <button
            onClick={startVerification}
            disabled={requestInProgress}
            className="italian-button text-white font-bold py-4 px-8 rounded-full text-base sm:text-lg w-full min-h-[48px] active:scale-95 transition-transform"
          >
            {requestInProgress ? "Starting..." : "Verify Italian Nationality"}
          </button>
        </div>
      )}

      {/* Verification In Progress */}
      {queryUrl && !hasResult && (
        <div className="text-center space-y-4">

          {/* MOBILE: Action buttons */}
          {isMobile && (
            <div className="space-y-3">
              {/* Use the URL directly as an <a> link - the SDK URL already redirects to ZKPassport app */}
              <a
                href={queryUrl}
                className="block w-full bg-italian-green text-white font-bold py-4 px-6 rounded-xl text-base min-h-[48px] active:scale-95 transition-transform text-center"
              >
                Open in ZKPassport App
              </a>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
                <p className="text-blue-800 text-xs">
                  After completing verification in the ZKPassport app, <strong>come back to this page</strong> to see your result. It will update automatically.
                </p>
              </div>

              <button
                onClick={() => handleCopy(queryUrl)}
                className="w-full bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-xl text-sm min-h-[48px] active:scale-95 transition-transform"
              >
                {copied ? "✅ Link Copied!" : "📋 Copy Verification Link"}
              </button>

              {/* QR Code fallback on mobile */}
              {showQrFallback && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-3">
                    Or scan from another device:
                  </p>
                  <QRCodeDisplay value={queryUrl} size={180} />
                </div>
              )}

              {!showQrFallback && (
                <button
                  onClick={() => setShowQrFallback(true)}
                  className="text-gray-500 text-xs underline mt-2"
                >
                  Show QR code instead
                </button>
              )}
            </div>
          )}

          {/* DESKTOP: QR Code */}
          {!isMobile && (
            <div>
              <QRCodeDisplay value={queryUrl} />

              <div className="mt-4 space-y-3">
                <p className="text-sm text-gray-600">
                  Scan this QR code with your ZKPassport app
                </p>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-3 sm:p-4 text-left">
                  <div className="flex items-start">
                    <span className="text-yellow-600 text-lg mr-2">⚠️</span>
                    <div>
                      <p className="text-yellow-800 font-bold text-xs sm:text-sm mb-1">
                        Use ZKPassport App to Scan
                      </p>
                      <ul className="text-yellow-700 text-xs space-y-1">
                        <li>Open the ZKPassport app first</li>
                        <li>Tap the scan button inside the app</li>
                        <li>Do NOT use your phone camera</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={resetVerification}
            className="mt-2 text-italian-red hover:underline text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Status Message */}
      {message && (
        <div className="text-center mt-4">
          <p className="text-gray-700 font-medium text-sm sm:text-base">{message}</p>
        </div>
      )}

      {/* Loading spinner while waiting */}
      {requestInProgress && queryUrl && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-italian-green"></div>
        </div>
      )}

      {/* Result */}
      {hasResult && (
        <ResultDisplay
          isVerified={isVerified}
          isItalian={isItalianConfirmed}
          nationality={nationality}
          isLoading={false}
        />
      )}

      {/* Verify Again */}
      {hasResult && (
        <div className="text-center mt-6">
          <button
            onClick={resetVerification}
            className="italian-button text-white font-bold py-3 px-6 rounded-full min-h-[48px] active:scale-95 transition-transform"
          >
            🔃 Verify Again
          </button>
        </div>
      )}
    </div>
  );
}