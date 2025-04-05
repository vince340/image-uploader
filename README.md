# ModernImages - A Stylish Image Uploader

A modern and elegant image upload application with drag-and-drop functionality, visual feedback, gallery view and AI guidance.

## ✨ Features

- **Intuitive Drag & Drop**: Simply drag and drop your images to begin the upload process
- **Visual Upload Feedback**: Track the progress of your uploads in real-time
- **Beautiful Gallery View**: Browse your uploaded images with smooth animations
- **Image Management**: Download, share, or delete your images with ease
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Image Sharing**: Share direct links to your uploaded images
- **AI Assistant**: "Lovely" guides you through using the application

## 🛠️ Tech Stack

- **Frontend**:
  - React with TypeScript
  - Tailwind CSS for styling
  - Shadcn UI components
  - TanStack React Query for data fetching
  - React Hook Form for form handling

- **Backend**:
  - Node.js with Express
  - PostgreSQL database with Drizzle ORM
  - Multer for file handling

- **AI Integration**:
  - OpenAI API for the "Lovely" assistant

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- OpenAI API key for AI assistant functionality

### Environment Variables

Create a `.env` file in the root directory with the following:

```
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
```

### Installation

1. Clone the repository
2. Install dependencies
3. Set up the database
4. Start the development server

## 📸 How to Use

1. **Upload Images**:
   - Drop images into the upload area or click to browse files
   - Select multiple images to upload them in a batch
   - Monitor upload progress in real-time

2. **View and Manage Images**:
   - Browse your images in the gallery view
   - Click on any image to view it in full size
   - Download, share links, or delete images

3. **Share Images**:
   - Click on any image in the gallery
   - Use the "Copy Link" button to get a shareable URL
   - Share the URL with anyone to let them view your image directly

4. **AI Assistant**:
   - Interact with "Lovely" for guidance on how to use the application
   - Ask questions about features or get help troubleshooting issues

## 🔮 Future Enhancements

- User authentication system
- Image categorization and tagging
- Advanced image editing features
- More AI-powered features for image analysis

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/                # Source files
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and services
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript type definitions
├── server/                 # Backend Express server
│   ├── services/           # Service modules
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Database storage interface
│   └── db.ts               # Database connection
├── shared/                 # Shared code between client and server
│   └── schema.ts           # Database schema and types
├── drizzle.config.ts       # Drizzle ORM configuration
├── package.json            # Project dependencies
├── tailwind.config.ts      # Tailwind CSS configuration
├── theme.json              # Theme configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## 📷 Screenshots

_Coming soon_

## 🙏 Acknowledgements

- Built with [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), and [Express](https://expressjs.com/)
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Database ORM by [Drizzle ORM](https://orm.drizzle.team/)
- AI capabilities powered by [OpenAI](https://openai.com/)
