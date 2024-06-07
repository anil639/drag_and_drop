document.addEventListener("DOMContentLoaded", function () {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const fileList = document.getElementById("fileList");
  const imageList = document.getElementById("imageList");
  const MAX_IMAGES = 5;

  //carousel
  let currentIndex = 0;
  const slides = document.querySelectorAll(".carousel-items");
  function showSlide(index) {
    slides[currentIndex].classList.remove("active");
    currentIndex = (index + slides.length) % slides.length;
    slides[currentIndex].classList.add("active");
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  setInterval(nextSlide, 3000);

  //Write the code of all the dropzone functionality here
  dropzone.addEventListener("dragover", function (event) {
    event.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", function () {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", function (event) {
    event.preventDefault();
    dropzone.classList.remove("dragover");

    const files = event.dataTransfer.files;
    console.log(files);
    const remainingSlots = MAX_IMAGES - imageList.children.length;

    if (remainingSlots <= 0) {
      alert("Maximum number of images reached.");
      return;
    }

    // Upload only up to the remaining available slots
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    filesToUpload.forEach((file) => {
      displayFile(file);
    });
  });
  //  event listener for file input
  fileInput.addEventListener("change", handleFileUpload);
  // Function to handle file upload
  function handleFileUpload(event) {
    const files = event.target.files;
    const remainingSlots = MAX_IMAGES - imageList.children.length;

    // number of uploaded images less to
    if (remainingSlots <= 0) {
      alert("Maximum number of images reached.");
      return;
    }

    // Upload only up to the remaining available slots
    Array.from(files)
      .slice(0, remainingSlots)
      .forEach((file) => {
        displayFile(file);
      });
  }

  function displayFile(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const li = document.createElement("li");
      li.className = "file-name";

      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = file.name;
      img.className = "thumbnail";
      li.appendChild(img);

      //Complete the function here
      const saveButton = document.createElement("button");
      saveButton.textContent = "Save";
      saveButton.className = "save-button";
      saveButton.addEventListener("click", function () {
        saveImageToLocal(img.src);
      });
      li.appendChild(saveButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete-button";
      deleteButton.addEventListener("click", function () {
        deleteImage(li, img.src);
      });
      li.appendChild(deleteButton);

      // Append the created li to the image list
      imageList.appendChild(li);
    };
    reader.readAsDataURL(file);
  }

  //Function to save image to local storage
  function saveImageToLocal(imageSrc) {
    const savedImages = JSON.parse(localStorage.getItem("savedImages")) || [];
    // Check if the image is already saved
    const isAlreadySaved = savedImages.some((image) => image.src === imageSrc);
    if (!isAlreadySaved) {
      // If the image is not already saved, add it to the array of saved images
      savedImages.push({ src: imageSrc });
      // Save the updated array back to local storage
      localStorage.setItem("savedImages", JSON.stringify(savedImages));
    }
  }

  //Function to delete image
  function deleteImage(liElement, imageSrc) {
    // Remove the corresponding image list item from the DOM
    liElement.remove();

    // Get existing saved images from local storage
    const savedImages = JSON.parse(localStorage.getItem("savedImages")) || [];

    // Find the index of the image to be deleted in the saved images array
    const index = savedImages.findIndex((image) => image.src === imageSrc);
    if (index !== -1) {
      // If the image is found, remove it from the array
      savedImages.splice(index, 1);
      // Save the updated array back to local storage
      localStorage.setItem("savedImages", JSON.stringify(savedImages));
    }
  }

  //Function to load the data from localStorage
  function loadFromLocalStorage() {
    const savedImages = JSON.parse(localStorage.getItem("savedImages")) || [];
    savedImages.forEach((image) => {
      const li = document.createElement("li");
      li.className = "file-name";

      const img = document.createElement("img");
      img.src = image.src;
      img.alt = "Saved Image";
      img.className = "thumbnail";
      li.appendChild(img);

      const saveButton = document.createElement("button");
      saveButton.textContent = "Save";
      saveButton.className = "save-button";
      saveButton.addEventListener("click", function () {
        saveImageToLocal(img.src);
      });
      li.appendChild(saveButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete-button";
      deleteButton.addEventListener("click", function () {
        deleteImage(li, img.src);
      });
      li.appendChild(deleteButton);

      // Append the created li to the image list
      imageList.appendChild(li);
    });
  }
  loadFromLocalStorage();
});
