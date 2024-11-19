const videoURL = document
  .querySelector(".video-section")
  .getAttribute("data-video-url");
const videoDiv = document.getElementById("videoThumbnail");
// Extract the YouTube video ID based on common YouTube URL patterns
let videoID = null;
if (videoURL.includes("watch?v=")) {
  videoID = videoURL.split("watch?v=")[1].split("&")[0];
} else if (videoURL.includes("youtu.be/")) {
  videoID = videoURL.split("youtu.be/")[1].split("?")[0];
} else if (videoURL.includes("youtube.com/embed/")) {
  videoID = videoURL.split("embed/")[1].split("?")[0];
} else {
  videoID = "_9VUPq3SxOc"; // Default video ID
}
console.log("Video URL:", videoURL);
console.log("Extracted Video ID:", videoID);
// Set the thumbnail background image
if (videoID) {
  const thumbnailURL = `https://img.youtube.com/vi/${videoID}/hqdefault.jpg`;
  videoDiv.style.backgroundImage = `url('${thumbnailURL}')`;
}
const displayVideo = document.querySelector(".video-div");
displayVideo.addEventListener("click", function () {
  document.querySelector(".video-section-overlay").classList.add("is-active");
});
const iframe = document.getElementById("videoIframe");
const closeOverLay = document.querySelector(".video-section-overlay");
closeOverLay.addEventListener("click", function () {
  document
    .querySelector(".video-section-overlay")
    .classList.remove("is-active");
iframe.src = iframe.src;
});