import axios from "axios";

let realtimeAPI: ReturnType<typeof axios.create> | null = null;

function getRealtimeAPI() {
  if (realtimeAPI) return realtimeAPI;

  const orgId = process.env.REALTIME_ORG_ID;
  const apiKey = process.env.REALTIME_API_KEY;

  if (!orgId || !apiKey) {
    throw new Error("REALTIME API is Missing");
  }

  const hashAPI = Buffer.from(`${orgId}:${apiKey}`).toString("base64");

  realtimeAPI = axios.create({
    baseURL: "https://api.realtime.cloudflare.com/v2",
    headers: {
      Authorization: `Basic ${hashAPI}`,
      "Content-Type": "application/json",
    },
  });

  return realtimeAPI;
}

export const createRealtimeMeeting = async (title: string) => {
  const api = getRealtimeAPI();
  return api.post("/meetings", { title });
};

export const addParticipantsInMeeting = async (
  meetingId: string,
  preset_name: string,
  clientSpecificId: string,
  name: string,
) => {
  const api = getRealtimeAPI();
  return api.post(`/meetings/${meetingId}/participants`, {
    name,
    preset_name,
    clientSpecificId,
  });
};
