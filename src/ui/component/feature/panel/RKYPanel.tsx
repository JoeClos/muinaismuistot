import React, { useState } from "react"


import {
  RKYPisteArgisFeature,
  RKYAlueArgisFeature,
  RKYViivaArgisFeature,
  MuseovirastoLayer,
  ModelFeatureProperties
} from "../../../../common/types"
import {
  ArgisFeatureCollapsePanel,
  FeatureTitleClickAction
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { MuseovirastoLink } from "../component/MuseovirastoLink"
import { EmbeddedModels } from "../component/EmbeddedModels"
import { useTranslation } from "react-i18next"
import axios from "axios"

interface Props {
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  feature: RKYPisteArgisFeature | RKYAlueArgisFeature | RKYViivaArgisFeature
}

export const RKYPanel: React.FC<Props> = ({
  titleClickAction,
  isOpen,
  onToggleOpen,
  feature
}) => {
  console.log(feature)
  const { t } = useTranslation()

  const url = "https://query.wikidata.org/sparql?format=json&query="
  const sparql = 'SELECT%20%3Fitem%20%3FitemLabel%20%3Fcommonscat%20WHERE%20%7B%0A%20%20%20%20%3Fitem%20wdt%3AP4009%20%221560%22%20.%0A%20%20%20%20%3Fitem%20wdt%3AP373%20%3Fcommonscat%20.%0A%20%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22fi%2Cen%22.%20%7D%0A%7D'
  const [query, setQuery] = useState({data : []})
  const openWindow = () => {
    window.open(`
    https://commons.wikimedia.beta.wmflabs.org/w/index.php?title=Special:UploadWizard ${query}`, '_blank')
  }
  
  return (
    <ArgisFeatureCollapsePanel
      titleClickAction={titleClickAction}
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
    >
      <form>
        <Field
          label={t(`details.field.featureName`)}
          value={feature.attributes.kohdenimi}
        />
        {feature.layerName === MuseovirastoLayer.RKY_alue && (
          <Field
            label={t(`details.field.name`)}
            value={feature.attributes.nimi}
          />
        )}
        <MuseovirastoLink feature={feature} />
        {isOpen && <EmbeddedModels models={feature.models} />}
        <button type="button" onClick={() => {
          axios
            .get(url + sparql.replace("1560",feature.attributes.ID))
            .then((response) => {
                setQuery(response.data) 
                console.log(response.data)      
    })
    .catch((error) => {
        console.log(error)
    });
    openWindow()
  }
        }>Save photo</button>
        
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
