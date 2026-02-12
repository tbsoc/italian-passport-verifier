import { ZKPassport } from "@zkpassport/sdk";

export const createItalianVerification = async () => {
  const zkPassport = new ZKPassport(window.location.hostname);
  
  const queryBuilder = await zkPassport.request({
    name: "Italian Passport Verifier",
    logo: "/logo.svg", 
    purpose: "Prove you have Italian nationality",
    scope: "italian-verification",
    mode: "fast",
    devMode: process.env.NODE_ENV === "development",
  });
  
  return queryBuilder
    .disclose("nationality") // Get actual nationality
    .done();
};

export const isItalian = (nationality: string): boolean => {
  if (!nationality || typeof nationality !== "string") {
    return false;
  }
  
  const normalized = nationality.toUpperCase().trim();
  
  // Check for Italy in various formats:
  // ISO 3166-1 alpha-3 code (most likely): "ITA"
  // ISO 3166-1 alpha-2 code: "IT" 
  // Full name variants
  const isItalianCheck = normalized === "ITA" ||  // ISO alpha-3 code
                         normalized === "IT" ||   // ISO alpha-2 code
                         normalized === "ITALY" ||
                         normalized === "ITALIAN" ||
                         normalized === "ITALIA";
  
  return isItalianCheck;
};