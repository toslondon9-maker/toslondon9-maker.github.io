function enhanceTabSet(root) {
  if (!root?.querySelectorAll) return () => {};
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = [...root.querySelectorAll('[role="tabpanel"]')];
  if (!tabs.length || tabs.length !== panels.length) return () => {};

  root.classList?.add("tabsEnhanced");
  const activate = (index, moveFocus = false) => {
    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === index;
      tab.setAttribute("aria-selected", String(active));
      tab.setAttribute("tabindex", active ? "0" : "-1");
      panels[tabIndex].hidden = !active;
    });
    if (moveFocus) tabs[index].focus?.();
  };

  const listeners = [];
  tabs.forEach((tab, index) => {
    const onClick = (event) => { event?.preventDefault?.(); activate(index); };
    const onKeydown = (event) => {
      let next;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (event.key === "Enter" || event.key === " ") next = index;
      if (next === undefined) return;
      event.preventDefault?.();
      activate(next, true);
    };
    tab.addEventListener?.("click", onClick);
    tab.addEventListener?.("keydown", onKeydown);
    listeners.push([tab, onClick, onKeydown]);
  });

  const initial = Math.max(0, tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true"));
  activate(initial);
  return () => {
    for (const [tab, onClick, onKeydown] of listeners) {
      tab.removeEventListener?.("click", onClick);
      tab.removeEventListener?.("keydown", onKeydown);
    }
    root.classList?.remove("tabsEnhanced");
    panels.forEach((panel) => { panel.hidden = false; });
  };
}

export function mountTabs(root = globalThis.document) {
  if (!root?.querySelectorAll) return () => {};
  if (root.matches?.("[data-tabs]") || root.querySelectorAll('[role="tab"]').length) return enhanceTabSet(root);
  const cleanups = [...root.querySelectorAll("[data-tabs]")].map(enhanceTabSet);
  return () => cleanups.forEach((cleanup) => cleanup());
}

if (typeof document !== "undefined") mountTabs(document);
