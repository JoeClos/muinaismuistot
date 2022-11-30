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
  const sparql =
    'SELECT%20%0A%20%20%20%3Fitem%20%0A%20%20%20%3FitemLabel%20%0A%20%20%20%3Frky_id%20%0A%20%20%20%28COALESCE%28%3Fcommonscat%2C%3Fpart_of_item_commonscat%2C%3Flocation_commonscat%2C%3Fadmin_commonscat%29%20AS%20%3Fcommonscat%29%20%0A%20%20%20%3Fimage%0A%20%20%20%3Fwikipedia_fi%0A%20%20%20%3Fwikipedia_en%0A%20%20%20%3Fwikipedia_sv%0A%20%20%20%3Fwikipedia_se%0A%20%20%20%3Fwikipedia_smn%0AWHERE%20%7B%0A%20%20%20%20%3Fitem%20wdt%3AP4009%20"1560"%20.%0A%20%20%20OPTIONAL%20%7B%20%3Fitem%20wdt%3AP18%20%3Fimage%20.%20%7D%20%20%0A%20%20%20OPTIONAL%20%7B%20%3Fitem%20wdt%3AP373%20%3Fcommonscat%20.%20%7D%0A%20%20%20OPTIONAL%20%7B%20%3Fitem%20wdt%3AP361%2Fwdt%3AP373%20%3Fpart_of_item_commonscat%20%7D%0A%20%20%20OPTIONAL%20%7B%20%3Fitem%20wdt%3AP276%2Fwdt%3AP373%20%3Flocation_commonscat%20%7D%0A%20%20%20OPTIONAL%20%7B%20%3Fitem%20wdt%3AP131%2Fwdt%3AP373%20%3Fadmin_commonscat%20%7D%20%20%20%20%0A%20%20%20OPTIONAL%20%7B%20%3Fwikipedia_fi%20schema%3AisPartOf%20<https%3A%2F%2Ffi.wikipedia.org%2F>%3B%20schema%3Aabout%20%3Fitem%3B%20%7D%20%20%0A%20%20%20OPTIONAL%20%7B%20%3Fwikipedia_en%20schema%3AisPartOf%20<https%3A%2F%2Fen.wikipedia.org%2F>%3B%20schema%3Aabout%20%3Fitem%3B%20%7D%20%20%20%0A%20%20%20OPTIONAL%20%7B%20%3Fwikipedia_sv%20schema%3AisPartOf%20<https%3A%2F%2Fsv.wikipedia.org%2F>%3B%20schema%3Aabout%20%3Fitem%3B%20%7D%20%20%20%20%0A%20%20%20OPTIONAL%20%7B%20%3Fwikipedia_sv%20schema%3AisPartOf%20<https%3A%2F%2Fse.wikipedia.org%2F>%3B%20schema%3Aabout%20%3Fitem%3B%20%7D%20%20%20%20%0A%20%20%20OPTIONAL%20%7B%20%3Fwikipedia_smn%20schema%3AisPartOf%20<https%3A%2F%2Fsmn.wikipedia.org%2F>%3B%20schema%3Aabout%20%3Fitem%3B%20%7D%20%20%20%20%0A%20%20%0A%20%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20"fi%2Cen".%20%7D%0A%7D%0ALIMIT%201'
  const [query, setQuery] = useState({ data: [] })
  const openWindow = (queryData: any) => {
    console.log("The query: ", queryData)
    const parameters = {
      title: "Special:UploadWizard",
      id: queryData.results.bindings[0].item.value.split('/')[4],
      descriptionlang: queryData.results.bindings[0].itemLabel["xml:lang"],
      description: queryData.results.bindings[0].itemLabel.value + " " + feature.attributes.url,
      categories: queryData.results.bindings[0].commonscat.value
    }
    const searchParams = new URLSearchParams(parameters).toString();
    window.open(
      `
    https://commons.wikimedia.beta.wmflabs.org/w/index.php?${searchParams}`,
      "_blank"
    )
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
        <button
          type="button"
          onClick={() => {
            axios
              .get(url + sparql.replace("1560", feature.attributes.ID))
              .then((response) => {
                setQuery(response.data)
                openWindow(response.data)
                console.log("Response :", response.data)
              })
              .catch((error) => {
                console.log(error)
              })
          }}
        >
          Save photo
        </button>
      </form>
    </ArgisFeatureCollapsePanel>
  )
}