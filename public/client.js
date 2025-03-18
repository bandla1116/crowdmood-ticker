const socket = io();

function submitMood() {
  const text = document.getElementById('moodInput').value;
  if (text) {
    fetch('/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    document.getElementById('moodInput').value = ''; // Clear input
  }
}

// Placeholder for chart (we’ll add this next)
const ctx = document.getElementById('moodChart').getContext('2d');
const moodChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [{
      label: 'Mood Count',
      data: [0, 0, 0],
      backgroundColor: ['#4caf50', '#f44336', '#ffeb3b']
    }]
  },
  options: { scales: { y: { beginAtZero: true } } }
});

socket.on('moodUpdate', (data) => {
  moodChart.data.datasets[0].data = [data.positive, data.negative, data.neutral];
  moodChart.update();
});