//start view transistion
document.querySelectorAll('.experiment-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const href = link.href;
    document.startViewTransition(() => {
      window.location.href = href;
    });
  });
});

// delete project conformation
document.addEventListener('click', function (event) {
  const confirmBtn = event.target.closest('.delete-button'); // start event on selected element in this case the selected button
  if (!confirmBtn) return; //if there is no button the conformation will be cancelled

  const conformation = confirm("Are you sure you want to delete this experiment?");
  if (!conformation) {
    event.preventDefault(); //prevent the reload in which the experiment will be deleted
    event.stopImmediatePropagation(); // prevent other listeners of the same event from being called. This cancells the delete and other events connected to the button
  }

}, true);

