function selectOption(option) {
    const buttons = document.querySelectorAll('.travelMode button');
    buttons.forEach(button => button.classList.remove('selected'));
    buttons[option - 1].classList.add('selected');
}