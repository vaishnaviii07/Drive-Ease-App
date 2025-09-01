# Drive Ease App

## **Project Objective**
A full-stack MERN (MongoDB, Express, React, Node.js) application that allows users to browse, book, and manage vehicle rentals in real-time. Owners can list their cars, while users can book cars with live availability checks.

 ## **Features**
### For Users

-Browse available cars by location, type, and availability

-Check real-time car availability

-Book cars instantly

-View and manage bookings

### For Owners

-Add and manage listed cars

-View bookings related to owned cars

-Change booking status (approved, rejected, pending)

## **Tech Stack**

-Frontend: React, Tailwind CSS (or Bootstrap), Axios

-Backend: Node.js, Express.js

-Database: MongoDB (Mongoose ODM)

-Authentication: JWT (JSON Web Tokens)

-Deployment: Vercel (frontend), Render/Heroku (backend), MongoDB Atlas

## **Screenshots**

1.[Home Page](homepage.png)

2.[Cars Page](carspage.png)

3.[My Bookings Page](mybookings.png)

4.[Admin Dashboard](admin_dashboard.png)

## **Installation & Setup**

### 1.Clone the repository

git clone https://github.com/vaishnaviii07/Drive-Ease-App.git

### 2.Set up environment variables

Create a .env file in the backend folder with the following:

MONGO_URI=your_mongo_db_connection_string

JWT_SECRET=your_secret_key

PORT=5000

### 3.Install Dependencies (Download libraries/packages)

-Frontend

cd client

npm install

-Backend

cd server

npm install

### 4.Run the App in Terminal

-Run frontend

npm run dev

-Run backend

npm run server

### 5.Open in Browser
[Frontend](http://localhost:3000)

[Backend API](http://localhost:5000)

## **Conclusion**

This Drive Ease App makes the process of renting and managing cars seamless for both users and owners. With its clean interface, real-time booking system, and secure authentication, it provides a smooth rental experience. 





