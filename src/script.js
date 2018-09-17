"use strict";

let timer = document.getElementById("display-time");
let sessionTime = document.getElementById("session-value");
let breakTime = document.getElementById("break-value");
let count;
let isBreak;
let titleTimer;
let isPause;
let started;
const styleSheetRuleAnimation = document.styleSheets[0].rules[19];
//  console.log(styleSheetRuleAnimation);

defaultSettings();

let timeLeft = parseInt(sessionTime.textContent) * 60;

const btn = (function(){
  const minusSession = document.getElementById("session-left");
  const addSession = document.getElementById("session-right");
  const minusBreak = document.getElementById("break-left");
  const addBreak = document .getElementById("break-right");

  function manageTime(action, displayTime, displayer){
    if (displayTime === true){
      return function(){
        if (started){
          return;
        }
        if (action === "minus"){
          if (displayer.textContent > 1){
            displayer.textContent--;
          }
        } else {
          if (displayer.textContent < 99){
            displayer.textContent++;
          }
        }
        timer.textContent = `${displayer.textContent}:00`
      }
    } else {
      return function(){
        if (started){
          return;
        }
        if (action === "minus"){
          if (displayer.textContent > 1){
            displayer.textContent--;
          }
        } else {
          if (displayer.textContent < 99){
            displayer.textContent++;
          }
        }
      }
    }
  }

  return {
    minusSession: minusSession,
    addSession : addSession,
    minusBreak: minusBreak,
    addBreak: addBreak,
    manageTime: manageTime
  }
})();

const minusSessionTime = btn.manageTime("minus", true, sessionTime);
const addSessionTime = btn.manageTime("add", true, sessionTime);
const minusBreakTime = btn.manageTime("minus", false, breakTime);
const addBreakTime = btn.manageTime("add", false, breakTime);

btn.minusSession.addEventListener("click", minusSessionTime);
btn.addSession.addEventListener("click", addSessionTime);
btn.minusBreak.addEventListener("click", minusBreakTime);
btn.addBreak.addEventListener("click", addBreakTime);

const controls = (function(){
  const reset = document.getElementById("control-reset");
  const start = document.getElementById("control-start");
  const pause = document.getElementById("control-pause");

  return {
    reset: reset,
    start: start,
    pause: pause
  }
})();

controls.reset.addEventListener("click", function(){
  const orbitPlanet = document.getElementById("orbit");
  orbitPlanet.classList.remove("timer__orbit--animation");
  styleSheetRuleAnimation.style.animationPlayState = '';
  clearInterval(count);
  defaultSettings();
  setText('Pause', 'control-pause');
  setText('Session', 'status-display');
})

controls.start.addEventListener("click", function(){
    const orbitPlanet = document.getElementById("orbit");

    let timeNow = parseInt(sessionTime.textContent) * 60;

    orbitPlanet.classList.add("timer__orbit--animation");
    styleSheetRuleAnimation.style.animationDuration = `${timeNow}s`;
    styleSheetRuleAnimation.style.animationPlayState = 'running';
    //  console.log(styleSheetRuleAnimation);

    if (!started){
      initialize();
      countDown(timeNow);
    } else {
      return;
    }
})

controls.pause.addEventListener("click", function(){
  if (!started){
    return;
  }

  if (!isPause){
    clearInterval(count);
    isPause = !isPause;
    setText('Resume', 'control-pause');
    styleSheetRuleAnimation.style.animationPlayState = 'paused';
  } else {
    countDown(timeLeft);
    setText('pause', 'control-pause');
    styleSheetRuleAnimation.style.animationPlayState = 'running';
    isPause = !isPause;
  }
})


function countDown(seconds){
  //  takes an input, multiplies by 1000 and adds to milliseconds of Date.now()
  //  subtracts milliseconds of Date.now() from the input
  //  calls displayTimer function on a 1000ms interval with subtracted input
  let now = Date.now();
  let then = now + seconds * 1000;
  let breakLength = parseInt(breakTime.textContent) * 60;
  const playSound = document.getElementById("play-bell");
  const orbitPlanet = document.getElementById("orbit");
  displayTimer(seconds);

  count = setInterval(function(){
    let timeNow = Math.round((then - Date.now())/1000);
    timeLeft = timeNow;
    //  console.log(timeNow);

    if (timeNow < 0 && isBreak){
      clearInterval(count);
      isBreak = !isBreak;
      setText('Break!','status-display');
      styleSheetRuleAnimation.style.animationPlayState = '';
      playSound.play();
      return countDown(breakLength);
    } 
    
    else if (timeNow < 0){
      clearInterval(count);
      setText('Session','status-display');
      titleTimer = !titleTimer;
      started = false;
      displayTimer(parseInt(sessionTime.textContent)*60);
      setText('Pomodoro Clock', 'pomodoro-title');
      orbitPlanet.classList.remove("timer__orbit--animation");
      playSound.play();
      //console.log(styleSheetRuleAnimation);
      return;
    }

    displayTimer(timeNow);
  },1000)
}

function displayTimer(seconds){
  //  sets timer with inputted seconds
  let minute = Math.floor(seconds / 60);
  let second = seconds % 60;
  let displayedTime;

  if (second < 10){
    displayedTime = `${minute}:0${second}`;
  } else {
    displayedTime = `${minute}:${second}`;
  }
  timer.textContent = displayedTime;
  if (!titleTimer){
    setText(`Pomodoro Clock ${displayedTime}`, 'pomodoro-title');
  }
}

function setText(text,location){
  const status = document.getElementById(location);
  status.textContent = text;
}

function initialize(){
  isBreak = true;
  titleTimer = false;
  isPause = false;
  started = true;
}

function defaultSettings(){
  isBreak = true;
  titleTimer = false;
  isPause = true;
  started = false;
  sessionTime.textContent = 25;
  breakTime.textContent = 5;
  timer.textContent = `${sessionTime.textContent}:00`;
}