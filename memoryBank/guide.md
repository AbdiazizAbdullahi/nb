# Development Guide for Student Notice Board System Using Next.js and MongoDB

This guide outlines the steps to develop a simple, efficient Student Notice Board System using Next.js and MongoDB. The system will include user authentication, notice management, real-time updates, and a responsive design, meeting the core requirements without unnecessary complexity.

---

## Resources Used
- Next.js Documentation: [https://nextjs.org/docs](https://nextjs.org/docs)
- MongoDB Documentation: [https://docs.mongodb.com](https://docs.mongodb.com)
- JWT Documentation: [https://jwt.io](https://jwt.io)

## Step 1: Project Setup
- **Objective**: Initialize a Next.js project with necessary dependencies.
- **Steps**:
  - Create a new Next.js app by running `npx create-next-app student-notice-board`.
  - Navigate into the project folder: `cd student-notice-board`.
  - Install MongoDB driver: `npm install mongodb`.
  - Install JSON Web Tokens for authentication: `npm install jsonwebtoken`.
  - Optionally, install a CSS framework like Tailwind CSS for styling: `npm install -D tailwindcss` and set it up per its documentation.

---

## Step 2: Database Configuration
- **Objective**: Set up MongoDB to store user and notice data.
- **Steps**:
  - Sign up for MongoDB Atlas (free tier) and create a new cluster.
  - Obtain the connection string from MongoDB Atlas.
  - Create a `.env` file in the project root and add the connection string:
    ```
    MONGODB_URI=your_mongodb_connection_string
    ```
  - Add a `JWT_SECRET` for token generation in the `.env` file:
    ```
    JWT_SECRET=your_secret_key
    ```

---

## Step 3: Define Database Models
- **Objective**: Structure the data for users and notices.
- **Models**:
  - **Users**:
    - `id` (auto-generated)
    - `firstName` (string)
    - `lastName` (string)
    - `email` (string, unique)
    - `password` (string, hashed)
    - `isSuperAdmin` (boolean, default: false)
  - **Notices**:
    - `id` (auto-generated)
    - `title` (string)
    - `description` (string)
    - `startingDate` (date)
    - `endingDate` (date)
    - `userId` (reference to the user who posted it)

- **Note**: MongoDB's flexibility allows direct use of the driver, but schemas can be managed in code logic.

---

## Step 4: Implement User Authentication
- **Objective**: Enable registration and login functionality.
- **Steps**:
  - **Registration**:
    - Create an API route (e.g., `/api/auth/register`) to:
      - Accept `firstName`, `lastName`, `email`, and `password`.
      - Check if the email is unique in the database.
      - Hash the password before saving the user.
      - Return a success message.
  - **Login**:
    - Create an API route (e.g., `/api/auth/login`) to:
      - Accept `email` and `password`.
      - Verify credentials against the database.
      - Generate a JWT token upon success and return it.
  - Store the JWT on the client (e.g., local storage or cookies) for authenticated requests.

---

## Step 5: Build Notice Management API Routes
- **Objective**: Create endpoints for notice CRUD operations.
- **Routes**:
  - **GET /api/notices**: Fetch all notices from the database.
  - **GET /api/notices/[id]**: Fetch a specific notice by its ID.
  - **POST /api/notices**: Create a new notice (admin-only).
    - Accept `title`, `description`, `startingDate`, `endingDate`, and link it to the admin's `userId`.
  - **PUT /api/notices/[id]**: Update an existing notice (admin-only).
  - **DELETE /api/notices/[id]**: Delete a notice (admin-only).
- **Security**: For admin-only routes, verify the JWT and check if `isSuperAdmin` is true.

---

## Step 6: Design the Frontend
- **Objective**: Build a simple, responsive UI for users and admins.
- **Pages**:
  - **Home Page**:
    - Display a list of notices with `title`, `description`, and dates.
    - Include a navigation bar with links to login/register (if not logged in) or logout (if logged in).
    - Show an admin section (e.g., "Manage Notices") if the user is an admin.
  - **Login Page**:
    - Form with `email` and `password` fields and a "Login" button.
  - **Register Page**:
    - Form with `firstName`, `lastName`, `email`, and `password` fields and a "Register" button.
  - **Admin Dashboard** (optional separate page):
    - Form to create/edit notices and a list with edit/delete buttons for existing notices.
- **Styling**: Use Tailwind CSS or custom CSS for a clean, responsive layout.

---

## Step 7: Enable Real-time Updates
- **Objective**: Ensure students see the latest notices without manual refresh.
- **Approach**:
  - Use a simple polling mechanism:
    - On the home page, fetch notices every few seconds (e.g., 5-10 seconds) using a React `useEffect` hook.
  - Alternatively, explore Next.js's `getServerSideProps` for server-side updates, though this isn't truly real-time.

---

## Step 8: Ensure Responsiveness
- **Objective**: Make the app usable on desktop and mobile devices.
- **Steps**:
  - Use responsive design principles (e.g., flexible grids, media queries).
  - Test the UI on different screen sizes to confirm usability.
  - Leverage Tailwind CSS's responsive utilities (e.g., `sm:`, `md:`) if applicable.

---

## Step 9: Test the Application
- **Objective**: Verify all features work as expected.
- **Checklist**:
  - Registration and login work for students and admins.
  - Admins can create, update, and delete notices.
  - Students can view notices but not manage them.
  - Notices update periodically on the frontend.
  - UI adapts to different devices.
