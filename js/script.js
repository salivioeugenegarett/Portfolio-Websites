function toggleDetails(btn) {
  const details = btn.nextElementSibling;
  const list = details.querySelector('.language-list');
  const repo = list.dataset.repo;

  if (details.style.display === 'block') {
    details.style.display = 'none';
    return;
  } else {
    details.style.display = 'block';
  }

  if (list.dataset.loaded) return;

  fetch(`https://api.github.com/repos/${repo}/languages`)
    .then(res => res.json())
    .then(data => {
      const total = Object.values(data).reduce((a, b) => a + b, 0);
      list.innerHTML = '';
      for (let lang in data) {
        const percent = ((data[lang] / total) * 100).toFixed(1);
        list.innerHTML += `<li>${lang}: ${percent}%</li>`;
      }
      list.dataset.loaded = true;
    })
    .catch(() => {
      list.innerHTML = '<li>Could not load data.</li>';
    });
}