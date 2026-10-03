const root = document.querySelector(".homeSoundtrack");
const audio = root?.querySelector("#home-soundtrack-audio");
const source = audio?.dataset.audioSrc;
const playButton = root?.querySelector("[data-home-audio-play]");
const stopButton = root?.querySelector("[data-home-audio-stop]");
const muteButton = root?.querySelector("[data-home-audio-mute]");
const status = root?.querySelector("[data-home-audio-status]");

if (root && audio && source && playButton && stopButton && muteButton && status) {
  let loaded = false;
  const setStatus = (key) => {
    const messages = {
      ready: playButton.dataset.statusReady ?? "Press Play to listen.",
      playing: playButton.dataset.statusPlaying ?? "Playing.",
      paused: playButton.dataset.statusPaused ?? "Paused.",
      stopped: playButton.dataset.statusStopped ?? "Stopped.",
      error: playButton.dataset.statusError ?? "This track could not be played right now.",
    };
    status.textContent = messages[key];
  };
  const loadSource = () => {
    if (loaded) return;
    audio.src = source;
    audio.load();
    loaded = true;
  };
  const updatePlayButton = () => {
    const playing = !audio.paused;
    playButton.textContent = playing ? (playButton.dataset.labelPause ?? "Pause soundtrack") : (playButton.dataset.labelPlay ?? "Play soundtrack");
    playButton.setAttribute("aria-label", playButton.textContent);
  };

  playButton.addEventListener("click", async () => {
    if (audio.paused) {
      loadSource();
      try {
        await audio.play();
      } catch {
        setStatus("error");
      }
    } else {
      audio.pause();
    }
  });
  stopButton.addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;
    updatePlayButton();
    setStatus("stopped");
  });
  muteButton.addEventListener("click", () => {
    audio.muted = !audio.muted;
    const label = audio.muted ? (muteButton.dataset.labelUnmute ?? "Unmute") : (muteButton.dataset.labelMute ?? "Mute");
    muteButton.textContent = label;
    muteButton.setAttribute("aria-label", label);
    muteButton.setAttribute("aria-pressed", String(audio.muted));
  });
  audio.addEventListener("play", () => { updatePlayButton(); setStatus("playing"); });
  audio.addEventListener("pause", () => { updatePlayButton(); if (audio.currentTime > 0 && !audio.ended) setStatus("paused"); });
  audio.addEventListener("ended", () => { updatePlayButton(); setStatus("stopped"); });
  audio.addEventListener("error", () => { updatePlayButton(); setStatus("error"); });
}
