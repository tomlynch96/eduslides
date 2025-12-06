# EduSlides

**Interactive lesson builder for teachers - like Notion meets lesson planning.**

EduSlides lets teachers build lessons from reusable blocks, then share and remix them with the teaching community. Create once, adapt infinitely.

---

## 🎯 Current Status

**Early Prototype (Developer Only)** - v0.3.0

This is a working proof-of-concept demonstrating the core architecture. Not ready for production use.

### What Works Now ✅

**8 Block Types:**
- Text (rich formatting)
- Timer (countdown with visual feedback)
- Objectives (progress tracking)
- Questions (interactive prompts)
- Sequence (ordered steps)
- Images (copy-paste, persistent)
- Cloze (fill-in-the-blank exercises)
- Matching (pair matching games)

**Core Features:**
- Canvas-first editing with in-place modification
- Grid-based layout (6 predefined options)
- Fullscreen individual blocks
- Block content auto-scaling
- Presentation mode (keyboard navigation)
- JSON export/import (localStorage persistence)

**Known Issues:**
- Some block types need polish
- Layout edge cases with 5+ blocks
- No backend (localStorage only)
- Limited error handling

---

# EduSlides

**Interactive lesson builder for teachers - like Notion meets lesson planning.**

EduSlides lets teachers build lessons from reusable blocks, then share and remix them with the teaching community. Create once, adapt infinitely.

---

## 🎯 Current Status

**Early Prototype (Developer Only)** - v0.3.0

This is a working proof-of-concept demonstrating the core architecture. Not ready for production use.

### What Works Now ✅

**8 Block Types:**
- Text (rich formatting)
- Timer (countdown with visual feedback)
- Objectives (progress tracking)
- Questions (interactive prompts)
- Sequence (ordered steps)
- Images (copy-paste, persistent)
- Cloze (fill-in-the-blank exercises)
- Matching (pair matching games)

**Core Features:**
- Canvas-first editing with in-place modification
- Grid-based layout (6 predefined options)
- Fullscreen individual blocks
- Block content auto-scaling
- Presentation mode (keyboard navigation)
- JSON export/import (localStorage persistence)

**Known Issues:**
- Some block types need polish
- Layout edge cases with 5+ blocks
- No backend (localStorage only)
- Limited error handling

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Modern browser (Chrome/Firefox/Safari)

### Installation
```bash
# Clone the repo
git clone https://github.com/yourusername/eduslides.git
cd eduslides

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Tech Stack
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State:** React hooks + localStorage
- **Deployment:** StackBlitz (dev), GitHub integration

---

## 📚 How It Works

EduSlides uses a **semantic block architecture** inspired by HTML:
```
Blocks (modular content units)
  ↓
Slides (arranged block instances)
  ↓
Flows (sequenced slides)
  ↓
