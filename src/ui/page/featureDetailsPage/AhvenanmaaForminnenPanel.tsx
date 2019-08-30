import * as React from "react";
import { AhvenanmaaForminnenArgisFeature } from "../../../data";
import { FeatureCollapsePanel } from "./FeatureCollapsePanel";
import { Field } from "./Field";
import { AhvenanmaaRegeringenLink } from "./AhvenanmaaRegeringenLink";

interface Props {
  isOpen: boolean;
  onToggleOpen: () => void;
  feature: AhvenanmaaForminnenArgisFeature;
}

export const AhvenanmaaForminnenPanel: React.FC<Props> = ({
  isOpen,
  onToggleOpen,
  feature
}) => {
  return (
    <FeatureCollapsePanel
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
    >
      <form>
        <Field label="Nimi" value={feature.attributes.Namn} />
        <Field label="Kunta" value={feature.attributes.Kommun} />
        <Field label="Kylä" value={feature.attributes.By} />
        <Field label="Kuvaus" value={feature.attributes.Beskrivning} />
        <Field label="Sijainti" value={feature.attributes.Topografi} />
        <Field label="Tunniste" value={feature.attributes["Fornlämnings ID"]} />

        <AhvenanmaaRegeringenLink feature={feature} />
      </form>
    </FeatureCollapsePanel>
  );
};
