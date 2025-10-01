export class Clock {
  constructor(container) {
    this.root = container;
    this.time = { hours: 3, minutes: 0 };
    this.dragging = null;
    this.highlightMode = 'none';
    this.build();
    this.bindEvents();
    this.setTime(3, 0);
  }

  build() {
    this.root.classList.add('clock');
    this.face = document.createElement('div');
    this.face.className = 'clock-face';
    this.root.append(this.face);

    this.ticksLayer = document.createElement('div');
    this.ticksLayer.className = 'clock-ticks';
    this.face.append(this.ticksLayer);
    for (let i = 0; i < 60; i += 1) {
      const tick = document.createElement('span');
      tick.className = `tick ${i % 5 === 0 ? 'tick-strong' : ''}`;
      tick.style.transform = `rotate(${i * 6}deg) translateY(-48%)`;
      this.ticksLayer.append(tick);
    }

    this.numberLayer = document.createElement('div');
    this.numberLayer.className = 'clock-number-layer';
    this.face.append(this.numberLayer);
    for (let n = 1; n <= 12; n += 1) {
      const node = document.createElement('div');
      node.className = 'clock-number';
      const span = document.createElement('span');
      span.textContent = n;
      const angle = n * 30;
      this.positionSpan(span, angle, 40);
      node.append(span);
      this.numberLayer.append(node);
    }

    this.minuteLayer = document.createElement('div');
    this.minuteLayer.className = 'clock-minute-layer';
    this.face.append(this.minuteLayer);
    for (let m = 5; m < 60; m += 5) {
      const node = document.createElement('div');
      node.className = 'clock-minute';
      const span = document.createElement('span');
      span.textContent = String(m).padStart(2, '0');
      this.positionSpan(span, m * 6, 52);
      node.append(span);
      this.minuteLayer.append(node);
    }

    this.hourHand = document.createElement('div');
    this.hourHand.className = 'clock-hand hour-hand';
    this.minuteHand = document.createElement('div');
    this.minuteHand.className = 'clock-hand minute-hand';
    this.face.append(this.hourHand, this.minuteHand);

    this.hourHandle = document.createElement('button');
    this.hourHandle.className = 'hand-handle hour-handle';
    this.hourHandle.type = 'button';
    this.hourHandle.setAttribute('aria-label', 'Adjust hour hand');
    this.minuteHandle = document.createElement('button');
    this.minuteHandle.className = 'hand-handle minute-handle';
    this.minuteHandle.type = 'button';
    this.minuteHandle.setAttribute('aria-label', 'Adjust minute hand');
    this.face.append(this.hourHandle, this.minuteHandle);

    this.center = document.createElement('div');
    this.center.className = 'clock-center';
    this.face.append(this.center);
  }

  positionSpan(span, angleDeg, radiusPercent) {
    const radians = (angleDeg - 90) * (Math.PI / 180);
    const cx = 50 + radiusPercent * Math.cos(radians);
    const cy = 50 + radiusPercent * Math.sin(radians);
    span.style.left = `${cx}%`;
    span.style.top = `${cy}%`;
  }

  bindEvents() {
    const startDrag = (type) => (event) => {
      event.preventDefault();
      this.dragging = type;
      event.target.setPointerCapture?.(event.pointerId);
      this.handlePointer(event);
    };

    const move = (event) => {
      if (!this.dragging) return;
      this.handlePointer(event);
    };

    const end = (event) => {
      if (!this.dragging) return;
      event.target.releasePointerCapture?.(event.pointerId);
      this.dragging = null;
      this.emit('dragend');
    };

    this.minuteHandle.addEventListener('pointerdown', startDrag('minute'));
    this.hourHandle.addEventListener('pointerdown', startDrag('hour'));
    this.minuteHandle.addEventListener('pointermove', move);
    this.hourHandle.addEventListener('pointermove', move);
    this.minuteHandle.addEventListener('pointerup', end);
    this.hourHandle.addEventListener('pointerup', end);
    this.minuteHandle.addEventListener('pointercancel', end);
    this.hourHandle.addEventListener('pointercancel', end);

    this.minuteHandle.addEventListener('keydown', (event) => this.handleKeyboard(event, 'minute'));
    this.hourHandle.addEventListener('keydown', (event) => this.handleKeyboard(event, 'hour'));
  }

  on(eventName, handler) {
    this.listeners = this.listeners || {};
    this.listeners[eventName] = this.listeners[eventName] || new Set();
    this.listeners[eventName].add(handler);
    return () => this.listeners[eventName].delete(handler);
  }

  emit(eventName, payload) {
    if (!this.listeners || !this.listeners[eventName]) return;
    this.listeners[eventName].forEach((handler) => handler(payload));
  }

  handlePointer(event) {
    const rect = this.face.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    const angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
    const normalizedAngle = (angle + 360) % 360;

    if (this.dragging === 'minute') {
      const minute = Math.round(normalizedAngle / 6) % 60;
      this.time.minutes = minute;
      this.emit('change', this.getTime());
    } else if (this.dragging === 'hour') {
      const rawHour = (normalizedAngle / 30 + 12) % 12;
      const hours = Math.floor(rawHour);
      const minute = Math.round((rawHour - hours) * 60);
      this.time.hours = hours;
      this.time.minutes = minute;
      this.emit('change', this.getTime());
    }
    this.render();
  }

  handleKeyboard(event, type) {
    const key = event.key;
    const step = event.shiftKey ? 5 : 1;
    if (['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(key)) {
      event.preventDefault();
      if (type === 'minute') {
        const delta = key === 'ArrowUp' || key === 'ArrowRight' ? step : -step;
        this.time.minutes = (this.time.minutes + delta + 60) % 60;
      } else {
        const delta = key === 'ArrowUp' || key === 'ArrowRight' ? step : -step;
        const total = ((this.time.hours % 12) * 60 + this.time.minutes + delta * 5 + 720) % 720;
        this.time.hours = Math.floor(total / 60);
        this.time.minutes = total % 60;
      }
      this.render();
      this.emit('change', this.getTime());
    }
  }

  setTime(hours, minutes) {
    this.time = {
      hours: ((hours % 12) + 12) % 12,
      minutes: ((minutes % 60) + 60) % 60
    };
    this.render();
  }

  getTime() {
    return { ...this.time };
  }

  getRoundedTime(step = 1) {
    const totalMinutes = (this.time.hours % 12) * 60 + this.time.minutes;
    const rounded = Math.round(totalMinutes / step) * step;
    return {
      hours: Math.floor(rounded / 60) % 12,
      minutes: rounded % 60
    };
  }

  render() {
    const { hours, minutes } = this.time;
    const hourAngle = ((hours % 12) + minutes / 60) * 30;
    const minuteAngle = minutes * 6;
    this.hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
    this.minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
    this.positionHandle(this.hourHandle, hourAngle, 28);
    this.positionHandle(this.minuteHandle, minuteAngle, 40);
  }

  positionHandle(handle, angleDeg, radiusPercent) {
    const radians = (angleDeg - 90) * (Math.PI / 180);
    const cx = 50 + radiusPercent * Math.cos(radians);
    const cy = 50 + radiusPercent * Math.sin(radians);
    handle.style.left = `${cx}%`;
    handle.style.top = `${cy}%`;
  }

  toggleMinuteNumbers(show) {
    this.root.classList.toggle('show-minutes', show);
  }

  setHighlight(mode) {
    this.highlightMode = mode;
    this.root.classList.toggle('is-highlight-hour', mode === 'hour');
    this.root.classList.toggle('is-highlight-minute', mode === 'minute');
  }

  setHighContrast(enabled) {
    this.root.classList.toggle('is-high-contrast', Boolean(enabled));
  }
}

export default Clock;