Lessons (complete teaching sessions)
```

### Key Concepts

**Block Types (Platform-Defined)**
Immutable templates that define what's possible. Teachers can't create new types, only use existing ones.

**Block Instances (User-Created)**  
Teachers fill in block types with content. Each instance tracks metadata (topic, difficulty, author) for discoverability.

**Slides**
A moment in time - blocks arranged on screen. Slides store layout, fullscreen states, and which blocks persist across slides.

**Flows**
Ordered sequences of slides representing pedagogical progressions (e.g., "Introduction → Practice → Assessment").

**Templates**
Saved arrangements with content stripped out. Blocks mark which fields are "templateable" - reusable structure without duplicating content.

---

## 🎨 Current Architecture Decisions

See [`docs/decisions.md`](./docs/decisions.md) for detailed rationale. Key decisions:

- **Canvas-first editing** - Blocks edited in-place, not in separate panels (reduces cognitive load)
- **Grid-based layout** - 6 predefined options instead of freeform positioning (enables template portability)
- **Registry-based blocks** - Centralized BlockTypeRegistry (adding new types only requires 2 file edits)
- **Metadata-first** - Topic/difficulty/templateable baked into data structures from day one
- **Presentation-focused** - Teacher-controlled projection for whole class, not individual student devices

---

## 🗺️ Roadmap

### Immediate Next Steps (This Week)
- [ ] Slide titles as metadata (not text blocks)
- [ ] Polish existing 8 block types
- [ ] Generate 2-3 sample lessons
- [ ] Create block/slide/flow template system

### Stage 2: Slides & Layout (Current) 🚧
- [x] Canvas-first editing
- [x] Grid-based layout
- [x] Fullscreen blocks
- [x] Presentation mode
- [ ] Persistent blocks across slides (90% done)
- [ ] Slide viewer improvements

### Stage 3: Metadata & Search
- [ ] Topic tagging (from global dictionary)
- [ ] Difficulty levels
- [ ] Search by block type
- [ ] Search by topic/flow/lesson
- [ ] Curriculum alignment metadata

### Stage 4: Flow Builder
- [ ] Sequence slides into flows
- [ ] Flow preview mode
- [ ] Save/load flows
- [ ] Flow templates

### Stage 5: Lessons
- [ ] Assemble flows + standalone slides
- [ ] Lesson metadata (topics, duration, objectives)
- [ ] Export/import complete lessons
- [ ] Remix existing lessons

### Stage 6: Templates
- [ ] Save slide templates (strip non-templateable content)
- [ ] Save block templates (reusable configurations)
- [ ] Template marketplace (browse/search)
- [ ] One-click template instantiation

### Stage 7: Community Layer
- [ ] Publish lessons publicly
- [ ] Remix with attribution
- [ ] Version control for lessons
- [ ] Quality ranking/reviews
- [ ] Contribution credits economy

### Stage 8: Declarative Widget System (Future)
- [ ] Safe-primitive interpreter
- [ ] AI → JSON config → widget
- [ ] Widget marketplace
- [ ] Community-created interactive elements

Full roadmap: [`docs/roadmap.md`](./docs/roadmap.md)

---

## 🧠 The Long-Term Vision

**EduSlides aims to become the "HTML of lessons"** - a universal, open standard format for educational content.

### The Big Idea

Right now, great teaching is trapped in proprietary formats (PowerPoint, Google Slides, PDF). Teachers can't easily:
- Share lessons across platforms
- Discover relevant content from other teachers
- Adapt lessons for different student groups
- Collaboratively improve curriculum

**EduSlides solves this by:**

1. **Standardized Format** - Like HTML for web pages, EduSlides creates a universal format for lessons. Content becomes portable, remixable, and discoverable.

2. **Open Widget Marketplace** - Developers build innovative educational tools (simulations, games, visualizations) that integrate seamlessly into any lesson. Teachers assemble these like LEGO blocks.

3. **Community-Driven Improvement** - Teachers share lessons, others remix and improve them, quality rankings surface the best content. Teaching becomes collaborative, not isolated.

4. **Curriculum-Based Discovery** - Search by topic, grade level, learning objective. Find exactly what you need, when you need it.

5. **Infrastructure Revenue Model** - Schools subscribe for hosting, analytics, admin features. Teachers get the platform free. Content stays open.

### Why This Matters

- **For Teachers:** Stop rebuilding the same content. Stand on each other's shoulders.
- **For Students:** Access to higher-quality, more interactive lessons.
- **For Developers:** Build once, integrate everywhere (like browser extensions for education).
- **For The Ecosystem:** Open standards beat proprietary lock-in.

**Current Focus:** Prove the format works. Get 5-10 teachers using basic flows. Learn what they need.

**Future Focus:** Build the community layer. Enable sharing, remixing, discovery at scale.

---

## 📖 Documentation

- **[Architecture Decisions](./docs/decisions.md)** - Why we built it this way
- **[Data Model](./docs/data-model.md)** - Core types and schemas
- **[Roadmap](./docs/roadmap.md)** - Detailed feature timeline
- **[Adding New Blocks](./docs/blocks/block-registry.md)** - Developer guide (coming soon)

---

## 🤝 Contributing

Not accepting external contributions yet (too early, architecture still evolving).

**Interested in following along?**
- Star the repo for updates
- Open issues for bug reports or feature ideas
- Reach out if you're a teacher interested in early testing

---

## 🏗️ Project Structure
```
/src
  /components
    /blocks          # Block type components
    /slides          # Slide layout & rendering
    BlockRenderer.tsx   # Universal block renderer
    SlideCanvas.tsx     # Main canvas component
  /types
    blocks.ts        # Block type definitions
    slides.ts        # Slide & layout types
  /utils
    BlockTypeRegistry.ts  # Centralized block management
    layoutEngine.ts       # Grid positioning logic
  /stores
    lessonStore.ts   # localStorage persistence

/docs
  decisions.md       # Architectural decisions
  roadmap.md        # Feature timeline
  data-model.md     # Type documentation

/public
  # Static assets
```

---

## 🔧 Development Workflow

This project uses **StackBlitz + Claude Chat** for development:

1. Code in StackBlitz (live preview, GitHub integration)
2. Use Claude for architecture discussions and code generation
3. Document decisions in `/docs` as you go
4. Commit working features incrementally
5. Test immediately, iterate based on feedback

**Philosophy:** Build working solutions before attempting complexity. Defer advanced features until core is stable.

---

## 📝 License

MIT License - see [LICENSE](./LICENSE) for details.

Open source, open standard. The format itself is the moat.

---

## 💬 Contact

**Tom** - Solo developer
- Project updates: [GitHub Discussions](link-when-ready)
- Early tester interest: [email or contact form]
- Development chat: StackBlitz + Claude

---

## 🙏 Acknowledgments

Inspired by:
- **Notion** - Block-based editing UX
- **Figma** - Canvas-first design tools
- **HTML/CSS** - Open standards that enable ecosystems
- **Teachers everywhere** - Who deserve better tools

---

**Built with ❤️ for teachers who want to focus on teaching, not slide-wrangling.**

