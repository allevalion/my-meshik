const STORAGE_KEY = 'meshikSatiety';
function saveSatietyLevel(level) {
    localStorage.setItem(STORAGE_KEY, level);
}
function loadSatietyLevel() {
    const level = localStorage.getItem(STORAGE_KEY);
    return level ? parseInt(level) : 100;
}
function resetSatietyLevel() {
    localStorage.removeItem(STORAGE_KEY);
}