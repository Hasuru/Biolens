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
  private model:any;

  constructor(
    private alertCtrl: AlertController,
    private httpClient: HttpClient,
    //private model: automl.ImageClassificationModel
  ) {
    loadGraphModel(MODEL_URL)
    .then ((response) => {
      this.graphModel = response;
      this.httpClient.get(DICT_URL, {responseType:  'text'}).subscribe((data) => {
        this.dictionary = data.split('\n');
        this.model = new ImageClassificationModel(this.graphModel, this.dictionary);
        /*this.alertCtrl.create({
          header:'Tensor Alert',
          message:'Model created and Dictionary: ' + this.dictionary,
          buttons:['OK'],
        }).then((resp) => {resp.present()});*/
      });
    });
  }

  getPrediction(img: any) {
    this.model.classify(img).then((response: any) => {
      let length: number = +JSON.stringify(response.length);
      let label: string = '';
      let prob: number = 0;

      for (let i = 0; i < length; i++) {
        if (+JSON.stringify(response[i].prob) > prob) {
          label = JSON.stringify(response[i].label);
          prob = +JSON.stringify(response[i].prob);
        }
      }

      this.alertCtrl.create({
        header: 'Image Evaluation Results',
        message: label + ' -> ' + prob,
        buttons: ['NICE'],
      }).then((res) => {res.present();});

      return {
        label: label,
        prob: prob,
      };

    }).catch((e: any) => {
      this.alertCtrl.create({
        header: 'Image Evaluation Error',
        message: 'Prediction: Something went wrong:' + JSON.stringify(e) + ' / ' + typeof(img),
        buttons: ['OK'],
      }).then((res) => {res.present()});
    });
  }
}
