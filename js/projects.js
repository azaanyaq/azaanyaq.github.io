/* ==========================================================================
   Projects page renderer.

   Reads PROJECT_CATEGORIES and PROJECTS from js/projects-data.js and builds
   the filter row, the card grid and the detail overlay. You shouldn't need
   to touch this file to add projects — only to add new *kinds* of fields.

   Extension points (all near the top of this file):
     LINK_TYPES       labels + order for action buttons
     MEDIA_RENDERERS  one function per media `type`
     DETAIL_FIELDS    which project fields render in the detail view, where,
                      and how. Add an entry to support a new field.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Extension points ---------- */

  // Action buttons render in this order. Link keys not listed here still
  // render, after these, with a label derived from the key.
  const LINK_TYPES = {
    code: { label: "Code" },
    demo: { label: "Demo" },
    report: { label: "Report" },
    paper: { label: "Paper" },
    video: { label: "Video" },
  };

  // Each renderer receives (item, project) and returns a DOM node, or null
  // to skip. Unknown types are skipped with a console warning.
  const MEDIA_RENDERERS = {
    image(item, project) {
      return h("img", {
        src: asset(item.src),
        alt: item.alt || item.caption || `${project.title} image`,
        loading: "lazy",
      });
    },
    video(item) {
      return h("video", {
        src: asset(item.src),
        poster: item.poster ? asset(item.poster) : null,
        controls: true,
        playsinline: true,
        preload: "metadata",
      });
    },
    embed(item, project) {
      const frame = h("iframe", {
        src: item.src,
        title: item.title || item.caption || `${project.title} embedded media`,
        loading: "lazy",
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen",
        allowfullscreen: true,
        referrerpolicy: "strict-origin-when-cross-origin",
      });
      const box = h("div", { class: "media-embed" }, frame);
      if (item.aspectRatio) box.style.aspectRatio = item.aspectRatio;
      return box;
    },
  };

  // Detail view layout. `area` is "header", "main" or "aside". A field is
  // skipped entirely when the project doesn't have it (or it's empty).
  const DETAIL_FIELDS = [
    { key: "title", area: "header", render: (v) => h("h2", { class: "detail-title", id: "detail-title" }, v) },
    { key: "oneLiner", area: "header", render: (v) => h("p", { class: "detail-lede" }, v) },
    { key: "categories", area: "header", render: (v) => renderTags(v) },
    { key: "links", area: "header", render: (v) => renderLinks(v) },
    { key: "description", area: "main", render: (v) => renderDescription(v) },
    { key: "media", area: "main", render: (v, p) => renderMedia(v, p) },
    { key: "techStack", area: "aside", render: (v) => renderTechStack(v) },
    { key: "meta", area: "aside", render: (v) => renderMeta(v) },
  ];

  /* ---------- Setup ---------- */

  const categories = typeof PROJECT_CATEGORIES !== "undefined" ? PROJECT_CATEGORIES : [];
  const projects = typeof PROJECTS !== "undefined" ? PROJECTS : [];
  const techDomains = typeof TECH_DOMAINS !== "undefined" ? TECH_DOMAINS : {};
  const categoriesById = new Map(categories.map((c) => [c.id, c]));
  const projectsById = new Map();
  projects.forEach((p) => {
    if (!p || !p.id || !p.title) return console.warn("Project is missing an id or title:", p);
    if (projectsById.has(p.id)) console.warn(`Duplicate project id "${p.id}"`);
    projectsById.set(p.id, p);
  });

  // Data paths are relative to the site root; this page may live in a
  // subfolder. Captured now, before the URL is changed by history.pushState.
  const SITE_ROOT = new URL(document.body.dataset.siteRoot || "./", location.href);
  const LISTING_URL = new URL("./", location.href);
  // Pretty /projects/<id> URLs need a web server (and 404.html on GitHub
  // Pages). When opened straight from disk, fall back to #<id>.
  const USE_PATHS = location.protocol === "http:" || location.protocol === "https:";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const baseTitle = document.title;

  const filtersEl = document.getElementById("project-filters");
  const gridEl = document.getElementById("project-grid");
  const dialog = document.getElementById("project-detail");
  const panel = dialog.querySelector(".detail-panel");
  const scrim = dialog.querySelector(".detail-scrim");
  const inner = dialog.querySelector(".detail-inner");
  const contentEl = dialog.querySelector(".detail-content");
  const stripeEl = dialog.querySelector(".detail-stripe");

  let activeFilter = "all";
  let openId = null;
  let openedByPush = false;
  let closing = null;
  let detailVersion = 0;
  let awaitingBack = false;

  /* ---------- Helpers ---------- */

  function h(tag, props, ...children) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(props || {})) {
      if (value == null || value === false) continue;
      if (key === "class") el.className = value;
      else el.setAttribute(key, value === true ? "" : value);
    }
    el.append(...children.flat().filter((c) => c != null && c !== false));
    return el;
  }

  function asset(path) {
    if (!path) return path;
    if (/^([a-z]+:|\/\/|\/)/i.test(path)) return path;
    return new URL(path, SITE_ROOT).href;
  }

  function isEmpty(value) {
    if (value == null || value === "") return true;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
  }

  function titleCase(key) {
    return key.replace(/[-_]+/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  }

  function categoryLabel(id) {
    const category = categoriesById.get(id);
    return (category && category.label) || titleCase(id);
  }

  function categoryColor(id) {
    const category = categoriesById.get(id);
    return (category && category.color) || "var(--muted)";
  }

  // One solid segment per category, used for the card and detail stripes.
  function stripeSegments(ids) {
    return ids.map((id) => h("span", { style: `background: ${categoryColor(id)}` }));
  }

  function isExternal(url) {
    try {
      return new URL(url, location.href).origin !== location.origin;
    } catch (e) {
      return false;
    }
  }

  /* ---------- Field renderers ---------- */

  function renderTags(ids) {
    return h(
      "ul",
      { class: "tags", "aria-label": "Categories" },
      ids.map((id) => h("li", { style: `--cat: ${categoryColor(id)}` }, categoryLabel(id)))
    );
  }

  function renderLinks(links) {
    const known = Object.keys(LINK_TYPES).filter((k) => links[k]);
    const extra = Object.keys(links).filter((k) => !(k in LINK_TYPES) && links[k]);
    const buttons = [...known, ...extra].map((key) => {
      const entry = links[key];
      const url = typeof entry === "string" ? entry : entry.url;
      if (!url) return null;
      const label = (typeof entry === "object" && entry.label) || (LINK_TYPES[key] && LINK_TYPES[key].label) || titleCase(key);
      const external = isExternal(url);
      return h(
        "a",
        { class: "button", href: asset(url), target: external ? "_blank" : null, rel: external ? "noopener" : null },
        label,
        external ? h("span", { class: "external-mark", "aria-hidden": "true" }, "↗") : null,
        external ? h("span", { class: "visually-hidden" }, " (opens in a new tab)") : null
      );
    });
    const valid = buttons.filter(Boolean);
    return valid.length ? h("div", { class: "detail-actions" }, valid) : null;
  }

  function renderDescription(value) {
    const paragraphs = (Array.isArray(value) ? value : String(value).split(/\n\s*\n/))
      .map((p) => p.trim())
      .filter(Boolean);
    return h("div", { class: "prose" }, paragraphs.map((p) => h("p", null, p)));
  }

  function renderMedia(items, project) {
    const figures = items.map((item) => {
      const render = MEDIA_RENDERERS[item && item.type];
      if (!render) {
        console.warn(`No renderer for media type "${item && item.type}" in project "${project.id}"`);
        return null;
      }
      const node = render(item, project);
      if (!node) return null;
      return h("figure", { class: "media-item" }, node, item.caption ? h("figcaption", null, item.caption) : null);
    });
    const valid = figures.filter(Boolean);
    return valid.length ? h("div", { class: "media-list" }, valid) : null;
  }

  function renderTechStack(stack) {
    return h(
      "section",
      { "aria-labelledby": "detail-stack-title" },
      h("h3", { class: "aside-title", id: "detail-stack-title" }, "Tech stack"),
      h(
        "ul",
        { class: "stack-list" },
        stack.map((s) => h("li", { style: `--cat: ${techDomains[s] ? categoryColor(techDomains[s]) : "var(--muted)"}` }, s))
      )
    );
  }

  function renderMeta(meta) {
    return h(
      "section",
      { "aria-labelledby": "detail-meta-title" },
      h("h3", { class: "aside-title", id: "detail-meta-title" }, "Details"),
      h(
        "dl",
        { class: "meta-list" },
        Object.entries(meta).map(([label, value]) => h("div", null, h("dt", null, label), h("dd", null, String(value))))
      )
    );
  }

  /* ---------- Filters + grid ---------- */

  function projectHref(id) {
    return USE_PATHS ? new URL(encodeURIComponent(id), LISTING_URL).pathname : `#${encodeURIComponent(id)}`;
  }

  function renderFilters() {
    const options = [{ id: "all", label: "All" }, ...categories];
    filtersEl.replaceChildren(
      ...options.map((opt) => {
        const count =
          opt.id === "all"
            ? projectsById.size
            : [...projectsById.values()].filter((p) => (p.categories || []).includes(opt.id)).length;
        const isAll = opt.id === "all";
        const btn = h(
          "button",
          {
            type: "button",
            class: "filter",
            "data-filter": opt.id,
            "aria-pressed": String(opt.id === activeFilter),
            style: isAll ? null : `--cat: ${categoryColor(opt.id)}`,
          },
          isAll ? null : h("span", { class: "dot", "aria-hidden": "true" }),
          opt.label,
          h("span", { class: "filter-count", "aria-hidden": "true" }, String(count))
        );
        btn.addEventListener("click", () => setFilter(opt.id));
        return btn;
      })
    );
  }

  function setFilter(id) {
    activeFilter = id;
    filtersEl.querySelectorAll(".filter").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.filter === id));
    });
    renderGrid();
  }

  function renderCard(project) {
    const media = project.thumbnail
      ? h("img", { src: asset(project.thumbnail), alt: project.thumbnailAlt || "", loading: "lazy" })
      : h("div", { class: "media-fallback", "aria-hidden": "true" }, "No image");

    const ids = project.categories || [];
    return h(
      "li",
      null,
      h(
        "article",
        {
          class: "card corner-marks",
          "data-card": project.id,
          style: ids.length ? `--card-cat: ${categoryColor(ids[0])}` : null,
        },
        ids.length ? h("div", { class: "card-stripe", "aria-hidden": "true" }, stripeSegments(ids)) : null,
        h("div", { class: "card-media" }, media),
        h(
          "div",
          { class: "card-body" },
          h("h3", { class: "card-title" }, h("a", { class: "card-link", href: projectHref(project.id), "data-project": project.id }, project.title)),
          project.oneLiner ? h("p", { class: "card-hook" }, project.oneLiner) : null,
          isEmpty(project.categories) ? null : renderTags(project.categories)
        )
      )
    );
  }

  function renderGrid() {
    const visible = [...projectsById.values()].filter(
      (p) => activeFilter === "all" || (p.categories || []).includes(activeFilter)
    );
    gridEl.replaceChildren(...visible.map(renderCard));
    const empty = document.getElementById("project-empty");
    empty.hidden = visible.length > 0;
  }

  /* ---------- Detail overlay ---------- */

  function renderDetail(project) {
    const areas = { header: [], main: [], aside: [] };
    for (const field of DETAIL_FIELDS) {
      const value = project[field.key];
      if (isEmpty(value)) continue;
      const node = field.render(value, project);
      if (node) (areas[field.area] || areas.main).push(node);
    }

    const body = h(
      "div",
      { class: "detail-body" + (areas.aside.length ? "" : " no-aside") },
      areas.main.length ? h("div", { class: "detail-main" }, areas.main) : null,
      areas.aside.length ? h("aside", { class: "detail-aside" }, areas.aside) : null
    );

    stripeEl.replaceChildren(...stripeSegments(project.categories || []));
    contentEl.replaceChildren(
      h("header", { class: "detail-header" }, areas.header),
      areas.main.length || areas.aside.length ? body : null
    );
  }

  function visibleCardFor(id) {
    const card = gridEl.querySelector(`[data-card="${CSS.escape(id)}"]`);
    if (!card) return null;
    const r = card.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight && r.width > 0 ? card : null;
  }

  // clip-path inset() that crops the panel down to the card's rectangle.
  function insetFor(card) {
    const c = card.getBoundingClientRect();
    const p = panel.getBoundingClientRect();
    const top = Math.max(0, c.top - p.top);
    const right = Math.max(0, p.right - c.right);
    const bottom = Math.max(0, p.bottom - c.bottom);
    const left = Math.max(0, c.left - p.left);
    return `inset(${top}px ${right}px ${bottom}px ${left}px)`;
  }

  function makeGhost(card) {
    const r = card.getBoundingClientRect();
    const ghost = card.cloneNode(true);
    ghost.classList.add("detail-ghost");
    ghost.removeAttribute("data-card");
    ghost.setAttribute("aria-hidden", "true");
    ghost.inert = true;
    Object.assign(ghost.style, { top: `${r.top}px`, left: `${r.left}px`, width: `${r.width}px`, height: `${r.height}px` });
    dialog.append(ghost);
    return ghost;
  }

  function stopAnimations() {
    dialog.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    dialog.querySelectorAll(".detail-ghost").forEach((g) => g.remove());
  }

  function openDetail(project, { animate }) {
    detailVersion++;
    stopAnimations();
    closing = null;
    openId = project.id;
    renderDetail(project);
    document.title = `${project.title} · ${baseTitle}`;
    dialog.setAttribute("aria-labelledby", "detail-title");

    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add("is-locked");
    panel.scrollTop = 0;

    if (!animate || reduceMotion.matches) return;

    const easing = "cubic-bezier(0.2, 0.7, 0.1, 1)";
    const card = visibleCardFor(project.id);
    scrim.animate({ opacity: [0, 1] }, { duration: 320, easing: "ease-out" });

    if (card) {
      // The card "grows": the panel is revealed from the card's rectangle
      // outwards while a copy of the card fades away on top of it.
      const ghost = makeGhost(card);
      panel.animate({ clipPath: [insetFor(card), "inset(0px 0px 0px 0px)"] }, { duration: 460, easing });
      ghost.animate({ opacity: [1, 0] }, { duration: 180, easing: "ease-out", fill: "forwards" })
        .finished.then(() => ghost.remove(), () => {});
      inner.animate({ opacity: [0, 1] }, { duration: 260, delay: 200, easing: "ease-out", fill: "backwards" });
    } else {
      panel.animate({ opacity: [0, 1], transform: ["scale(0.98)", "none"] }, { duration: 260, easing });
    }
  }

  function closeDetail() {
    if (!openId || closing) return closing;
    const id = openId;
    const version = detailVersion;

    const finish = () => {
      if (version !== detailVersion) return; // reopened before the close finished
      stopAnimations();
      if (dialog.open) dialog.close();
      contentEl.replaceChildren(); // also stops any playing video / embed
      document.documentElement.classList.remove("is-locked");
      document.title = baseTitle;
      openId = null;
      closing = null;
    };

    if (reduceMotion.matches) {
      finish();
      return null;
    }

    stopAnimations();
    const easing = "cubic-bezier(0.4, 0, 0.2, 1)";
    const card = visibleCardFor(id);
    const anims = [
      inner.animate({ opacity: [1, 0] }, { duration: 140, easing: "ease-in", fill: "forwards" }),
      scrim.animate({ opacity: [1, 0] }, { duration: 340, easing: "ease-in", fill: "forwards" }),
    ];

    if (card) {
      const ghost = makeGhost(card);
      anims.push(
        panel.animate({ clipPath: ["inset(0px 0px 0px 0px)", insetFor(card)] }, { duration: 380, easing, fill: "forwards" }),
        ghost.animate({ opacity: [0, 1] }, { duration: 160, delay: 240, easing: "ease-out", fill: "both" })
      );
    } else {
      anims.push(panel.animate({ opacity: [1, 0], transform: ["none", "scale(0.98)"] }, { duration: 220, easing, fill: "forwards" }));
    }

    // Animations pause in background tabs, so don't let closing depend on them.
    const timeout = new Promise((resolve) => setTimeout(resolve, 600));
    closing = Promise.race([Promise.all(anims.map((a) => a.finished)), timeout]).then(finish, finish);
    return closing;
  }

  /* ---------- URL sync ---------- */

  function idFromUrl() {
    const params = new URLSearchParams(location.search);
    if (params.get("project")) return params.get("project");
    if (location.hash.length > 1) return decodeURIComponent(location.hash.slice(1));
    if (USE_PATHS && location.pathname.startsWith(LISTING_URL.pathname)) {
      const rest = decodeURIComponent(location.pathname.slice(LISTING_URL.pathname.length)).replace(/\/$/, "");
      if (rest && rest !== "index.html" && !rest.includes("/")) return rest;
    }
    return null;
  }

  function listingHref() {
    return USE_PATHS ? LISTING_URL.pathname : location.pathname + location.search;
  }

  function setUrl(href, replace) {
    try {
      history[replace ? "replaceState" : "pushState"](null, "", href);
      return true;
    } catch (e) {
      return false; // e.g. some browsers block history changes on file://
    }
  }

  function requestOpen(id) {
    const project = projectsById.get(id);
    if (!project || openId) return;
    openedByPush = setUrl(projectHref(id), false);
    openDetail(project, { animate: true });
  }

  function requestClose() {
    if (!openId || closing || awaitingBack) return;
    if (openedByPush) {
      // Pop the entry we pushed so the back button doesn't reopen it.
      // The popstate handler below runs the close animation.
      openedByPush = false;
      awaitingBack = true;
      history.back();
      setTimeout(() => {
        if (!awaitingBack) return;
        awaitingBack = false;
        setUrl(listingHref(), true);
        closeDetail();
      }, 500);
    } else {
      setUrl(listingHref(), true);
      closeDetail();
    }
  }

  function syncFromUrl() {
    awaitingBack = false;
    const id = idFromUrl();
    const project = id && projectsById.get(id);
    if (project && openId !== id) {
      openedByPush = false;
      openDetail(project, { animate: true });
    } else if (!project && openId) {
      closeDetail();
    }
  }

  /* ---------- Events ---------- */

  gridEl.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-project]");
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    requestOpen(link.dataset.project);
  });

  dialog.querySelector(".detail-close").addEventListener("click", requestClose);
  scrim.addEventListener("click", requestClose);

  // Escape key. Handled directly because not every browser turns it into a
  // `cancel` event; `cancel` still covers other close requests (e.g. Android back).
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    requestClose();
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    requestClose();
  });

  // If the browser force-closes the dialog, tidy up state and the URL.
  dialog.addEventListener("close", () => {
    if (openId && !closing) {
      if (openedByPush) {
        openedByPush = false;
        history.back();
      } else {
        setUrl(listingHref(), true);
      }
      stopAnimations();
      contentEl.replaceChildren();
      document.documentElement.classList.remove("is-locked");
      document.title = baseTitle;
      openId = null;
    }
  });

  window.addEventListener("popstate", syncFromUrl);

  /* ---------- Init ---------- */

  renderFilters();
  renderGrid();

  const initialId = idFromUrl();
  if (initialId) {
    const project = projectsById.get(initialId);
    if (project) {
      // Arrived via a shared link (404.html redirects /projects/<id> to
      // ?project=<id>); tidy the URL back to its pretty form.
      if (USE_PATHS) setUrl(projectHref(initialId), true);
      openDetail(project, { animate: true });
    } else {
      setUrl(listingHref(), true);
    }
  }
})();
