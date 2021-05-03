import MainViewContainer from "../../containers/MainViewContainer";
import LocalizationWeather from "../../containers/LocalizationWeather";
import Clock from "../../components/Clock";

export default function MainView() {
  return (
    <div>
      <LocalizationWeather>
        {({ weatherData, geoData, icons }) => {
          return (
            <div>
              <h2>Your localization</h2>
              <Clock />
              <img alt="localization icon" src={icons?.pin} width={120} />
              <p>City: {weatherData.city}</p>
              <p>Region: {weatherData.state}</p>
              <p>Country: {weatherData.country}</p>
              <p>
                Time:{" "}
                {new Date(weatherData?.current?.weather?.ts).toLocaleString()}
              </p>
              <img alt="current weather icon" src={icons?.weather} width={80} />
              <img alt="temperature icon" src={icons?.temperature} width={80} />
              <p>Temperature: {weatherData?.current?.weather?.tp} C</p>
              <img alt="humidity icon" src={icons?.humidity} width={80} />
              <p>Air humidity: {weatherData?.current?.weather?.hu}%</p>
              <p>Air pressure: {weatherData?.current?.weather?.pr} hPa</p>
              <img alt="wind icon" src={icons?.wind} width={80} />
              <p>Wind speed: {weatherData?.current?.weather?.ws} m/s</p>
              <p>Wind direction: {weatherData?.current?.weather?.wd}</p>
              <img alt="air pollutuon icon" src={icons?.pollution} width={80} />
              <p>Air pollution: {weatherData?.current?.pollution?.aqius} AQI</p>
            </div>
          );
        }}
      </LocalizationWeather>
      <MainViewContainer />
    </div>
  );
}
