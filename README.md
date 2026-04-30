# 🎵 Soundbites

**Your personal, cozy sound clip board.**  
Drop in any audio file — it becomes a button. Click it. It plays. That's the whole vibe. ✨


---

## What is Soundbites?

Soundbites is a simple, feel-good little app that turns your audio clips into a grid of clickable buttons. Whether it's a meme sound, a victory jingle, a cat meow, or your favorite 8-bit tune — just add it, give it a name and a color, and your soundboard is ready to go. 🎛️

Everything is stored locally in your browser, so there's no sign-up, no server, no fuss. Just you and your sounds.

---

## ✨ Features

- 🎨 **Pastel color tiles** — each sound clip gets its own cozy colored button
- 🖱️ **One click to play** — tap any tile to trigger the sound instantly
- 🌙 **Dark & Light mode** — switch between vibes in the settings
- 💾 **Fully local** — all your clips are stored in your browser (IndexedDB), nothing leaves your device
- 🎲 **Clip name suggestions** — not sure what to call it? Hit the dice button for inspiration
- 🧹 **Easy cleanup** — hover a tile to reveal the delete button, or wipe everything from settings
- 📦 **No account needed** — just open it and start adding sounds

---

## 🚀 Getting Started

**Prerequisites:** [Node.js](https://nodejs.org/)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the app:**
   ```bash
   npm run dev
   ```

3. Open your browser and head to `http://localhost:3000` — you're in! 🎉

---

## 🎤 How to Use

1. **Click the `+` button** in the top-right of the app to add a new sound clip
2. **Give it a name** (or pick one from the suggestions with the 🎲 dice button)
3. **Choose a color** for the tile — make it yours!
4. **Upload an audio file** (MP3, WAV, OGG — anything your browser supports)
5. **Hit Confirm** — your sound tile appears on the board
6. **Click the tile** anytime to play the sound 🔊

To delete a clip, just hover over the tile and click the little ✕ that appears.

---

## ⚙️ Settings

Open the **System Interface** at the bottom of the app to:
- Toggle between **dark and light mode**
- Check the current **app version**
- **Clear all sounds** if you want a fresh start

---

## 🛠️ Built With

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for lightning-fast dev builds
- [Tailwind CSS v4](https://tailwindcss.com/) for styling
- [Motion](https://motion.dev/) for smooth animations
- [Lucide React](https://lucide.dev/) for icons
- **IndexedDB** (via a custom `db.ts`) for local audio storage
