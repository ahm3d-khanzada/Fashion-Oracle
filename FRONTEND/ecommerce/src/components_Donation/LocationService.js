// Geolocation Service for detecting user's city

// Get current position using browser's geolocation API
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        reject(error)
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    )
  })
}

// Get city name from coordinates using OpenStreetMap API (Free)
export const getCityFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
      {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent": "DonationApp/1.0",
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch location data")
    }

    const data = await response.json()
    console.log("Reverse Geocoding Response:", data)

    // Extract city with multiple fallbacks
    return (
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.municipality ||
      data.address.state_district ||
      data.address.county ||
      "Unknown"
    )
  } catch (error) {
    console.error("Error getting city:", error)
    return "Unknown"
  }
}

// Get user's city
export const getUserCity = async () => {
  try {
    const position = await getCurrentPosition()
// sourcery skip: inline-immediately-returned-variable
    const city = await getCityFromCoordinates(position.latitude, position.longitude)
    return city
  } catch (error) {
    console.error("Error getting user location:", error)
    return "Unknown"
  }
}

// Example: Detect user's city and log it
getUserCity().then((city) => console.log("Detected City:", city))

