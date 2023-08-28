import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

export const CountDown = forwardRef(({ targetTime, isGameOn, setIsInputDisabled , inputRef }, ref) => {
    const [elapsed, setElapsed] = useState('')
    const [intervalId, setIntervalId] = useState(null)
    const [isInputWasFocused, setIsInputWasFocused] = useState(false)
    useEffect(() => {

        function formatTime(milliseconds) {
            const minutes = Math.floor(milliseconds / (60 * 1000));
            const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);

            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');

            return `${formattedMinutes}:${formattedSeconds}`;
        }

        function updateTimer() {
            const now = Date.now();
            const timeDifference = targetTime - now;

            if (timeDifference > 0) {
                const countdown = formatTime(timeDifference);
                timerElement.textContent = countdown;
            } else if (timeDifference <= 0) {
                if(!isInputWasFocused){
                    inputRef.current.focus()
                    setIsInputWasFocused(true)
                }
                setIsInputDisabled(false)
                const elapsedTime = now - targetTime;
                const elapsed = formatTime(elapsedTime);
                setElapsed(elapsed)
                timerElement.textContent = `${elapsed}`;
            }
        }

        const timerElement = document.getElementById('countdown');
        updateTimer(); // Initial display
        const interval = setInterval(updateTimer, 1000);
        setIntervalId(interval)

    }, [targetTime])

    useEffect(() => {
        if (!isGameOn) {
            clearInterval(intervalId)
        }

    }, [isGameOn])

    useImperativeHandle(ref, () => ({
        elapsed,
    }));

    return (
        <div id="countdown"></div>
    )
})