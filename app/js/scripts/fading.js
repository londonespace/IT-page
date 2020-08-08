async function fadeIn(item, duration) {
  await new Promise(resolve => {
    item.classList.remove('f-hidden');
    item.classList.add('f-visible');
    setTimeout(resolve, 20);
  });

  await new Promise(resolve => {
    item.classList.remove('f-transparent');
    item.classList.add('f-opaque');
    setTimeout(resolve, duration);
  });
}

async function fadeOut(item, duration) {
  await new Promise(resolve => {
    item.classList.remove('f-opaque');
    item.classList.add('f-transparent');
    setTimeout(resolve, duration);
  });

  await new Promise(resolve => {
    item.classList.remove('f-visible');
    item.classList.add('f-hidden');
    setTimeout(resolve);
  });
}