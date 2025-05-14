import flatpickr from "flatpickr";
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from "izitoast";
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;
let timerInterval = null;

const startButton = document.querySelector('[data-start]');
const datetimePicker = document.querySelector('#datetime-picker');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

startButton.disabled = true;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selected = selectedDates[0];
        if (selected <= new Date()) {
            iziToast.error({
                title: "Error",
                titleColor: '#FFFFFF',
                message: "Illegal operation",
                position: "topRight",
                titleSize: '16px',
                color: 'red',
                backgroundColor: '#EF4040',
                iconUrl: './img/bi_x-octagon.svg',
                messageColor: '#FFFFFF',
                messageSize: '16px',
                theme: 'dark'
            });
            startButton.disabled = true;
        } else {
            userSelectedDate = selected;
            startButton.disabled = false;
        }
    },
};

flatpickr(datetimePicker, options);

startButton.addEventListener('click', () => {
    if (!userSelectedDate) return;

    startButton.disabled = true;
    datetimePicker.disabled = true;

    timerInterval = setInterval(() => {
        const now = new Date();
        const delta = userSelectedDate - now;

        if (delta <= 0) {
            clearInterval(timerInterval);
            updateTimerDisplay(convertMs(0));
            datetimePicker.disabled = false;
            return;
        }

        updateTimerDisplay(convertMs(delta));
    }, 1000);
});

function updateTimerDisplay({ days, hours, minutes, seconds }) {
    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
