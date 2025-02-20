# Node.js Backend API

This project provides a Node.js backend with authentication and applicant data processing functionalities. Below are the details of the available API routes, request formats, and setup instructions.

## Base URL
The API is hosted on Render:
```
https://nodejs-backend-5vgt.onrender.com
```

## API Routes

### 1. Health Check (Just to Check API Status)
**Endpoint:**
```
GET /just
```
**Description:** Checks if the API is up and running.

**Request:**
No request body is needed.

**Response:**
```json
{
  "message": "API is working!"
}
```

---

### 2. User Authentication
**Endpoint:**
```
POST /authenticate
```
**Description:** Authenticates a user and provides a JWT token.

**Request:**
```json
{
  "username":"naval.ravikant" , 
  "password" : "05111974"
}
```

**Response:**
```json
{
  "JWT": "your-jwt-token"
}
```

---

### 3. Enrich Applicant Data
**Endpoint:**
```
POST /applicant/enrich
```
**Description:** Extracts applicant details from raw text input using Gemini AI.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request:**
```json
{
  "raw_text": "John Doe has a Bachelor's in Computer Science from MIT and has worked at Google as a Software Engineer. He is skilled in JavaScript, Python, and AI development."
}
```

**Response:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "education": [{
    "degree": "Bachelor's",
    "branch": "Computer Science",
    "institution": "MIT",
    "year": 2020
  }],
  "experience": [{
    "job_title": "Software Engineer",
    "company": "Google",
    "start_date": "2021-06-01",
    "end_date": null
  }],
  "skills": ["JavaScript", "Python", "AI development"],
  "summary": "Experienced Software Engineer skilled in AI and web development."
}
```

---


### 4. Search Applicants
**Endpoint:**
```
POST /applicant/search
```
**Description:** Searches applicants based on criteria (e.g., name, skills, or experience).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe"
}
```

**Response:**
```json
[
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "skills": ["JavaScript", "Python"]
  }
]
```



---

## Setup Instructions

### 1. Clone the Repository
```
git clone <repo-url>
cd <repo-folder>
```

### 2. Install Dependencies
```
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file and add:
```
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
GEMINI_API_KEY=<your-gemini-api-key>
```

### 4. Start the Server
```
npm start
```

### 5. Test API using Postman or cURL
You can use tools like Postman or cURL to test the endpoints.

---

## Technologies Used
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Google Gemini AI
- Render (Deployment)

---
## Images 
For any issues or contributions, feel free to reach out!




## Contact
For any issues or contributions, feel free to reach out!

