import { useState } from "react";
import {
  Inject,
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
  Week,
} from "@syncfusion/ej2-react-schedule";
import "@syncfusion/ej2-react-schedule/styles/material.css";
import { registerLicense } from "@syncfusion/ej2-base";
import { addSession, fetchSessions } from "../../services/fetchSessions";

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NCaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXZfcnVVQmFeU0d1WkI="
);

export default function Calendar({ sessions, setSessions, isLoggedIn, user }) {
  const [showPopup, setShowPopup] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const timeScale = { enable: true, interval: 120, slotCount: 2 };
  const data = sessions.map((session) => ({
    ...session,
    Subject: `${session.Username} ${session.UserLastName}`,
  }));

  const dodajTermin = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const calculateEndTime = () => {
    if (!time || !duration) return "";

    const [hours, minutes] = time.split(":").map(Number); // Split time into hours and minutes
    const durationHours = duration === "1 sat" ? 1 : 2;

    let newHours = hours + durationHours;

    // Adjust for overflow (e.g., 23:00 + 2 hours -> 01:00)
    if (newHours >= 24) newHours -= 24;

    // Format the result to HH:mm:ss
    const formattedEndTime = `${String(newHours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}`;

    return formattedEndTime;
  };

  const handleSubmit = async () => {
    const endTime = `${date}-${calculateEndTime()}`;
    const username = user[0];
    const userLastName = user[1];
    const StartTime = `${date}-${time}`;
    const newSession = {
      username,
      userLastName,
      StartTime,
      endTime,
    };
  
    if (date && time && duration) {
      try {
        await addSession(newSession); // Add session to the backend
        const updatedSessions = await fetchSessions(); // Fetch updated sessions
        setSessions(updatedSessions); // Update parent state
        closePopup(); // Close popup
      } catch (error) {
        console.error("Error adding session:", error);
      }
    }
  };
  

  return (
    <main className="flex flex-col justify-center items-center">
      {isLoggedIn ? (
        <button
          onClick={dodajTermin}
          className="my-5 px-4 py-2 bg-blue-500 text-white rounded w-full sm:w-auto"
        >
          Dodaj termin
        </button>
      ) : (
        ""
      )}

      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          style={{ zIndex: 1000 }}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-80"
            style={{ zIndex: 1001 }}
          >
            <h2 className="text-xl font-bold mb-4">Izaberi Datum i Vrijeme</h2>
            <label className="block mb-2">
              Datum:
              <input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>
            <label className="block mb-2">
              Vrijeme:
              <select
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="block w-full mt-1 p-2 border rounded"
              >
                <option value="">Select Time</option>
                {[...Array(24)].map((_, index) => (
                  <option
                    key={index}
                    value={`${String(index).padStart(2, "0")}:00`}
                  >
                    {`${String(index).padStart(2, "0")}:00`}
                  </option>
                ))}
              </select>
            </label>
            <fieldset className="mb-4">
              <legend className="block mb-2">Trajanje:</legend>
              <div>
                <input
                  type="radio"
                  name="trajanje"
                  id="1sat"
                  value="1 sat"
                  checked={duration === "1 sat"}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
                <label htmlFor="1sat" className="ml-2">
                  1 sat
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="trajanje"
                  id="2sata"
                  value="2 sata"
                  checked={duration === "2 sata"}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
                <label htmlFor="2sata" className="ml-2">
                  2 sata
                </label>
              </div>
            </fieldset>
            <button
              onClick={handleSubmit}
              disabled={!date || !time || !duration}
              className={`px-4 py-2 rounded mr-2 ${
                date && time && duration
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Spremi
            </button>
            <button
              onClick={closePopup}
              className="px-4 py-2 bg-gray-300 text-black rounded"
            >
              Odustani
            </button>
          </div>
        </div>
      )}

      <ScheduleComponent
        width="80%"
        // height="760px"
        height="100%"
        eventSettings={{ dataSource: data, allowAdding: false }}
        selectedDate={new Date()}
        startHour="06:00"
        endHour="24:00"
        timeScale={timeScale}
      >
        <ViewsDirective>
          <ViewDirective option="Week" />
        </ViewsDirective>
        <Inject services={[Week]} />
      </ScheduleComponent>
    </main>
  );
}
