const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Path for local mock DB
const DB_FILE = path.join(__dirname, 'submissions.json');

// Local API to save data to a JSON file
app.post('/api/submit-local', (req, res) => {
  try {
    const data = req.body;
    data.timestamp = new Date().toISOString();

    let submissions = [];
    if (fs.existsSync(DB_FILE)) {
      const fileData = fs.readFileSync(DB_FILE, 'utf8');
      submissions = JSON.parse(fileData || '[]');
    }

    submissions.push(data);
    fs.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2), 'utf8');

    console.log('New submission saved locally:', data);
    res.json({ status: 'success', message: 'Saved to local database (submissions.json)' });
  } catch (error) {
    console.error('Error saving local submission:', error);
    res.status(500).json({ status: 'error', message: 'Failed to save locally: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
