import { projects } from "../data/projects.js";

// builds a card out of the projects
function buildCard(project) {
  const card = document.createElement("li");
  card.className = "card";

  const title = document.createElement("h3");
  title.textContent = project.title;

  const description = document.createElement("p");
  description.textContent = project.description;

  const stack = document.createElement("p");
  stack.className = "stack";
  stack.textContent = project.stack;

  card.append(title, description, stack);

  if (project.link) {
    const link = document.createElement("a");
    link.href = project.link.href;
    link.textContent = project.link.label;
    card.append(link);
  }

  return card;
}

export function renderProjects(list = projects) {
  const container = document.querySelector("#projects .cards");

  if (container === null) return;

  container.replaceChildren(...list.map(buildCard));
}
