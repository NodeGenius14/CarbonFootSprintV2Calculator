const btnCalculate = document.querySelector("#calculatedistance")
btnCalculateContent = document.querySelector("#calculatedistance div")
btnCalculate.addEventListener("click", () => 
{
	btnCalculateContent.classList.toggle("loading");

});

function resetCalculateBtn ()
{
	btnCalculateContent.classList.remove("loading");
}

