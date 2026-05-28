# LYT Proposal Generator — Developer Handoff Package
**Project Title:** LYT Proposal Generator (Mid-Market AI Practice POC)  
**Target Architecture:** React (Frontend) + Tailwind CSS 4 + Shadcn UI primitives + Client-side PDF Compiler (`html2canvas` + `jsPDF`)

---

## 1. Executive Summary & Design System
This package contains all the visual, functional, and prompt guidelines required to implement the front-end for the **LYT Proposal Generator**. The application acts as an orchestrator dashboard that parses census data, extracts quote rates, audits calculations, and compiles customized slide decks using extracted layout patterns.

### Typography & Fonts
To deliver an elevated, hand-crafted aesthetic, the application implements the **Editorial Executive** theme:
* **Heading Font:** `Playfair Display` (Imported via Google Fonts CDN)
* **Body Font:** `Lora` (Imported via Google Fonts CDN)
* **Secondary Font Theme (Swiss):** `Space Grotesk` (Headings) + `JetBrains Mono` (Body)

### Color Philosophy
* **Primary Branding Color:** `#0F1E36` (Deep Ink Blue / Evans Navy) — reflects institutional trust.
* **Secondary Background Color:** `#FBF9F6` (Warm Parchment) — delivers an editorial, high-end look.

---

## 2. Core Front-End Architecture (React)

The React workspace is organized as follows:
```
client/
  src/
    pages/
      Home.tsx       <-- Main Dashboard, Live Preview & Template Builder
    components/
      ui/            <-- Shadcn UI Primitives (Card, Button, Progress, Badge, Tabs)
    const.ts         <-- Shared Mock Data, State Objects, and Template Definitions
```

### State Management Requirements
Your developer must maintain state for:
1. **`themeConfig`**: Active template (`editorial`, `swiss`, `modern`), primary color, background theme, and font pairings.
2. **`editableTexts`**: A local record mapped by `[slideId][field]` (e.g., `{'cover': {title: 'New Title'}}`) that stores user-customized text overrides.
3. **`activeTemplate`**: The selected output format (`large_group`, `small_group`, `level_funded`, `ancillary`) and its active slides list.
4. **`connections`**: Active status of external integrations (Salesforce, OneDrive) with associated active files.

---

## 3. Claude Slide Creation & PDF Compilation Toolset

The slide compilation feature allows users to double-click and edit text inline, then compile the customized slides into a downloadable draft PDF.

### Dependencies
Install these packages in the frontend repository:
```bash
npm install html2canvas jspdf
```

### Claude Toolset Integration Pattern
When prompting Claude or other LLMs to build or modify the slide rendering and PDF export features, use the following code blocks as a standard:

#### A. Double-Click Inline Editing (JSX Pattern)
```tsx
{editingField?.slideId === slide.id && editingField?.field === 'title' ? (
  <input 
    type="text" 
    value={editValue} 
    onChange={(e) => setEditValue(e.target.value)}
    onBlur={saveEditedText}
    onKeyDown={(e) => e.key === 'Enter' && saveEditedText()}
    autoFocus
    className="text-base font-bold tracking-tight bg-white border border-primary/40 rounded px-1.5 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-primary"
  />
) : (
  <h3 
    onDoubleClick={() => startEditing(slide.id, 'title', slide.title)}
    className="text-lg font-bold tracking-tight leading-tight hover:bg-amber-50 hover:ring-1 hover:ring-amber-200/80 cursor-text rounded px-1 -ml-1 group/title relative" 
    style={{ fontFamily: themeConfig.headingFont, color: themeConfig.primaryColor }}
  >
    {editableTexts[slide.id]?.title || slide.title}
  </h3>
)}
```

#### B. Client-Side PDF Export (jsPDF + html2canvas Pattern)
```tsx
const downloadDraftPDF = async () => {
  if (!slideRef.current) return;
  
  const element = slideRef.current;
  const canvas = await html2canvas(element, {
    scale: 2, // Capture at double resolution for crisp text
    useCORS: true,
    backgroundColor: themeConfig.secondaryColor,
    logging: false
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const imgWidth = 297; // A4 landscape width (mm)
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save(`${activeTemplate.name.replace(/\s+/g, '_')}_Draft.pdf`);
};
```

---

## 4. UI System Prompts for AI Builders

Provide these system prompts to Claude or other AI coding assistants when expanding this tool:

```text
You are a high-end Design Engineer building the LYT Proposal Generator. 
Adhere strictly to these design guidelines:
1. NEVER use generic Inter font for everything. Blend Playfair Display (Headings) and Lora (Body) for the Editorial Executive theme.
2. Maintain contrast. If the background theme is Warm Parchment (#FBF9F6), ensure text colors align with the Deep Ink Blue (#0F1E36) primary color.
3. Keep the active connections status bar observable. Display connected Salesforce CRM and OneDrive files with distinct file names in monospace fonts.
4. Implement inline double-click editing on slide elements. Clicking outside or pressing Enter must commit the changes to local React state.
5. Provide client-side PDF export of the active slide. Capture all custom fonts, colors, and user-edited text exactly as rendered in the DOM.
```

---

## 5. HTML Template & Google Fonts CDN Integration
Include the following link tags in your `index.html` header to support the premium typography:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LYT Proposal Generator</title>
    
    <!-- Google Fonts CDN for Editorial and Swiss Themes -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```
