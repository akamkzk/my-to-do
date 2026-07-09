/* ============================================
   手帐待办 — 日期时钟小部件
   ============================================ */

const Clock = {
  init() {
    this.update();
    setInterval(() => this.update(), 1000);
  },

  update() {
    const now = new Date();
    this.updateDate(now);
    this.updateAnalogClock(now);
    this.updateDigitalTime(now);
  },

  updateDate(now) {
    const el = document.getElementById('dateStamp');
    if (!el) return;
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const wd = getWeekdayName(now);
    el.textContent = `${y}年${m}月${d}日（${wd}）`;
  },

  updateAnalogClock(now) {
    const hourHand = document.getElementById('hourHand');
    const minuteHand = document.getElementById('minuteHand');
    if (!hourHand || !minuteHand) return;

    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();

    const hourDeg = (hours * 30) + (minutes * 0.5);
    const minuteDeg = minutes * 6;

    hourHand.style.transform = `rotate(${hourDeg}deg)`;
    minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
  },

  updateDigitalTime(now) {
    const el = document.getElementById('digitalTime');
    if (!el) return;
    el.textContent = formatDateTime(now.getTime());
  },
};
