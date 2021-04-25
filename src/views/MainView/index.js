import MainViewContainer from "../../containers/MainViewContainer";

export default function MainView() {
  const renderContent = ({ locality, region, country, coordinates }) => {
    return (
      <div>
        {locality} {region} {country} {coordinates?.lat} {coordinates?.lon}
      </div>
    );
  };

  return <MainViewContainer>{renderContent}</MainViewContainer>;
}
