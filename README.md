## Installation

1. **Clone the Repository:**

   - Clone the repository containing the React Label Component and proxy server code to your local machine.

2. **Install Dependencies:**

   - Navigate to the **root directory** of the project in your terminal.
   - Run `npm install` (or `yarn install`) to install the required dependencies.

3. **Set Up Environment Variables (.env):**

   - Create a file named `.env` **in the root directory** (the same level as server.js).
   - Add the following lines to the `.env` file, replacing the placeholders with your actual credentials:

     ```
     USER_ACCESS_TOKEN=your_user_access_token
     API_KEY=your_api_key
     VITE_EVENT_ID=your_event_id
     VITE_BACKEND=Server_base_url
     ```

### Directory Structure:

project-root/
├── LabelComponent.jsx
├── server.js
└── .env

##### Start the Proxy Server:

- In the **root directory** in another terminal window.

- Run npm run start:server to start the proxy server. It should be running at http://localhost:3000.

##### Start the React App:

- In the **root directory** in another terminal window.

- Run npm run dev (or yarn dev) to start the development server. Your React app should be accessible at http://localhost:5173

## Test the Component:

1. Open the React app in your browser.
2. The label component should now function correctly, fetching labels from the Uitdatabank API via the proxy server and allowing you to add and remove labels to the specified event.

# component Functionality

- As a user, I can see a suggestion list of existing labels based on the input value.
- As a user, I am able to add existing labels to my event.
- As a user, I am able to add new labels to my event.
- As a user, I can see which labels have been added to my event.
- As a user, I can delete labels from my event.

## Additional Notes

- Hardcoded eventId:
  - For this technical test, the event ID is hardcoded in the proxy server to simplify the setup and focus on the front-end implementation.
  - This is suitable because we are working with only a single event.
- Production Environments:
  - In a production environment with multiple events, it would be more appropriate to:
    - Pass the event ID dynamically from the frontend
    - Use a more robust backend solution to manage event data.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
