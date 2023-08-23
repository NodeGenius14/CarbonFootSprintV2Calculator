

// Access the dropdown elements
const dropdownBtn = document.querySelector(".dropdown-btn");
const dropdownContent = document.querySelector(".dropdown-content");

// Toggle the dropdown content on button click
dropdownBtn.addEventListener("click", function() {
  dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
});

// Handle option click
const options = document.querySelectorAll(".dropdown-content a");
options.forEach(option => {
  option.addEventListener("click", function(e) {
	e.preventDefault();
	const selectedValue = option.getAttribute("value");
	console.log("Selected country:", selectedValue);
	dropdownBtn.textContent = option.textContent;
	dropdownContent.style.display = "none";
  });
});