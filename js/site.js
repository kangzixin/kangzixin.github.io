(function () {
  const buttons = document.querySelectorAll("[data-filter]");
  const groups = document.querySelectorAll(".year-group");
  const count = document.getElementById("pub-count");
  const empty = document.getElementById("pub-empty");

  function label(n) {
    return n + (n === 1 ? " paper" : " papers");
  }

  function matches(item, filter) {
    if (filter === "lead") return item.dataset.lead === "true";
    if (filter === "published" || filter === "preprint") return item.dataset.status === filter;
    return true;
  }

  function apply(filter) {
    let shown = 0;
    groups.forEach(function (group) {
      let inGroup = 0;
      group.querySelectorAll(".pub").forEach(function (item) {
        const visible = matches(item, filter);
        item.hidden = !visible;
        if (visible) inGroup += 1;
      });
      group.hidden = inGroup === 0;
      shown += inGroup;
    });
    if (count) count.textContent = label(shown);
    if (empty) empty.hidden = shown !== 0;
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      buttons.forEach(function (other) {
        other.setAttribute("aria-pressed", other === button ? "true" : "false");
      });
      apply(button.dataset.filter);
    });
  });

  apply(document.querySelector("[data-filter][aria-pressed='true']")?.dataset.filter || "all");
})();

(function () {
  const nav = document.querySelector(".sidenav");
  if (!nav) return;

  const links = Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']"));
  const sections = links
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);
  const current = document.getElementById("sidenav-now");
  const toggle = nav.querySelector(".sidenav-toggle");
  const compact = window.matchMedia("(max-width: 920px)");
  let ticking = false;

  function activeId() {
    if (!sections.length) return "";
    const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (bottom) return sections[sections.length - 1].id;
    const line = Math.max(compact.matches ? 110 : 140, window.innerHeight * 0.33);
    let id = sections[0].id;
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= line) id = section.id;
    });
    return id;
  }

  function mark() {
    const id = activeId();
    links.forEach(function (link) {
      const on = link.getAttribute("href") === "#" + id;
      if (on) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
      if (on && current) current.textContent = link.textContent.trim();
    });
    ticking = false;
  }

  function requestMark() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(mark);
  }

  function closeMenu() {
    nav.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      if (compact.matches) closeMenu();
    });
  });

  mark();
  window.addEventListener("scroll", requestMark, { passive: true });
  window.addEventListener("resize", requestMark);
})();
