import "./App.css";
import LabelComponent from "./LabelComponent.jsx";

function App() {
  const eventId = import.meta.env.VITE_EVENT_ID;
  return <LabelComponent eventId={eventId} />;
}

export default App;
