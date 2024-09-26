

window.onload = function() {
    const loadingScreen = document.getElementsByClassName("loading-screen")[0];
    const numberOfStars = 10;
    const delayIncrement = 0.5;

    let baseDelay = 0;
    for(let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        let randomTopPosition = (Math.random() * 50);
        let randomTopEndPosition = (Math.random() * 50) + 50;
        let randomLeftPosition = Math.random() * (30 - (-10)) + (-10);
        let randomLeftEndPosition = (Math.random() * 30) + 70;
        console.log('star + 1')
        star.style.setProperty('--start-top', `${randomTopPosition}%`);
        star.style.setProperty('--end-top', `${randomTopEndPosition}%`);  
        star.style.setProperty('--start-left', `${randomLeftPosition}%`);
        star.style.setProperty('--end-left', `${randomLeftEndPosition}%`);

       
        baseDelay += delayIncrement;
       
        star.style.animationDelay = `${delayIncrement}s`;

        loadingScreen.appendChild(star);
    }



   
    


    const loadingTime = 5000;

    setTimeout(function() {
        document.getElementsByClassName('loading-screen')[0].style.display = none;
        document.querySelector('main').style.display = 'block';

    }, loadingTime);
};