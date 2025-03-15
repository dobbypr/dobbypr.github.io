// Blood splatter effect when clicking
document.addEventListener('click', function(e) {
    const blood = document.createElement('div');
    blood.className = 'blood';
    blood.style.left = (e.pageX - 50) + 'px';
    blood.style.top = (e.pageY - 50) + 'px';
    blood.style.width = '100px';
    blood.style.height = '100px';
    document.body.appendChild(blood);
    
    // Remove the blood splatter after animation completes
    setTimeout(() => {
        blood.remove();
    }, 1000);
});