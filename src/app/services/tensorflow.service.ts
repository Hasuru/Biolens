import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { loadGraphModel } from '@tensorflow/tfjs-converter';
import { ImageClassificationModel, ImageInput } from '@tensorflow/tfjs-automl';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import '@tensorflow/tfjs-backend-webgl';

const MODEL_URL = '../../assets/model/model.json';
const DICT_URL = '../../assets/model/dict.txt';

@Injectable({
  providedIn: 'root'
})
export class TensorflowService {
  private graphModel: any;
  private dictionary: any;

  constructor(
    private alertCtrl: AlertController,
    private httpClient: HttpClient,
    //private model: automl.ImageClassificationModel
  ) {
    loadGraphModel(MODEL_URL)
    .then ((response) => {
      this.graphModel = response;
      this.httpClient.get(DICT_URL, {responseType: 'text'}).subscribe((data) => {
        this.dictionary = data.split('\n');
        this.alertCtrl.create({
          header:'Tensor Alert',
          message:'Model created and Dictionary: ' + this.dictionary,
          buttons:['OK'],
        }).then((resp) => {resp.present()});
      });
    });
  }

  getPrediction(webpath: any) {
    const model = new ImageClassificationModel(this.graphModel, this.dictionary);
    console.log("!!! Image Model Loaded >>> " + model);
    const options = {centerCrop: true};
    const predictions = model.classify(webpath,options).then((response) => {
      this.alertCtrl.create({
        header: 'Tensor Alert',
        message: '' + response,
        buttons: ['OK'],
      }).then((res) => {res.present()});
    }).catch((e) => {
      this.alertCtrl.create({
        header: 'Tensor Alert',
        message: 'Prediction: Something went wrong:' + JSON.stringify(e),
        buttons: ['OK'],
      }).then((res) => {res.present()});
    });
  }

  convertToTensor(base64Data: string) {
    const binaryString = window.atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const imageTensor = tf.browser.fromPixels({
      data: bytes,
      height: 400,
      width: 400
    });

    const reshapedTensor = imageTensor.reshape([
      400,
      400,
      3,
    ]);

    return reshapedTensor;
  }
}
