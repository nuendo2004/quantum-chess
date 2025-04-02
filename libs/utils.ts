function formatSecondsToTime(totalSeconds: number | null | undefined): string {
  if (totalSeconds === null || totalSeconds === undefined || totalSeconds < 0) {
    return "N/A";
  }
  if (totalSeconds === 0) {
    return "0s";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let timeString = "";
  if (hours > 0) {
    timeString += `${hours}h `;
  }
  if (minutes > 0 || hours > 0) {
    timeString += `${
      hours > 0 ? minutes.toString().padStart(2, "0") : minutes
    }m `;
  }
  timeString += `${
    minutes > 0 || hours > 0 ? seconds.toString().padStart(2, "0") : seconds
  }s`;

  return timeString.trim();
}

export { formatSecondsToTime };
