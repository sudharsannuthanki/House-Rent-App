# HouseRent — MERN Property Rental & Sale App

A simple full-stack app where **Owners** list properties, **Renters/Buyers** browse and request bookings, **Owners** approve or reject those requests, and **Admins** oversee everything.


## Tech Stack
- **Frontend:** React (Vite), React Router, plain `fetch`
- **Backend:** Node.js, Express (ES modules), Mongoose, JWT auth, Multer (image uploads), bcryptjs

## Setup
### 1. Configure the backend

cd server
Open `.env` and fill in:

MONGO_URI=mongodb://localhost:27017/HouseRent
JWT_SECRET=any_long_random_string
PORT=8000


### 2. Run both servers with one command
From the project root:

npm run dev

This starts the backend (`http://localhost:8000`) and frontend (`http://localhost:5173`) together. The frontend's Vite dev server proxies any `/api` and `/uploads` request straight to the backend.

### 3. Create the first admin account
Registration only lets people sign up as Owner or Renter, so the first Admin has to be seeded once:

cd server
npm run seed:admin -- "Admin Name" admin@houserent.com StrongPass123


Open **http://localhost:5173**, register a Renter and an Owner, and log in as Admin with the seeded credentials.



## Project Structure

houserent/
  package.json              # root: install:all / dev (runs both servers together)

  server/
    src/
      config/db.js            # MongoDB connection
      models/                 # User.js, Property.js, Booking.js
      middleware/             # auth.js (JWT + roles), upload.js (multer)
      routes/                 # userRoutes.js, ownerRoutes.js, adminRoutes.js
      utils/seedAdmin.js
      server.js                # entry point
    uploads/                   # stored property images (served at /uploads/*)

  client/
    src/
      modules/
        common/                # Home, Login, Register, ForgotPassword, Toast
        user/
          owner/                # OwnerHome, AddProperty, AllProperties, AllBookings
          renter/                # RenterHome, AllProperties
          AllPropertiesCards.jsx  # shared property card
          PropertyDetails.jsx     # shared detail + booking form
        admin/                 # AdminHome, AllUsers, AllProperty, AllBookings
      components/              # Navbar, ProtectedRoute
      api.js                    # every backend call, plain fetch
      auth.js                    # localStorage helpers (token/user)
      App.jsx                    # all routes



## How it works
- **Renter/Buyer:** browse & search properties → request a booking (rent needs dates; sale is a purchase request) → track status in **My Bookings** → cancel if needed.
- **Owner:** add/delete properties with images → see requests in **Booking Requests** → **Approve** or **Reject** each one.
- **Admin:** read-only dashboard — stats, all users (with activate/deactivate), all properties, all bookings.
- **Forgot password:** no email needed — enter your email, answer your security question (set at registration), set a new password.

## API Reference
| Method | Route | Who |
|---|---|---|
| POST | /api/user/register, /login | Anyone |
| POST | /api/user/forgot-password/verify, /reset | Anyone |
| GET | /api/user/properties, /properties/:id | Anyone |
| POST | /api/user/bookings | Renter |
| GET | /api/user/bookings/mine | Renter |
| PATCH | /api/user/bookings/:id/cancel | Renter |
| POST/GET/PUT/DELETE | /api/owner/properties(/:id) | Owner |
| GET | /api/owner/bookings | Owner |
| PATCH | /api/owner/bookings/:id/status | Owner |
| GET | /api/admin/stats, /users, /properties, /bookings | Admin |
| PATCH | /api/admin/users/:id/toggle-status | Admin |

## Testing checklist
1. Register a Renter and an Owner.
2. As Owner: add a rent property and a sale property (with images).
3. As Renter: browse, filter by city/type, open a listing, submit a booking request.
4. As Owner: approve one request, reject another.
5. As Renter: confirm status updates in **My Bookings**, cancel one.
6. Seed and log in as Admin: check stats, deactivate a user, view all properties/bookings.
7. Try **Forgot Password** end-to-end.

