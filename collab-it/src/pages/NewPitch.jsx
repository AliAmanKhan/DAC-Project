import React from "react";
import CreatePitch from "../components/CreatePitch";
import NewCreatePitch from "../components/NewCreatePitch";

export default function NewPitch() {
  const currentUser = {
    id: "user_123",
    name: "Ali Aman",
    avatar: "https://ui-avatars.com/api/?name=Ali+Aman",
  };
  const handlePitchCreate = (pitch) => {
    console.log("New pitch:", pitch);
    // setPitches((prev) => [pitch, ...prev]);
  };
  return <NewCreatePitch currentUser={currentUser} onCreate={handlePitchCreate} />;
}
