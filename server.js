const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3000;

// Cấu hình middleware
app.use(cors());
app.use(express.json());

let accessToken = '';
const tokenUrl = 'https://bx-oauth2.aasc.com.vn/bx/oauth2_token/local.66b0bbbfd33b41.13086674';
const employeeApiUrl = 'https://b24-837ka9.bitrix24.vn/rest/1/bcmxocc0cf65h7iw/user.get';

// Lấy token
async function fetchToken() {
  try {
    const response = await axios.get(tokenUrl);
    accessToken = response.data.token; // Lưu token
  } catch (error) {
    console.error('Error fetching token:', error);
  }
}

// Định nghĩa route
app.get('/api', async (req, res) => {
  // Đảm bảo token được cập nhật
  if (!accessToken) {
    await fetchToken();
  }
  
  try {
    const response = await axios.get(employeeApiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
