import "./App.css";
import LabelComponent from "./LabelComponent.jsx";

function App() {
  const eventId = import.meta.env.VITE_EVENT_ID;

  return (
    <div className='app'>
      <LabelComponent eventId={eventId} />
    </div>
  );
}

export default App;
