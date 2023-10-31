//to top button
const button = document.getElementById('back-to-top-button');

button.addEventListener('click', () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
});

window.addEventListener('scroll', () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    button.style.display = 'block';
  } else {
    button.style.display = 'none';
  }
});
//searching
document.getElementById("search-button").addEventListener("click", function () {
  var searchQuery = document.getElementById("search-input").value.toLowerCase();
  var sections = document.querySelectorAll("section"); // Assuming you want to search within sections

  sections.forEach(function (section) {
    var sectionText = section.textContent.toLowerCase();
    if (sectionText.includes(searchQuery)) {
      section.style.display = "block"; // Show sections that match the search
    } else {
      section.style.display = "none"; // Hide sections that don't match
    }
  });
});
