import axios from "axios";

const orgId = process.env?.REALTIME_ORG_ID;
const apiKey = process.env?.REALTIME_API_KEY;
if (!orgId || !apiKey) throw new Error("REALTIME API is Missing");

const hashAPI = Buffer.from(`${orgId}:${apiKey}`).toString("base64");

const realtimeAPI = axios.create({
  baseURL: "https://api.realtime.cloudflare.com/v2",
  headers: { Authorization: `Basic ${hashAPI}` },
});

const createRealtimeMeeting = (title: string) => {
  return realtimeAPI.post("/meetings", { title });
};

const addParticipantsInMeeting = (
  meetingId: string,
  preset_name: string,
  clientSpecificId: string,
  name: string
) => {
  return realtimeAPI.post(`/meetings/${meetingId}/participants`, {
    name,
    preset_name,
    clientSpecificId,
  });
};

export { createRealtimeMeeting, addParticipantsInMeeting };
