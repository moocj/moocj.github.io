// The projects app on the desktop

export function createProjectsApp({ app, projects }) {
  const list = app.querySelector(".projects__list");
  const detail = app.querySelector(".projects__detail");
  const buttons = [];

  function showList(index) {
    detail.hidden = true;
    list.hidden = false;
    buttons[index]?.focus();
  }

  function showDetail(index) {
    const project = projects[index];

    const back = document.createElement("button");
    back.type = "button";
    back.className = "projects__back";
    back.textContent = "All projects";
    back.addEventListener("click", () => showList(index));

    const title = document.createElement("h4");
    title.id = "projects-detail-title";
    title.textContent = project.title;

    const description = document.createElement("p");
    description.textContent = project.description;

    const stack = document.createElement("p");
    stack.className = "stack";
    stack.textContent = project.stack;

    const parts = [back, title, description, stack];

    if (project.link) {
      const link = document.createElement("a");
      link.href = project.link.href;
      link.textContent = project.link.label;
      parts.push(link);
    }

    list.hidden = true;
    detail.replaceChildren(...parts);
    detail.hidden = false;
    detail.focus();
  }

  for (const [index, project] of projects.entries()) {
    const item = document.createElement("li");
    const button = document.createElement("button");

    button.type = "button";
    button.className = "projects__item";
    button.textContent = project.title;
    button.addEventListener("click", () => showDetail(index));

    item.append(button);
    list.append(item);
    buttons.push(button);
  }

  return {
    name: "projects",
    element: app,
    focus: () => (detail.hidden ? buttons[0]?.focus() : detail.focus()),
  };
}
