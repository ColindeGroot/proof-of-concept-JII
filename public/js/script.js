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
