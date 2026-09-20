// Desktop shell

const desktop = document.querySelector("#desktop");
const openButton = document.querySelector("[data-desktop-open]");
const closeButton = document.querySelector("[data-desktop-close");
const appButtons = [...document.querySelectorAll("[data-app-open]")];
const apps = [...document.querySelectorAll("[data-app]")];
const appCloseButtons = [...document.querySelectorAll("[data-app-close]")];

const DEFAULT_APP = "terminal";

function appElement(name) {
  return apps.find((app) => app.dataset.app === name);
}

// use the apps input over the controls so that the
// cursor appears where you should type when opening things.
function focusTarget(name) {
  const app = appElement(name);
  return app?.querySelector("input") ?? app?.querySelector("button") ?? null;
}

function showApp(name) {
  for (const app of apps) app.hidden = app.dataset.app !== name;
  for (const button of appButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.appOpen === name));
  }
  focusTarget(name)?.focus();
}

function closeApp() {
  for (const button of appButtons) button.setAttribute("aria-pressed", "false");
  for (const app of apps) app.hidden = true;
}

function openDesktop() {
  if (desktop.open) return;

  //showModal is for accessibility
  desktop.showModal();
  showApp(DEFAULT_APP);
}

function toggleDesktop() {
  if (desktop.open) desktop.closest();
  else openDesktop();
}

openButton.addEventListener("click", openDesktop);
closeButton.addEventListener("click", () => desktop.close());

for (const button of appButtons) {
  button.addEventListener("click", () => {
    if (button.getAttribute("aria-pressed") === "true") {
      focusTarget(button.dataset.appOpen)?.focus();
      return;
    }
    showApp(button.dataset.appOpen);
  });
}

for (const button of appCloseButtons) {
  button.addEventListener("click", () => {
    closeApp();
    // prevent focusing on app that no longer exists
    appButtons[0]?.focus();
  });
}

document.addEventListener("keydown", (event) => {
  if (!event.ctrlKey || event.altKey || event.metaKey || event.code != "Backquote") return;
  event.preventDefault();
  toggleDesktop();
});
