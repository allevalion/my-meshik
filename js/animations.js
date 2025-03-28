function playFeedAnimation() {
    gsap.to("#catImage", { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });
}
function playSadAnimation() {
    gsap.to("#catImage", { rotation: 5, duration: 0.1, yoyo: true, repeat: 5 });
}
function playHappyAnimation() {
    gsap.to("#catImage", { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
}
function animateAchievementCard(cardElement, callback) {
    gsap.to(cardElement, { y: -200, opacity: 0, duration: 1, onComplete: callback });
}