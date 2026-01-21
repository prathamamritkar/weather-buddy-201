import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AQI_LABELS: Record<number, string> = {
  1: "Good",
  2: "Fair",
  3: "Moderate",
  4: "Poor",
  5: "Very Poor",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const city = url.searchParams.get("city");
    const lat = url.searchParams.get("lat");
    const lon = url.searchParams.get("lon");
    const units = url.searchParams.get("units") || "metric";

    // Either city or lat/lon must be provided
    if (!city && (!lat || !lon)) {
      console.error("Missing location parameter");
      return new Response(
        JSON.stringify({ error: "City or coordinates (lat/lon) are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("OPENWEATHER_API_KEY");
    if (!apiKey) {
      console.error("OPENWEATHER_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Weather service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build weather URL based on provided parameters
    let weatherUrl: string;
    if (lat && lon) {
      console.log(`Fetching weather for coordinates: ${lat}, ${lon}, units: ${units}`);
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    } else {
      console.log(`Fetching weather for city: ${city}, units: ${units}`);
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city!)}&units=${units}&appid=${apiKey}`;
    }
    
    const weatherRes = await fetch(weatherUrl);
    
    if (!weatherRes.ok) {
      const errorData = await weatherRes.json();
      console.error("Weather API error:", errorData);
      
      if (weatherRes.status === 404) {
        return new Response(
          JSON.stringify({ error: "Location not found. Please try again." }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to fetch weather data" }),
        { status: weatherRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const weatherData = await weatherRes.json();
    console.log(`Weather data received for ${weatherData.name}`);

    // Fetch AQI using coordinates from weather response
    const coordLat = weatherData.coord.lat;
    const coordLon = weatherData.coord.lon;
    const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coordLat}&lon=${coordLon}&appid=${apiKey}`;
    const aqiRes = await fetch(aqiUrl);
    
    let aqi = 1;
    let aqiLabel = "Good";
    
    if (aqiRes.ok) {
      const aqiData = await aqiRes.json();
      aqi = aqiData.list?.[0]?.main?.aqi || 1;
      aqiLabel = AQI_LABELS[aqi] || "Unknown";
      console.log(`AQI data received: ${aqi} (${aqiLabel})`);
    } else {
      console.warn("Failed to fetch AQI data, using default");
    }

    const response = {
      city: weatherData.name,
      country: weatherData.sys?.country,
      units,
      temperature: Math.round(weatherData.main.temp),
      feelsLike: Math.round(weatherData.main.feels_like),
      humidity: weatherData.main.humidity,
      aqi,
      aqiLabel,
      condition: weatherData.weather[0]?.main || "Unknown",
      description: weatherData.weather[0]?.description || "",
      icon: weatherData.weather[0]?.icon || "01d",
      lat: coordLat,
      lon: coordLon,
      wind: {
        speed: weatherData.wind?.speed || 0,
        deg: weatherData.wind?.deg || 0,
      },
      pressure: weatherData.main.pressure,
      visibility: weatherData.visibility,
      fetchedAt: new Date().toISOString(),
    };

    console.log(`Successfully processed weather for ${response.city}, ${response.country}`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
