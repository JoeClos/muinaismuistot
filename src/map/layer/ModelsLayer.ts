import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Stroke from "ol/style/Stroke";
import Circle from "ol/style/Circle";
import RegularShape from "ol/style/RegularShape";
import Style from "ol/style/Style";
import GeoJSON from "ol/format/GeoJSON";
import { GeoJSONResponse, Model, MuseovirastoLayer } from "../../common/types";
import { FeatureLike } from "ol/Feature";
import { getGeoJSONDataLatestUpdateDate } from "../../common/util/featureParser";

export type OnLayersCreatedCallbackFn = (layer: VectorLayer) => void;

export default class ModelsLayer {
  private layer?: VectorLayer;
  private source?: VectorSource;
  private stylePointCircle: Style;
  private stylePointSquare: Style;
  private stylePolygon: Style;
  private onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn;
  private dataLatestUpdateDate?: Date;

  public constructor(onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn) {
    this.onLayerCreatedCallbackFn = onLayerCreatedCallbackFn;

    this.stylePointCircle = new Style({
      image: new Circle({
        stroke: new Stroke({
          color: "black",
          width: 2,
        }),
        radius: 7,
      }),
    });
    this.stylePointSquare = new Style({
      image: new RegularShape({
        stroke: new Stroke({
          color: "black",
          width: 2,
        }),
        points: 4,
        radius: 7,
        angle: Math.PI / 4,
      }),
    });
    this.stylePolygon = new Style({
      stroke: new Stroke({
        color: "black",
        width: 4,
      }),
    });

    this.fetchGeoJson().then(this.addFeaturesToLayer);
  }

  private fetchGeoJson = async (): Promise<GeoJSONResponse> => {
    const response = await fetch("./3d/3d.json");
    const data = await response.json();

    return data as GeoJSONResponse;
  };

  private addFeaturesToLayer = (geojsonObject: GeoJSONResponse) => {
    this.source = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject),
    });
    this.layer = new VectorLayer({
      source: this.source,
      style: (feature: FeatureLike) => {
        switch (feature.getGeometry().getType()) {
          case "Point":
            const properties = feature.getProperties() as Model;
            if (
              properties.registryItem.type ===
              MuseovirastoLayer.Muinaisjäännökset_piste
            ) {
              return this.stylePointCircle;
            }
            if (
              properties.registryItem.type ===
              MuseovirastoLayer.Suojellut_rakennukset_piste
            ) {
              return this.stylePointSquare;
            }
          case "Polygon":
            return this.stylePolygon;
          default:
            return this.stylePointCircle;
        }
      },
    });
    this.onLayerCreatedCallbackFn(this.layer);
  };

  public getLayer = (): VectorLayer | undefined => this.layer;

  public getDataLatestUpdateDate = async (): Promise<Date> => {
    if (this.dataLatestUpdateDate) {
      return Promise.resolve(this.dataLatestUpdateDate);
    }
    const data = await this.fetchGeoJson();
    return getGeoJSONDataLatestUpdateDate(data.features);
  };
}