import * as React from "react";
import { ArgisFeature } from "../../../data";
import {
  getFeatureID,
  getFeatureName,
  getFeatureTypeName,
  getFeatureTypeIconURL,
  getFeatureLocation
} from "../../../util/featureParser";
import { Page } from "../Page";
import { createLocationHash } from "../../../util/URLHashHelper";

interface Props {
  visible: boolean;
  hidePage: () => void;
  searchFeatures: (searchText: string) => void;
  searchResultFeatures?: Array<ArgisFeature>;
}

const ResultRow: React.FC<{ feature?: ArgisFeature }> = ({ feature }) => {
  const nimi = getFeatureName(feature);
  const tyypinNimi = getFeatureTypeName(feature);
  const iconURL = getFeatureTypeIconURL(feature);
  const coordinates = getFeatureLocation(feature);
  const locationHash = createLocationHash(coordinates);

  return (
    <a href={locationHash} className="list-group-item search-result-row">
      <h4 className="list-group-item-heading">{nimi}</h4>
      <p className="list-group-item-text">
        <img className="feature-icon" src={iconURL} />
        <span>{tyypinNimi}</span>
      </p>
    </a>
  );
};

const Results: React.FC<{ features?: Array<ArgisFeature> }> = ({
  features
}) => {
  if (!features) {
    return null;
  }
  return (
    <>
      <h5 id="search-result-header">
        <span>Hakutulokset</span>
        <small> ({features.length} kpl)</small>
      </h5>

      <div className="list-group">
        {features.map(f => (
          <ResultRow key={`${f.layerName}-${getFeatureID(f)}`} feature={f} />
        ))}
      </div>
    </>
  );
};

const ValidationError: React.FC = () => {
  return (
    <div className="alert alert-danger" role="alert">
      Hakusanan pitää olla vähintään kolme merkkiä
    </div>
  );
};

export const SearchPage: React.FC<Props> = ({
  visible,
  hidePage,
  searchFeatures,
  searchResultFeatures
}) => {
  const [searchText, setSearchText] = React.useState("");
  const [showSearchTextError, setShowSearchTextError] = React.useState(false);

  const onSearchClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (searchText.trim().length < 3) {
      setShowSearchTextError(true);
      return;
    }
    setShowSearchTextError(false);
    searchFeatures(searchText);
  };

  return (
    <Page title="Hae kohteita" visible={visible} hidePage={hidePage}>
      <form
        className={showSearchTextError ? "has-error" : undefined}
        onSubmit={onSearchClick}
      >
        {showSearchTextError && <ValidationError />}
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Kirjoita kohteen nimi tai sen osa"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <span className="input-group-btn">
            <button className="btn btn-default" type="submit">
              Hae
            </button>
          </span>
        </div>
      </form>

      <Results features={searchResultFeatures} />
    </Page>
  );
};
