# Niharika Patil — Architecture Portfolio

An editorial, interactive website for the **24-page, A3 landscape portfolio** of Niharika Patil, designed for architecture studio review. The site includes an immersive homepage, project index, and a high-fidelity individual-sheet PDF viewer with fullscreen, keyboard navigation and zoom.

## Project address

Repository: `https://github.com/patil-niharika/arch-portfolio`

After GitHub Pages is enabled, the intended website URL is:

**https://patil-niharika.github.io/arch-portfolio/**

The site is not published merely by creating this folder. You must upload and enable GitHub Pages.

## Why the original portfolio is split into pages

The supplied original PDF is **171.3 MB**, exceeding GitHub's **100 MB maximum size for a single Git file**. Rather than compress its drawings or turn them into JPEGs, this site stores each of the 24 sheets as a separate PDF in `pages/sheet-XX.pdf`, each under 100 MB. They were generated with PyMuPDF's PDF-to-PDF page copy and lossless compression, **without rendering sheets to bitmaps or intentionally downsampling/recompressing embedded images**. They retain their original A3 page dimensions and vector content. Sampled pages can be compared with the original locally at the same zoom.

Low-weight WebP assets are used **only on the homepage and for navigation thumbnails**; the actual drawing viewer loads the corresponding original-fidelity PDF page.

Total high-quality page assets are ~166.5 MB. Each page loads separately as needed. The largest page file (`pages/sheet-14.pdf`) is about 27.4 MB, which exceeds GitHub's 25 MB **browser upload** cap, but **is supported when pushing with GitHub Desktop or git**, because it's below the 100 MB Git file limit.

## Publish on GitHub Pages — simplest on Windows

1. Download/extract the ZIP. Its root directory contains `index.html`, `styles.css`, `app.js`, `site-config.js`, `assets/` and `pages/`.
2. Install **GitHub Desktop** from https://desktop.github.com/ and sign into the `patil-niharika` GitHub account.
3. Create the public repository named exactly `arch-portfolio` if it does not already exist.
4. In GitHub Desktop, **File → Clone repository**, select `patil-niharika/arch-portfolio`, and choose a local folder.
5. Copy **all the contents** of this extracted portfolio folder into the cloned repository folder (place `index.html` at the repository root, not inside another nested folder).
6. In GitHub Desktop, write a summary like `Publish architecture portfolio`, click **Commit to main**, then **Push origin**. Because the PDF assets total ~166.5 MB, the initial upload could take a few minutes.
7. On GitHub's repository page, open **Settings → Pages → Build and deployment → Deploy from a branch**, choose `main` and `/(root)`, then **Save**.
8. Wait for GitHub Pages deployment to complete. Open `https://patil-niharika.github.io/arch-portfolio/` in an incognito window and check the sheets and zoom at 200%.

The `/arch-portfolio/` subpath is handled using relative URLs — no build step or routing configuration is required.

## Test locally

Use a local HTTP server. Opening `index.html` directly using `file://` cannot load ESM or local PDFs reliably.

With Python installed:

```bash
cd path/to/niharika-arch-portfolio
python -m http.server 8080
```

Then open `http://localhost:8080/`.

The first high-fidelity PDF view loads PDF.js version 4.10.38 from cdnjs. If the CDN is blocked, the website automatically falls back to the browser's own native PDF viewer, still loading the original PDF page. There is no backend, no authentication and no paid website builder.

## Optional full original PDF link

The original 171 MB document is intentionally not included in the repository. If you already uploaded the unmodified original PDF to Google Drive or Adobe Acrobat, you can add the **anyone-with-the-link Viewer** URL to `site-config.js`:

```js
export const FULL_ORIGINAL_PDF_URL = 'https://...';
```

The viewer will then show a **FULL PDF** link alongside **DOWNLOAD SHEET**.

## Site architecture

- `index.html` — landing page and viewer markup.
- `styles.css` — responsive visual system, motion, modal and PDF stage.
- `app.js` — page routing, project index, PDF.js rendering, lazy PDF loading, keyboard navigation.
- `site-config.js` — optional URL for original full PDF.
- `pages/` — 24 losslessly copied PDF sheets, exact page order as source.
- `assets/` — cropped visual previews and web-ready thumbnails (not used for full PDF sheets).
- `assets/mark.svg` — custom monogram favicon.

## Portfolio sections and page numbering

| Section | Source PDF pages |
|---|---|
| Introduction, CV, Contents | 01–03 |
| Exoskeletal Circuit — Stadium | 04–08 |
| Samvedana — Institutional | 09–12 |
| Mitti — Cultural | 13–15 |
| Saanidhya — Urban design | 16–18 |
| Working Drawings | 19–20 |
| Selected Explorations / Thesis | 21–23 |
| Contact / Thank you | 24 |

The site does not alter any portfolio sheet; it only changes how the original work is discovered and viewed.

## Keyboard controls

- `←` / `→`: previous/next sheet
- `+` / `−`: zoom in/out
- `0`: fit page
- `F`: fullscreen
- `Esc`: close viewer
- `Home` / `End`: first/last sheet

## Important practical limitations

- Browser rendering always depends on display resolution and zoom. PDF.js renders fresh pixels at higher zoom; it cannot make an originally low-resolution source image sharper than it was in the original PDF.
- The largest per-sheet PDF files are sizable, so opening one over slow internet can take several seconds. This is the direct trade-off for preserving embedded source quality.
- GitHub Pages must be activated by the repository owner. If no repository is visible to the connected GitHub account, create it on GitHub before deploying.
- This is a static site, not an exact reproduction of any creative studio's proprietary interactions.
