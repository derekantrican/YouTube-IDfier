function extractYouTubeChannelId(pageHtml){
  var youtubeChannelIdRegex = /<link rel="canonical" href=".*(UC[^"&?\/\s]{22})">/g;
  var match = youtubeChannelIdRegex.exec(pageHtml);
  if (match !== undefined && match.length > 0)
    return match[1];

  return "";
}

document.getElementById("copyButton").addEventListener("click", copyId);

function copyId(){
  var copyText = document.getElementById("channelId");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  document.querySelector('#err').innerText = "Copied!";
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    var channelId = extractYouTubeChannelId(request.source);
    if (channelId !== undefined){
      document.querySelector('#channelId').value = extractYouTubeChannelId(request.source);
      err.innerText = "";
    }
    else
      err.innerText = 'Error';
  }
});

function onWindowLoad() {
  var err = document.querySelector('#err');

  chrome.tabs.executeScript(null, {
      file: "getPagesSource.js"
    }, function() {
      // If you try and inject into an extensions page or the webstore/NTP you'll get an error
      if (chrome.runtime.lastError)
        err.innerText = 'Error';

      return true;
  });
}

window.onload = onWindowLoad;
