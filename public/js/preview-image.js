import BASE_ROUTE from './env.js';
const getContentIdFromUrl = () => {
  const urlPattern = /\/admin\/contenu\/(\d+)\/edit/;
  const match = window.location.pathname.match(urlPattern);
  return match ? match[1] : null;
};

async function fetchContentData() {
  const contentId = getContentIdFromUrl();

  if (!contentId) {
    console.error("Impossible de récupérer l'ID du contenu depuis l'URL");
    return;
  }

  try {
    const response = await fetch(`${BASE_ROUTE}/api/contenus/${contentId}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const contentData = await response.json();
    //console.log('Données du contenu:', contentData);

    if (contentData.image_url) {
      //console.log('contentData.image_url', contentData.image_url);
      const inputImage = document.getElementById('Contenu_image_url_file');
      let previewContainer = document.getElementById('image-preview');

      if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.id = 'image-preview';
        previewContainer.style.marginTop = '10px';
        inputImage.closest('.field-image').appendChild(previewContainer);
      }

      previewContainer.innerHTML = '';
      const img = document.createElement('img');
      //console.log('contentData,', contentData);
      img.src = `${BASE_ROUTE}/images/${contentData.image_url}`;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      previewContainer.appendChild(img);
    }

    return contentData;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
  }
}
document.addEventListener('DOMContentLoaded', fetchContentData);

const inputImage = document.getElementById('Contenu_image_url_file');
if (inputImage) {
  inputImage.addEventListener('change', function (e) {
    console.log('change', e);
    const file = this.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = function (e) {
        let previewContainer = document.getElementById('image-preview');

        if (!previewContainer) {
          previewContainer = document.createElement('div');
          previewContainer.id = 'image-preview';
          previewContainer.style.marginTop = '10px';
          inputImage.closest('.field-image').appendChild(previewContainer);
        }
        previewContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        previewContainer.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });
}
