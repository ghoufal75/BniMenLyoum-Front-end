import "leaflet";
import {FeatureGroup} from 'leaflet';
declare const L;

export class MapService {
  processShapeFile(geoJSONData) {
    // let primaryArray = [];
    let featuresArray = [];
    for (let elem of geoJSONData) {

      switch (elem.fileName) {
        case "DOCUMENT D'URBANISME/limite":
          featuresArray.push({
            name : "DOCUMENT D'URBANISME/limite",
            layers:this.fillFeatureArray('Designatio',elem.features)
          })
          break;
        case "DOCUMENT D'URBANISME/borne":
          featuresArray.push({
            name : "DOCUMENT D'URBANISME/borne",
            layers:this.fillFeatureArray('Code_DU',elem.features)
          })
          break;
        case "DOCUMENT D'URBANISME/zoning":
          featuresArray.push({
            name:"DOCUMENT D'URBANISME/zoning",
            layers:this.fillFeatureArray("Classe_Zon", elem.features)
          });
          break;
        case "DOCUMENT D'URBANISME/zoning1":
          featuresArray.push({
            name:"DOCUMENT D'URBANISME/zoning1",
            layers: this.fillFeatureArray("Classe_Zon", elem.features)
          }

          );
          break;
        case "DOCUMENT D'URBANISME/zoning2":
          featuresArray.push({
            name:"DOCUMENT D'URBANISME/zoning",
            layers:this.fillFeatureArray("Classe_Zon", elem.features)
          });
          break;
        case "DOCUMENT D'URBANISME/equipement":
          featuresArray.push({
            name : "DOCUMENT D'URBANISME/equipement",
            layers:this.fillFeatureArray("Classe_Equ", elem.features)
          }

          );
          break;
        case "DOCUMENT D'URBANISME/voie_polygone":
          featuresArray.push({
            name:"DOCUMENT D'URBANISME/voie_polygone",
            layers:this.fillFeatureArray("Classe_Voi", elem.features)
          }

          );
          break;
        case "DOCUMENT D'URBANISME/voie":
          featuresArray.push({
            name : "DOCUMENT D'URBANISME/voie",
            layers:    this.fillFeatureArray("Classe_Voi", elem.features)
          }


          );
          break;
        case "DOCUMENT D'URBANISME/zoning_a_risque":
          featuresArray.push({
            name: "DOCUMENT D'URBANISME/zoning_a_risque",
            layers:     this.fillFeatureArray("Classe_Zon", elem.features)
          }

          );
          break;
      }

    }
    return featuresArray;

  }
  fillFeatureArray(nameofClass: string, features: any) {
    const featureArray = [];
    for (let f of features) {
      let index = featureArray.indexOf(
        featureArray.find(
          (element) => element.class === f.properties[nameofClass]
        )
      );
      let color = this.generateRandomColor();
      if (index === -1) {
        let newClass = {
          class: f.properties[nameofClass],
          layers: [],
          color,
        };
        newClass.layers.push(f.geometry);
        featureArray.push(newClass);
      } else {
        featureArray[index].layers.push(f);
      }
    }
    return featureArray;
  }

  generateRandomColor() {
    let maxVal = 0xffffff; // 16777215
    let randomNumber: any = Math.random() * maxVal;
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    let randColor = randomNumber.padStart(6, 0);
    return `#${randColor.toUpperCase()}`;
  }
}
