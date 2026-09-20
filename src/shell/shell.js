// Desktop shell

export function createShell({ apps, defaultApp }) {
  const desktop = document.querySelector("#desktop");
  const openButton = document.querySelector("[data-desktop-open]");
  const closeButton = document.querySelector("[data-desktop-close]");
  const appButtons = [...document.querySelectorAll("[data-app-open]")];
  const appCloseButtons = [...document.querySelectorAll("[data-app-close]")];
  const byName = new Map(apps.map((app) => [app.name, app]));

  function showApp(name) {
    for (const app of apps) app.element.hidden = app.name !== name;
    for (const button of appButtons) {
      button.setAttribute("aria-pressed", String(button.dataset.appOpen === name));
    }
    byName.get(name)?.focus();
  }

  function hideApps() {
    for (const app of apps) app.element.hidden = true;
    for (const button of appButtons) button.setAttribute("aria-pressed", "false");
  }

  function openDesktop() {
    if (desktop.open) return;

    //showModal is for accessibility
    desktop.showModal();
    if (defaultApp) showApp(defaultApp);
    else hideApps();
  }

  function toggleDesktop() {
    if (desktop.open) desktop.close();
    else openDesktop();
  }

  function start() {
    openButton.addEventListener("click", openDesktop);
    closeButton.addEventListener("click", () => desktop.close());

    desktop.addEventListener("close", hideApps);

    for (const button of appButtons) {
      button.addEventListener("click", () => {
        if (button.getAttribute("aria-pressed") === "true") {
          byName.get(button.dataset.appOpen)?.focus();
          return;
        }
        showApp(button.dataset.appOpen);
      });
    }

    for (const button of appCloseButtons) {
      button.addEventListener("click", () => {
        hideApps();
        // prevent focusing on app that no longer exists
        appButtons[0]?.focus();
      });
    }

    document.addEventListener("keydown", (event) => {
      if (!event.ctrlKey || event.altKey || event.metaKey || event.code != "Backquote") return;
      event.preventDefault();
      toggleDesktop();
    });
  }

  return { start };
}
