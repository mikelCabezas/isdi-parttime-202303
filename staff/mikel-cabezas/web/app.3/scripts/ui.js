function deleteClassOnContainer(container, ...classToDelete) {
    container.classList.remove(...classToDelete);
} 

function addClassOnContainer(container, ...classToAdd) {
    container.classList.add(...classToAdd)    
}

function changeMessageOnContainer(container, message, messageType) {
    container.innerHTML = message;
    container.classList.add(messageType);

}
function clearMessageContainer(container) {
    container.classList.remove('success');
    container.classList.remove('error');
    container.innerHTML = '';
} 
function toggleOffClassInSection(...containers) {
    for(var i = 0; i < containers.length; i++)  
        containers[i].classList.toggle('off')
}

function showHidePassword (container, passwordContainer) {
    var icon = container.querySelector(passwordContainer + '> i')
    
    if(icon.classList.contains('uil-eye')) {
        icon.classList.add('uil-eye-slash')
        icon.classList.remove('uil-eye')
        icon.parentElement.querySelector(passwordContainer + '> input').removeAttribute('type', 'password')
        return
    }
    if(icon.classList.contains('uil-eye-slash')) {
        icon.classList.add('uil-eye')
        icon.classList.remove('uil-eye-slash')
        icon.parentElement.querySelector(passwordContainer + '> input').setAttribute('type', 'password')
        return
    }
}