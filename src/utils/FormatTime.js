
const FormatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}`;
}

export default FormatTime;
