import React, { useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=895284fb2d2c50a520ea537456963d9c`;

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      axios.get(weatherApiUrl).then((response) => {
        if (response.data.cod === "404") {
          setErrorMessage("Location not found. Please enter a valid location.");
        } else {
          setData(response.data);
          setErrorMessage("");
        }
      });
      setLocation("");
    }
  };

  // const handleSubscription = () => {
  //   const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  //   if (isValidEmail) {
  //     const apiGatewayEndpoint =
  //       "https://xeh2qrfq5a.execute-api.us-east-1.amazonaws.com/weatheralert/"; // Replace with your actual API Gateway endpoint
  //     const dataToSend = { email, location };
  //     window.alert(
  //       "If you are not subscribe, confrim subscription to get location data"
  //     );

  //     axios
  //       .post(apiGatewayEndpoint, dataToSend)
  //       .then((response) => {
  //         if (response.status === 200) {
  //           // Call the second Lambda API here
  //           const secondLambdaEndpoint =
  //             "https://jkg0k8a4j6.execute-api.us-east-1.amazonaws.com/sendAlert/"; // Replace with the URL of the second Lambda API
  //           axios
  //             .post(secondLambdaEndpoint, dataToSend)
  //             .then((response) => {
  //               if (response.status === 200) {
  //                 // Success
  //               } else {
  //                 // Handle API call to the second Lambda failed
  //               }
  //             })
  //             .catch((error) => {
  //               // Handle API call error to the second Lambda
  //               console.error(error);
  //             });

  //           setIsSubscribed(true);
  //           setErrorMessage("");
  //         }
  //       })
  //       .catch((error) => {
  //         setIsSubscribed(false);
  //         setErrorMessage("An error occurred. Please try again");
  //         console.log(error);
  //       });
  //   } else {
  //     // Handle invalid email address
  //     setIsSubscribed(false);
  //     setErrorMessage("Please enter a valid email address.");
  //     window.location.reload();
  //   }
  // };

  const handleSubscription = () => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (isValidEmail) {
      const apiGatewayEndpoint =
        "https://xeh2qrfq5a.execute-api.us-east-1.amazonaws.com/weatheralert/"; // Replace with your actual API Gateway endpoint
      const dataToSend = { email, location };
      window.alert(
        "If you are not subscribe, confrim subscription to get location data"
      );

      axios
        .post(apiGatewayEndpoint, dataToSend)
        .then((response) => {
          if (response.status === 200) {
            // Call the second Lambda API here
            const secondLambdaEndpoint =
              "https://jkg0k8a4j6.execute-api.us-east-1.amazonaws.com/sendAlert/"; // Replace with the URL of the second Lambda API
            axios
              .post(secondLambdaEndpoint, dataToSend)
              .then((response) => {
                if (response.status === 200) {
                  // Success
                } else {
                  // Handle API call to the second Lambda failed
                }
              })
              .catch((error) => {
                // Handle API call error to the second Lambda
                console.error(error);
              });

            setIsSubscribed(true);
            setErrorMessage("");
            setEmail(""); // Clear email input field
            setLocation(""); // Clear location input field
          }
        })
        .catch((error) => {
          setIsSubscribed(false);
          setErrorMessage("An error occurred. Please try again");
          console.log(error);
          setEmail(""); // Clear email input field
          setLocation(""); // Clear location input field
        });
    } else {
      // Handle invalid email address
      setIsSubscribed(false);
      setErrorMessage("Please enter a valid email address.");
      setEmail(""); // Clear email input field
      setLocation(""); // Clear location input field
    }
  };

  return (
    <div className="app">
      <center>
        <h2>Welcome to Weather Alert App</h2>
      </center>
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {data.name !== undefined && (
          <div className="bottom">
            <div className="feels">
              {data.main ? (
                <p className="bold">{data.main.feels_like.toFixed()}°F</p>
              ) : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? (
                <p className="bold">{data.wind.speed.toFixed()} MPH</p>
              ) : null}
              <p>Wind Speed</p>
            </div>
          </div>
        )}

        <div className="bottom">
          <div className="subscription">
            <h3>Get Information and Get Subscribed</h3>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {!isSubscribed && (
              <div>
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleSubscription}>
                  Subscribe To Alerts
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
