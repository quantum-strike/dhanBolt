import TinyGesture from './TinyGesture.js';
const target = document.getElementById('player');
const gesture = new TinyGesture(target);

const target3 = document.getElementById('queue');
const gesture3 = new TinyGesture(target3);
  gesture3.on('pinch', (event) => {
    if (gesture.scale < 1) {
        document.getElementById('queue').style.display = 'none'

    } ;
  });

gesture.on('swipedown', (event) => {
  // The gesture was a downward swipe.
  document.getElementById('player').style.display = 'none'
  document.getElementById('dis').style.display = 'block'

});

function checkSwipe() {
    const gesture2 = new TinyGesture(document.getElementById('swipeSection'));
    gesture2.on('swiperight', (event) => {
        triggerNextTrack()
    });
    gesture2.on('swipeleft', (event) => {
        triggerPrevTrack()
    });
    gesture2.on('doubletap', (event) => {
        triggerShuffleTrack()
      });
      gesture2.on('longpress', (event) => {
        triggerLoopTrack()
      });
      gesture2.on('swipeup', (event) => {
        triggerQueueVisibility()
      });
  }


  function triggerNextTrack() {
    const event = new CustomEvent('nextTrack');
    window.dispatchEvent(event);}

    function triggerPrevTrack() {
        const event = new CustomEvent('prevTrack');
        window.dispatchEvent(event);}
    function triggerShuffleTrack() {
        const event = new CustomEvent('ShuffleList');
        window.dispatchEvent(event);}
    function triggerLoopTrack() {
        const event = new CustomEvent('loopList');
        window.dispatchEvent(event);}
    function triggerQueueVisibility() {
        const event = new CustomEvent('queueToggle');
        window.dispatchEvent(event);}


checkSwipe()