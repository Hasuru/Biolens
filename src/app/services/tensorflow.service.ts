import { Injectable } from '@angular/core';
import {loadGraphModel} from '@tensorflow/tfjs-converter';
import {Tensor3D,  browser, cast, expandDims} from '@tensorflow/tfjs-core';
import { ImageClassificationModel } from '@tensorflow/tfjs-automl';

@Injectable({
  providedIn: 'root'
})
export class TensorflowService {
  //private model: ImageClassificationModel = null;
  constructor() {
    console.log("TensorFlow started");
  }

  async initialize() {
    console.log("On tensorflow Init()");
    const graphModel = await loadGraphModel("../../assets/model/model.json");
    console.log("Model graph loaded");
    //const dict = this.loadDictionary("../../assets/model/dict.txt"); // dict string[]
    const model = new ImageClassificationModel(graphModel, [] /*dict*/);
    console.log("MODEL : " + model);
  }

  // PROBLEMAS COM AS PACKAGES DE IMPORT DO TENSORFLOW


  /*base64ToTensor(imageData: string): Tensor3D {
    const imageElement = document.createElement('img');
    imageElement.src = 'data:image/jpeg;base64,' + imageData;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context!.drawImage(imageElement, 0, 0);
    const imageDataTensor = browser.fromPixels(canvas);
    const preprocessedTensor = cast(imageDataTensor, 'float32').expandDims();
    return preprocessedTensor;
  }*/

  // traduz ficheiro em string[] cada uma contendo cada especie
  /*public loadDictionary(file:any) {
    var fs = require("fs");
    var text = fs.readFileSync(file);
    var textByLine = text.split("\n")

    return textByLine;
  }*/
}
