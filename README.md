# Portfolio

A static portfolio site (plain HTML/CSS/JS) for GitHub Pages. There's no build step: push to `main` and it's live.

## Layout

```
index.html            About page (home)
projects/index.html   Projects page (grid, filters, detail overlay)
404.html              Handles shareable /projects/<id> links on GitHub Pages
css/style.css         All styles; palette and fonts are tokens at the top
js/projects-data.js   ALL project content and categories
js/projects.js        Renders the Projects page from the data file
assets/               Images, project media, CV
```

## Replacing placeholder content

Everything placeholder is marked. To find it all, run:

```bash
grep -rn "PLACEHOLDER" --include="*.html" --include="*.js" .
```

- **Name, bio, identity line, skills, experience:** `index.html`
- **Name, LinkedIn URL, email:** the nav and footer in `index.html`, `projects/index.html` and `404.html`
- **CV:** replace `assets/cv/Azaan-Yaqub-CV.pdf`
- **Profile photo:** add your image under `assets/img/` and update the `<img>` in `index.html`
- **Projects:** `js/projects-data.js`

## Adding a project

Add one object to the `PROJECTS` array in `js/projects-data.js`. You don't need to touch any HTML or CSS. Only `id` and `title` are required, and fields you leave out don't render. The full list of fields is documented at the top of that file.

To add a **new category**, add it to `PROJECT_CATEGORIES`. The filter row updates automatically. Give it a `color` (one of the `--cat-*` tokens in `css/style.css`, or any CSS colour) for its dots, card stripe and filter underline. Tech-stack dot colours come from `TECH_DOMAINS` in the same file.

To support a **new kind of field** (a new media type, link type or metadata block), edit the extension points at the top of `js/projects.js`:

- `LINK_TYPES`: button labels and order. Unknown link keys still render.
- `MEDIA_RENDERERS`: add a function for a new `media[].type`.
- `DETAIL_FIELDS`: map a project field to a renderer and an area (`header`, `main` or `aside`).

## Running locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Clicking project cards updates the URL to `/projects/<id>`. On GitHub Pages those links also work when shared or refreshed, because `404.html` redirects them. The local Python server doesn't do that redirect, so refreshing a project URL locally gives a 404. Opening the files directly from disk also works, but project links fall back to `#<id>`.
