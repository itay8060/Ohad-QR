# QR Image Viewer

A fun, playful one-page site that shows a QR code. When scanned, it displays an image that you can update whenever you want!

## Features

- Generate a QR code that links to your image viewer
- Upload and update images easily using ImgChest's free image hosting
- Beautiful, responsive design
- Download the QR code to share with others
- Images are accessible from any device that scans the QR code

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up ImgChest API

1. Register an account at [ImgChest](https://imgchest.com/)
2. Create your API token at [ImgChest API Authorization](https://imgchest.com/docs/api/1.0/general/authorization)
3. Get your authorization token

Update the `src/services/imageService.js` file with your ImgChest token:

```javascript
const IMGCHEST_TOKEN = 'YOUR_TOKEN_HERE';
```

### 3. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app.

### 4. Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## How to Use

1. Open the app in your browser
2. Upload an image using the upload section
3. Once uploaded, the QR code will link to your image
4. Share the QR code with others
5. Update the image anytime by uploading a new one

## Deployment

You can deploy this app to:

- Vercel
- Netlify
- GitHub Pages
- Any static site hosting

## Important Notes

- The app uses ImgChest to host your images (free service)
- When you scan the QR code, it opens the same app in "viewer mode"
- The image URL is stored in localStorage on your device
- Images are accessible from any device that scans the QR code
