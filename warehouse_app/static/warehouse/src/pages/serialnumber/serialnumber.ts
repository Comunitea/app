import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, AlertController} from 'ionic-angular';
//import { ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastController } from 'ionic-angular';
//import { HostListener } from '@angular/core';
import { Storage } from '@ionic/storage';

//*Pagians
//import { HomePage } from '../home/home';
//import { LotPage } from '../lot/lot';
//import { LocationPage } from '../location/location';
//import { PackagePage } from '../package/package';
//import { ProductPage } from '../product/product';


/**
 * Generated class for the ProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var OdooApi: any

@IonicPage()
@Component({
  selector: 'page-serialnumber',
  templateUrl: 'serialnumber.html',
})
export class SerialnumberPage {

  //product_fields = ['display_name', 'ean13', 'default_code', 'uom_id', 'qty_available', 'default_stock_location_id', 'track_all', 'pallet_ul', 'box_ul', 'categ_id', 'quant_ids']
  model
  op
  pack_lot_ids
  cargar 
  constructor(public viewCtrl: ViewController, public toastCtrl: ToastController, public storage: Storage, public navParams: NavParams, public alertCtrl: AlertController) {
    this.model = 'stock.pack.operation.lot';
    this.op = this.navParams.data.op;
    this.pack_lot_ids = this.navParams.data.pack_lot_ids
    for (let lot in this.pack_lot_ids){this.pack_lot_ids[lot]['dirty']=false}
    this.cargar = true
    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LotPage');
  }
 
  loaditem(){
    var self = this
    var model = 'warehouse.app'
    var method = 'get_info_object'
    var values = {'model':  'stock.pack.operation', 'id' : this.op['id']};
    self.storage.get('CONEXION').then((val) => {
      if (val == null) {
        console.log('No hay conexión');
        this.viewCtrl.dismiss();
      } else {
          console.log('Hay conexión');
          var con = val;
          var odoo = new OdooApi(con.url, con.db);
          odoo.login(con.username, con.password).then(
            function (uid) {
              odoo.call(model, method, values).then(
                function (value) {
                  
                  if (value){
                    let op = value['values']
                    self.pack_lot_ids = op['pack_lot_ids']
                    self.op = {'id': value['id'], 'product_id': op['pda_product_id'], 'qty_done': op['qty_done']}
                    for (let lot in self.pack_lot_ids){self.pack_lot_ids[lot]['dirty']=false} 
                    self.cargar = true
                  }
                  else {
                    self.presentAlert("Error", "Error al recargar la operacion")
                  }
                  //AQUI DECIDO QUE HACER EN FUNCION DE LO QUE RECIBO
                  //self.openinfo(value)

                 },
                function () {

                  self.presentAlert('Falla!', 'Imposible conectarse');
                  }
                );
              },
            function () {

              self.presentAlert('Falla!', 'Imposible conectarse');
              }
            );


        }

        });
    }
  presentAlert(titulo, texto) {
    const alert = this.alertCtrl.create({
        title: titulo,
        subTitle: texto,
        buttons: ['Ok']
    });
    alert.present();
  }
  
    
  

  cancelar() {
    let return_data = {'qty_done': this.op['qty_done'], 'pack_lot_ids': this.pack_lot_ids}
    this.viewCtrl.dismiss(return_data);
  } 
  
  

  save_close() {

    let lot_changed = []
    let qty_done = 0.00
    if (!this.pack_lot_ids){
      return this.cancelar
    }
    for (let lot in this.pack_lot_ids){
      qty_done += this.pack_lot_ids[lot]['qty']
      if (this.pack_lot_ids[lot]['dirty']){
        lot_changed.push(this.pack_lot_ids[lot])
      }
    }
    if (lot_changed.length){
      this.op['qty_done'] = qty_done
      this.save_lots(lot_changed)
      }
    else {
      this.cancelar()}
  }

  save_lots(lot_changed){
    var self = this
    var model = 'stock.pack.operation'
    var method = 'pda_refresh()'
    let vals = {'id': this.op['id'], 'qty_done': this.op['qty_done'], 'pack_lot_ids': lot_changed}
    var values = {'model':  this.model, 'values' : vals};
    this.storage.get('CONEXION').then((val) => {

      if (val == null) {
        console.log('No hay conexión');
        this.viewCtrl.dismiss();
      } else {
          console.log('Hay conexión');
          var con = val;
          var odoo = new OdooApi(con.url, con.db);
          odoo.login(con.username, con.password).then(
            function (uid) {
              odoo.call(model, method, values).then(
                function (value) {
                  if (value['id']){
                    self. cancelar();
                  }
                  else {
                    self.presentAlert("Error al guardar", value['message'])
                    self.viewCtrl.dismiss();
                  }

                },
                function () {
                  self.cargar = false;
                  self.presentAlert('Falla!', 'Error al guardar lotes conectarse');
                }
                          );
                      },
                      function () {
                          self.cargar = false;
                          self.presentAlert('Falla!', 'Error de conexión [save_lots]');
                      }
                  );
                  self.cargar = false;
              }
          });
  }

  addSerial(option='add') {
    
    let message = {'add': 'Añadir un número de serie', 'remove': "Eliminar un número de serie", 'qty': "Introduce cantidad"}
    var self = this;
    let alert = this.alertCtrl.create({
      title: 'Nº de serie',
      message: message['option'],
      inputs: [
        {
          name: 'serial',
          placeholder: ''
        },
       
      
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aplicar',
          handler: (data) => {
            console.log('Saved clicked');
            console.log(data.serial);
            self.SerialtoOp(data.serial, false, option, 1)
            
          }
        }
      ]
    });
    alert.present();
  }
  
  addQty(lot_id, qty){
    return this.SerialtoOp('', lot_id, 'qty', qty)
  }

  SerialtoOp(serial, lot_id=false, option='add', qty=0){
    
    this.cargar = false
    var self = this;
    var model = 'stock.pack.operation'
    var method = 'SerialtoOp'
    var values = {'id': self.op['id'], 'serial': serial, 'option': option, 'qty': qty, 'lot_id': lot_id}
    this.storage.get('CONEXION').then((val) => {

      if (val == null) {
        console.log('No hay conexión');
        this.viewCtrl.dismiss();
      } 
      else {
        console.log('Hay conexión');
        var con = val;
        var odoo = new OdooApi(con.url, con.db);
        odoo.login(con.username, con.password).then(
          function (uid) {
            odoo.call(model, method, values).then(
              function (value) {
                self.cargar = true
                if (values['id']){
                  self.loaditem()

                }
                else {
                  self.cargar = true
                  self.presentAlert("Error", value['message'])}
              },
              function () {
                self.cargar = false;
                self.presentAlert('Falla!', 'Error de conexión [SerialtoOp]');
              }
                        );
                    },
                    function () {
                        self.cargar = false;
                        self.presentAlert('Falla!', 'Error de conexión [SerialtoOp]');
                    }
                );
                self.cargar = false;
      }
    });
  }
}
