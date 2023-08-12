/**
 * Download a text content as a file, using a dynamically generated link tag to
 * emulate the behaviour of clicking onto a downloadable link element in DOM.
 */
export function downloadFile(fileName: string, textContent: string) {
  const linkTagForDownload = document.createElement("a");
  linkTagForDownload.download = fileName;
  linkTagForDownload.href = window.URL.createObjectURL(
    new Blob([textContent], { type: "text/plain" })
  );
  linkTagForDownload.onclick = () =>
    // `revokeObjectURL` needs a delay to work properly
    setTimeout(() => window.URL.revokeObjectURL(linkTagForDownload.href), 3000);

  linkTagForDownload.click();
  linkTagForDownload.remove();
}
