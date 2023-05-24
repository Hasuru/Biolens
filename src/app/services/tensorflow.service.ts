import { Injectable } from '@angular/core';
import {loadGraphModel } from '@tensorflow/tfjs';
import { ImageClassificationModel } from '@tensorflow/tfjs-automl';

@Injectable({
  providedIn: 'root'
})
export class TensorflowService {
  constructor() { }

  // PROBLEMAS COM AS PACKAGES DE IMPORT DO TENSORFLOW

  public async classifyImage(photoData: string) {
    const graphModel = await loadGraphModel("../../assets/model/model.json");
    const dict = this.loadDictionary("../../assets/model/dict.txt"); // dict string[]
    const model = ImageClassificationModel(graphModel, dict);
  }


  base64ToTensor(imageData: string): tf.Tensor3D {
    const imageElement = document.createElement('img');
    imageElement.src = 'data:image/jpeg;base64,' + imageData;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context!.drawImage(imageElement, 0, 0);
    const imageDataTensor = tf.browser.fromPixels(canvas);
    const preprocessedTensor = tf.cast(imageDataTensor, 'float32').expandDims();
    return preprocessedTensor;
  }

  // traduz ficheiro em string[] cada uma contendo cada especie
  public loadDictionary(file:any) {
    var fs = require("fs");
    var text = fs.readFileSync(file);
    var textByLine = text.split("\n")

    return textByLine;
  }
}
