import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const dataPickerEl = document.querySelector('#datetime-picker');
const btnStart = document.querySelector('[data-start]');
const timerEl = document.querySelector('.timer');

const currentDate = new Date();
btnStart.disabled = true;
let chooseDate;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0].getTime() <= currentDate.getTime()) {
      Notiflix.Notify.failure('Please choose a date in the future');
    } else {
      btnStart.disabled = false;
      chooseDate = selectedDates[0].getTime();
    }
  },
};
flatpickr(dataPickerEl, options);

const timer = {
  intervalId: null,

  start() {
    this.intervalId = setInterval(() => {
      const diff = chooseDate - new Date();

      if (diff <= 0) {
        this.stop();
        return;
      }
      const { days, hours, minutes, seconds } = this.convertMs(diff);

      document.querySelector('[data-days]').textContent = this.pad(days);
      document.querySelector('[data-hours]').textContent = this.pad(hours);
      document.querySelector('[data-minutes]').textContent = this.pad(minutes);
      document.querySelector('[data-seconds]').textContent = this.pad(seconds);
    }, 1000);
  },
  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  },
  stop() {
    clearInterval(this.intervalId);
  },

  pad(value) {
    return String(value).padStart(2, 0);
  },
};

btnStart.addEventListener('click', () => {
  timer.start();
});
