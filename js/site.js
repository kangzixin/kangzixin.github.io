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
})();
