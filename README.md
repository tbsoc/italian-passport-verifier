# Italian Passport Verifier 🍕

A Next.js application that uses ZKPassport to verify Italian nationality in a privacy-preserving way.

## Features

- Verify Italian nationality using ZKPassport
- 🍕 Get pizza emoji verification for confirmed Italians
- 🔐 Privacy-preserving zero-knowledge proof verification
- 📱 Mobile-friendly QR code scanning
- 🎉 Beautiful Italian-themed UI with animations

## Getting Started

### Prerequisites

- Node.js 18+ installed
- ZKPassport mobile app installed on your phone

### Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd italian-passport-verifier
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Usage

1. Click "Verify Italian Nationality" button
2. Scan the QR code with your ZKPassport mobile app
3. Follow the verification process on your phone
4. Get your result:
   - 🍕 **If Italian**: Pizza emoji and congratulation message
   - 🤷‍♂️ **If not Italian**: Respectful message explaining verification result

## How It Works

This application uses the ZKPassport SDK to:

1. **Request Verification**: Creates a request for nationality disclosure
2. **Generate QR Code**: Displays a QR code for mobile app scanning
3. **Zero-Knowledge Proof**: User proves nationality without revealing personal data
4. **Verify Result**: Checks if disclosed nationality is Italian
5. **Display Result**: Shows pizza emoji for verified Italians

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Italian theme
- **Verification**: ZKPassport SDK
- **QR Code**: react-qr-code

## Privacy & Security

- ✅ No personal data is stored on the server
- ✅ Privacy-preserving zero-knowledge proofs
- ✅ Only verification results are displayed
- ✅ Domain-based verification ensures secure connections

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

### Manual Deployment

```bash
npm run build
npm start
```

## Environment Variables

- `NODE_ENV`: Set to "development" for dev mode, "production" for live use

## Italian Theme

The application uses the Italian flag colors:
- **Green**: #009246
- **White**: #FFFFFF  
- **Red**: #CE2B37

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License

## Support

Powered by [ZKPassport](https://zkpassport.id) - Privacy-preserving identity verification.