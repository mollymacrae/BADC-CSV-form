export function createForm(onSubmit) {
  const form = document.createElement("form");

  const name = document.createElement("input");
  name.name = "name";
  name.placeholder = "Your Name";
  
  const email = document.createElement("input");
  email.name = "email";
  email.placeholder = "Your Email";

  const button = document.createElement("button");
  button.textContent = "Download CSV";

  form.append(name, email, button);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    onSubmit(data);
  });

  return form;
}
