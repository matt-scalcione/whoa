const siteUrl = "https://matt-scalcione.github.io/whoa/";

const copyUrlButton = document.getElementById("copyUrlButton");
const buildStamp = document.getElementById("buildStamp");

if (buildStamp) {
  buildStamp.textContent = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(buildStamp.dateTime || Date.now()));
}

if (copyUrlButton) {
  copyUrlButton.addEventListener("click", async () => {
    const fallback = () => {
      window.prompt("Copy the URL below.", siteUrl);
    };

    try {
      if (!navigator.clipboard?.writeText) {
        fallback();
        return;
      }

      await navigator.clipboard.writeText(siteUrl);
      copyUrlButton.textContent = "Copied URL";
      copyUrlButton.classList.add("copied");
      window.setTimeout(() => {
        copyUrlButton.textContent = "Copy site URL";
        copyUrlButton.classList.remove("copied");
      }, 1800);
    } catch {
      fallback();
    }
  });
}
