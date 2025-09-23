const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const LOCK_DURATION_MS = 60 * 1000; 

const seats = {};
const NUM_SEATS = 5; 
for (let i = 1; i <= NUM_SEATS; i++) {
  seats[String(i)] = {
    status: 'available', 
    lockTimestamp: null,
    lockTimerId: null
  };
}

class KeyedMutex {
  constructor() {
    this.queues = new Map();
  }

  async acquire(key) {
    const prev = this.queues.get(key) || Promise.resolve();
    let releaseNext;
    const willLock = new Promise((resolve) => (releaseNext = resolve));
    this.queues.set(key, prev.then(() => willLock));
    await prev;
    return () => {
      releaseNext();
      if (this.queues.get(key) === willLock) {
        this.queues.delete(key);
      }
    };
  }
}

const mutex = new KeyedMutex();

function isLockExpired(seat) {
  if (!seat.lockTimestamp) return false;
  return Date.now() - seat.lockTimestamp > LOCK_DURATION_MS;
}

app.get('/seats', (req, res) => {
  const out = {};
  for (const id of Object.keys(seats)) {
    const s = seats[id];
    if (s.status === 'locked' && isLockExpired(s)) {
      out[id] = { status: 'available (lock expired)' };
    } else {
      out[id] = { status: s.status };
    }
  }
  return res.json(out);
});

app.post('/lock/:id', async (req, res) => {
  const id = String(req.params.id);
  if (!seats[id]) return res.status(404).json({ message: 'Seat not found' });

  const release = await mutex.acquire(id);
  try {
    const seat = seats[id];
    if (seat.status === 'booked') {
      return res.status(400).json({ message: 'Seat already booked' });
    }

    if (seat.status === 'locked' && isLockExpired(seat)) {
      if (seat.lockTimerId) clearTimeout(seat.lockTimerId);
      seat.status = 'available';
      seat.lockTimestamp = null;
      seat.lockTimerId = null;
    }

    if (seat.status === 'locked') {
      return res.status(400).json({ message: 'Seat already locked. Try again later.' });
    }

    seat.status = 'locked';
    seat.lockTimestamp = Date.now();

    const currentLockTimestamp = seat.lockTimestamp;
    seat.lockTimerId = setTimeout(() => {
      if (seat.status === 'locked' && seat.lockTimestamp === currentLockTimestamp) {
        seat.status = 'available';
        seat.lockTimestamp = null;
        seat.lockTimerId = null;
        console.log(`Auto-released seat ${id} after timeout`);
      }
    }, LOCK_DURATION_MS);

    return res.json({ message: `Seat ${id} locked successfully. Confirm within ${LOCK_DURATION_MS / 1000} seconds.` });
  } finally {
    release();
  }
});

app.post('/confirm/:id', async (req, res) => {
  const id = String(req.params.id);
  if (!seats[id]) return res.status(404).json({ message: 'Seat not found' });

  const release = await mutex.acquire(id);
  try {
    const seat = seats[id];

    if (seat.status !== 'locked') {
      return res.status(400).json({ message: 'Seat is not locked and cannot be booked' });
    }

    if (isLockExpired(seat)) {
      if (seat.lockTimerId) clearTimeout(seat.lockTimerId);
      seat.status = 'available';
      seat.lockTimestamp = null;
      seat.lockTimerId = null;
      return res.status(400).json({ message: 'Lock expired. Please lock the seat again.' });
    }

    if (seat.lockTimerId) {
      clearTimeout(seat.lockTimerId);
      seat.lockTimerId = null;
    }
    seat.status = 'booked';
    seat.lockTimestamp = null;

    return res.json({ message: `Seat ${id} booked successfully!` });
  } finally {
    release();
  }
});

app.post('/release/:id', async (req, res) => {
  const id = String(req.params.id);
  if (!seats[id]) return res.status(404).json({ message: 'Seat not found' });

  const release = await mutex.acquire(id);
  try {
    const seat = seats[id];
    if (seat.status !== 'locked') {
      return res.status(400).json({ message: 'Seat is not locked' });
    }
    if (seat.lockTimerId) clearTimeout(seat.lockTimerId);
    seat.status = 'available';
    seat.lockTimestamp = null;
    seat.lockTimerId = null;
    return res.json({ message: `Seat ${id} released` });
  } finally {
    release();
  }
});

app.listen(PORT, () => {
  console.log(`Seat booking server running at http://localhost:${PORT}`);
});
