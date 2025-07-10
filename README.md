# 🎨 AI Portrait Editor — Smart Background Blur & Text Overlay

An AI-powered web application that lets users upload an image, blur the background using **BodyPix (TensorFlow.js)**, and overlay custom text *behind or in front* of detected human subjects — all in real time!

![AI Portrait Editor Screenshot](./public/preview.png) <!-- Optional preview image -->

## 🚀 Live Demo
👉 [Visit the App](https://your-live-app-link.com)  
📸 Try uploading an image and see the magic!

---

## ✨ Features

- 🤖 **AI Human Segmentation** using [BodyPix](https://github.com/tensorflow/tfjs-models/tree/master/body-pix)
- 🌫️ **Background Blur** that preserves the person in focus
- 📝 **Dynamic Text Editor** with:
  - Font size and color controls
  - Positioning text on canvas
  - Text behind/in front of subjects using blending modes
- 📤 Download final image
- 🖼️ AI-generated gallery of saved creations
- 📱 Responsive, modern UI with **Tailwind CSS**
- ⚡ Built with **Next.js App Router** and client-side rendering

---

## 📸 How It Works

1. Upload an image (`.jpg`, `.png`)
2. BodyPix segments the person from background
3. Canvas API applies blur only to the background
4. You can place and style custom text dynamically
5. Render and download the final result!

---

## 🛠 Tech Stack

| Tech            | Description                                |
|-----------------|--------------------------------------------|
| [Next.js](https://nextjs.org/) | React framework for the frontend |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS styling |
| [TensorFlow.js](https://www.tensorflow.org/js) | ML in the browser |
| [BodyPix](https://github.com/tensorflow/tfjs-models/tree/master/body-pix) | AI model for person segmentation |
| Canvas API      | Render image, blur background, draw text   |

---

## 📂 Project Structure

```

src/
├── app/
│   ├── components/         # UI Components (ProcessingSection, Gallery, etc.)
│   ├── utils/              # AI & Canvas Utilities (blurBackground.js)
│   ├── page.jsx            # Home Page
├── public/                 # Static assets
├── styles/                # Tailwind config (optional)

````

---

## 🧪 Run Locally

### 1. Clone this repo

```bash
git clone https://github.com/your-username/ai-portrait-editor.git
cd ai-portrait-editor
````

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

> App runs at `http://localhost:3000`

---

## 📦 Build for Production

```bash
npm run build
npm run start
```

---


## 🙌 Credits

* [TensorFlow.js BodyPix](https://github.com/tensorflow/tfjs-models/tree/master/body-pix)
* [Lucide Icons](https://lucide.dev/)
* [Tailwind UI Inspiration](https://tailwindui.com/)

---

## 🧑‍💻 Author

**Daniru Punsith**
📫 [LinkedIn](https://linkedin.com/in/daniru-punsith-b96288312)
🌐 [Portfolio](https://daniru-punsith-portfolio.netlify.app)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).


