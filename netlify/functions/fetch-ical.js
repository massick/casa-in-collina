// Netlify Function to fetch and proxy iCal feeds
// This prevents CORS issues and allows you to keep your calendar URLs private

export async function handler(event) {
  const { source } = event.queryStringParameters || {};

  // Store your actual iCal URLs as environment variables in Netlify
  // For local testing, set BOOKING_ICAL_URL in .env file
  const icalUrls = {
    booking:
      process.env.BOOKING_ICAL_URL ||
      "https://ical.booking.com/v1/export?t=b9f91cab-3e50-4826-8fe2-671d3bdc533d",
  };

  const url = icalUrls[source];

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid source or URL not configured" }),
    };
  }

  try {
    const response = await fetch(url);
    const icalData = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/calendar",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
      body: icalData,
    };
  } catch (error) {
    console.error("Error fetching iCal:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch calendar data" }),
    };
  }
}
