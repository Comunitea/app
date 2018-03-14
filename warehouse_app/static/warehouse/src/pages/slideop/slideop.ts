import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastController } from 'ionic-angular';
/*import { PROXY } from '../../providers/constants/constants';*/
/**
 * Generated class for the SlideopPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation. 
 */

import { HostListener } from '@angular/core';
import { HomePage } from '../home/home';
import { TreeopsPage } from '../treeops/treeops';
import { TreepickPage } from '../treepick/treepick';
import { Storage } from '@ionic/storage';
import { AuxProvider } from '../../providers/aux/aux'

import { SerialnumberPage } from '../serialnumber/serialnumber';

declare var OdooApi: any

@IonicPage()
@Component({
  selector: 'page-slideop',
  templateUrl: 'slideop.html',
})
export class SlideopPage {


  @ViewChild('scan') myScan ;
  @ViewChild('qty') myQty ;

  //@HostListener('document:keydown', ['$event'])
  //handleKeyboardEvent(event: KeyboardEvent) { 
  //  if (!this.myScan._isFocus){this.myScan.setFocus()};
  //   }
  
  op = {}
  op_selected = {};
  model = 'stock.pack.operation'
  source_model = 'stock.picking'
  
  pick_fields = ['id', 'state', 'user_id']
  domain = []
  isPaquete: boolean = true;
  isProducto: boolean = false;
  cargar = true;
  scan = ''
  scan_id = {}
  barcodeForm: FormGroup;
  Home = HomePage

  package_id_change: number = 0;
  package_dest_id_change: number = 0;
  location_id_change: number = 0;
  lot_id_change: number = 0;
  qty_change: boolean = false
  
  ops = []
  index:number = 0
  message = ''
  state: number = 0/* 0 espera origen, 1 cantidad yo destino 2 destino*/
  input: number = 0
  op_id: number = 0
  last_read: number = 0
  reconfirm: boolean 
  waiting: number = 0
  pick = []
  last_id : number = 0
  last_qty : number = 0.00
  orig_model = ''
  pick_id
  
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public toastCtrl: ToastController, public navParams: NavParams, private formBuilder: FormBuilder, public alertCtrl: AlertController, private storage: Storage) {
    
    this.op_id = this.navParams.data.op_id;
    this.source_model = this.navParams.data.source_model;
    this.pick_id = this.navParams.data.pick_id;
    this.index = Number(this.navParams.data.index || 0);
    this.ops = this.navParams.data.ops;

    this.last_id = this.op_id
    this.last_qty = 0.00
    this.pick = []
    this.reconfirm = false
    
    if (!this.ops){
      this.presentToast('Aviso:No hay operaciones', false)
    }
    this.index = Number(this.navParams.data.index || 0);
    this.barcodeForm = this.formBuilder.group({scan: ['']});
    this.resetValues()
    this.loadOpObj(this.op_id)
    this.check_new_state()
    }

  resetOPValues(){ 
    this.waiting=0;
    this.package_dest_id_change = 0;
    this.package_id_change = 0;
    this.lot_id_change = 0;
    this.qty_change = false;
    this.location_id_change = 0;
    this.scan = ''
    this.state = 0;
    this.last_read = 0;
    this.op_selected = {'lot_id': 0, 'package_id': 0, 'location_id': 0, 'product_id': 0, 'location_dest_id': 0, 'result_package_id': 0, 'qty_done': 0}
    this.input = 0;
    console.log(this.source_model)
  }
  
  resetValues(){
   
    this.message = '';
    this.op = {};
    this.domain = [['id', '=', this.op_id]];
    this.model =  'stock.pack.operation';
    this.resetOPValues()
  }  
  
  no_result_package(reset=true){
    var self = this;
    if (reset){self.op_selected['result_package_id'] = self.op_selected['result_package_id']}
    else {self.op_selected['result_package_id'] = [-1, 'Nuevo'];}
  }
  resetForm(){
    this.loadOpObj(this.op_id);
   }
  
  goHome(){this.navCtrl.setRoot(TreepickPage, {borrar: true, login: null});}

  cargarPick(){
    this.storage.get('CONEXION').then((val) => {
      if (val == null) {
          this.navCtrl.setRoot(HomePage, {borrar: true, login: null});
      } 
      else {
        var self = this
        self.cargar = true;
        var con = val;
        var odoo = new OdooApi(con.url, con.db);
        odoo.login(con.username, con.password).then(
          function (uid) {
          var model = self.source_model;
          var fields = self.pick_fields;
          var domain = [['id','=', self.pick_id]];
          odoo.search_read(model, domain, fields, 0, 1).then((value) => {
            self.pick = value[0];}
            ); 
          },
          function () {
            self.cargar = false;
            self.presentAlert('Falla!', 'Imposible conectarse');
          });
      }});
    }



          
  presentAlert(titulo, texto) {
    const alert = this.alertCtrl.create({
        title: titulo,
        subTitle: texto,
        buttons: ['Ok']
    });
    alert.present();
  }
  

  presentToast(message, showClose=false) {
    var self = this;
    let duration = 3000;
    let toastClass = 'toastOk';
    if (showClose){let toastClass = 'toastNo'};
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'top',
      showCloseButton: showClose,
      closeButtonText: 'Ok',
      cssClass: toastClass
    });
    toast.onDidDismiss(() => {
      self.myScan.setFocus();
    });
    toast.present();
  }


  change_op_value(id, field, value){
    if (this.check_changes()){return}
    var self = this;
    var model = 'stock.pack.operation';
    var method = 'change_op_value';
    var values = {'id': id, 'field': field, 'value': value};
    var object_id = {};
    self.storage.get('CONEXION').then((val) => {

      if (val == null) {
        console.log('No hay conexión');
        self.navCtrl.setRoot(HomePage, {borrar: true, login: null});
      } else {
          console.log('Hay conexión');
          var con = val;
          var odoo = new OdooApi(con.url, con.db);
          odoo.login(con.username, con.password).then(
            function (uid) {
              self.cargar = true;
              odoo.call(model, method, values).then(
                function (value) {
                  if (field=='pda_checked'){return;}
                  if (value['new_op']){
                    let showClose = !value['result'];
                    self.presentToast(value['message'], showClose);
                    self.navCtrl.push(TreeopsPage, {picking_id: self.pick_id, move_to_op: value['new_op'], source_model: this.source_model });
                    return
                  } 
                  let showClose = !value['result'];
                  self.presentToast(value['message'], showClose);
                  self.cargar = false;
                  self.loadOpObj();
                },
                function () {
                  self.cargar = false;
                  self.presentAlert('Falla!', 'Imposible conectarse');
                }
                          );
                      },
                      function () {
                          self.cargar = false;
                          self.presentAlert('Falla!', 'Imposible conectarse');
                      }
                  );
                  self.cargar = false;

             
              }
              
              
          });
  }

submitScan(){
  if (this.check_changes()){return}
  var values = {'model':  ['stock.quant.package', 'stock.production.lot', 'stock.location', 'product.product'], 'search_str' : this.barcodeForm.value['scan']};
  this.barcodeForm.reset();
  this.submit(values);
  }

check_changes(){
  var res = false;
  if (this.op['pda_done']){
    this.presentToast ("Ya está hecha. No puedes modificar");
    res = true
    }
  if (!Boolean(this.pick['user_id'])) {
    this.presentToast ("No está asignado el picking");
    res = true
    }
  return res
}
scanValue(model, scan){
    if (this.check_changes()){return}
    var domain
    var values
    if (model=='stock.production.lot'){
      domain = [['product_id', '=', this.op['product_id'][0]]];
      values = {'model':  [model], 'search_str' : scan, 'domain': domain};
    }
    else {
      values = {'model':  [model], 'search_str' : scan}
    }
    this.submit(values);
}


check_submit(value){
  let confirm = this.reconfirm || (this.last_read == value.id)
  this.check_returned_value(value);
  this.check_new_state();
  /*if (self.waiting>=4 && self.op['location_dest_id']['need_check'] && !self.cargar){
      self.doOp(self.op_id);
  }*/
  this.scan_id = value;
  this.myScan.setFocus();
  return value;
}

submit (values){
  if (this.check_changes()){return}
  let res = this.find_in_op(values)
  if (res){
    return this.check_submit(res)
  }
  this.last_read = values['search_str']
  var self = this
  var model = 'warehouse.app'
  var method = 'get_object_id'
  var confirm = false
  self.storage.get('CONEXION').then((val) => {
    if (val == null) {
      console.log('No hay conexión');
      self.navCtrl.setRoot(HomePage, {borrar: true, login: null});
    } else {
        console.log('Hay conexión');
        var con = val;
        var odoo = new OdooApi(con.url, con.db);
        odoo.login(con.username, con.password).then(
          function (uid) {
            odoo.call(model, method, values).then(
              function (value) {
                
                //AQUI DECIDO QUE HACER EN FUNCION DE LO QUE RECIBO
                confirm = self.reconfirm || (self.last_read == value.id)
                
                self.check_returned_value(value);
                self.check_new_state();
                /*if (self.waiting>=4 && self.op['location_dest_id']['need_check'] && !self.cargar){
                    self.doOp(self.op_id);
                }*/
                self.scan_id = value;
                self.myScan.setFocus();
                return value;
                },
              function () {
                self.cargar = false;
                self.presentAlert('Falla!', 'Imposible conectarse');
                }
              );
            },
          function () {
            self.cargar = false;
            self.presentAlert('Falla!', 'Imposible conectarse');
            }
          );
        self.cargar = false;
    
      }
    
      });
  }


  getObjectId(values){
    var self = this;
    var model = 'warehouse.app'
    var method = 'get_object_id'
    
    this.storage.get('CONEXION').then((val) => {
      if (val == null) {
        console.log('No hay conexión');
        self.navCtrl.setRoot(HomePage, {borrar: true, login: null});
      } else {
          console.log('Hay conexión');
          var con = val;
          var odoo = new OdooApi(con.url, con.db);
          odoo.login(con.username, con.password).then(
            function (uid) {
              odoo.call(model, method, values).then(
                function (value) {
                  self.scan_id = value; 
                  return value;
                  },
                function () {
                  self.cargar = false;
                  self.presentAlert('Falla!', 'Imposible conectarse');
                  }
                );
              },
            function () {
              self.cargar = false;
              self.presentAlert('Falla!', 'Imposible conectarse');
              }
            );
          self.cargar = false;
      
        }
      
        });
  }

  SerialtoOp(id, serial, lot_id=false, option='add', qty=0){
    if (this.check_changes()){return}
    this.cargar = true
    var self = this;
    var model = 'stock.pack.operation'
    var method = 'SerialtoOp'
    var values = {'id': id, 'serial': serial, 'option': option, 'qty': qty, 'lot_id': lot_id}
    this.storage.get('CONEXION').then((val) => {

      if (val == null) {
        console.log('No hay conexión');
        self.navCtrl.setRoot(HomePage, {borrar: true, login: null});
      } 
      else {
        console.log('Hay conexión');
        var con = val;
        var odoo = new OdooApi(con.url, con.db);
        odoo.login(con.username, con.password).then(
          function (uid) {
            odoo.call(model, method, values).then(
              function (value) {
                {setTimeout(() => {
                  if (Boolean(value['id'])){
                    self.domain = [['id', '=',id]];  
                    self.loadOpObj(id)
                  }
                  else {
                    self.presentAlert("Error", value['message'])
                    self.loadOpObj(id)
                    
                  }
                }, 25);}

              },
              function () {
                self.cargar = false;
                self.presentAlert('Falla!', 'Imposible conectarse');
              }
                        );
                    },
                    function () {
                        self.cargar = false;
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    }
                );
                self.cargar = false;
      }
    });
  }
  
  get_next_op(id, index){

    var self = this;
    let domain = []
    
    var ops = self.ops.filter(function (op) {
      return op.pda_done == false && op.id != id}
    )
    console.log(ops)
    if (ops.length==0) {
      return false
    }
    index = index + 1;
    
    if (index > (self.ops.length-1)) {
      index = 0;
    };

    if (self.op[index].pda_done) {
        return self.get_next_op(id, index)
      }
    return self.ops[index]['id'] || false
    
  }

  doOp(id){
    if (this.check_changes()){return}
    
    var self = this;
    self.cargar = true;
    var model = 'stock.pack.operation'
    var method = 'doOp'
    var values = {'id': id, 'qty_done': self.op_selected['qty_done']}
    var object_id;
    this.storage.get('CONEXION').then((val) => {

      if (val == null) {
        console.log('No hay conexión');
        self.navCtrl.setRoot(HomePage, {borrar: true, login: null});
      } else {
          console.log('Hay conexión');
          var con = val;
          var odoo = new OdooApi(con.url, con.db);
          odoo.login(con.username, con.password).then(
            function (uid) {
              odoo.call(model, method, values).then(
                function (value) {
                  {setTimeout(() => {
                    self.ops[self.index]['pda_done'] = true
                    self.op['pda_done'] = true
                    self.cargar = false;
                    if (self.get_next_op(id, self.index)==false) {
                      self.navCtrl.push(TreeopsPage, {pick_id:this.pick_id, source_model:this.source_model} )
                      }
                    else {
                      if (Boolean(value)){
                        id = self.get_next_op(id, self.index)
                        self.loadOpObj(id)
                      }
                      else {
                        self.presentToast(value);
                        self.loadOpObj(id)
                      }
                    }
                  }, 1);}

                },
                function () {
                  self.cargar = false;
                  self.presentAlert('Falla!', 'Imposible conectarse');
                }
                          );
                      },
                      function () {
                          self.cargar = false;
                          self.presentAlert('Falla!', 'Imposible conectarse');
                      }
                  );
                  self.cargar = false;
              }
          });
  }

  addQty(id, qty){
    
    this.op_selected['qty_done'] += qty

    let package_qty = this.op['package_id'] && this.op['package_id']['package_qty'] || this.op_selected['qty_done']

    this.op_selected['qty_done'] = Math.max(this.op_selected['qty_done'], 0)
    this.op_selected['qty_done'] = Math.min(this.op_selected['qty_done'], package_qty)
    //this.op_selected['qty_done']= this.op['qty_done']
    this.check_new_state();
    

  }

    
  inputQty() {
    if (this.op['tracking']!='none'){return}
    if (this.check_changes()){return}
    var self = this;
    if (self.waiting < 1 && self.waiting > 4) {return}
    let alert = this.alertCtrl.create({
      title: 'Qty',
      message: 'Cantidad a mover',
      inputs: [
        {
          name: 'qty',
          placeholder: (self.op_selected['qty_done'] && self.op['qty_done']).toString()
        },
       
      
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: (data) => {
            console.log('Saved clicked');
            console.log(data.qty);

            if (data.qty<0){
              self.presentAlert('Error!', 'La cantidad debe ser mayor que 0');
            }
            else if (data.qty) {
              //self.op['qty_done'] = data.qty
              self.op_selected['qty_done']= data.qty
              self.check_new_state();
            }
            self.input = 0;

          }
        }
      ]
    });

    self.input = alert._state;
    alert.present();
  }


  addSerial(option='add') {
    let message = {'add': 'Añadir un número de serie', 'remove': "Eliminar un número de serie", 'qty': "Introduce cantidad"}
    var self = this;
    if (self.waiting < 1 && self.waiting > 4) {return}
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
            self.SerialtoOp(self.op_id, data.serial, false, option, 1)
            self.input = 0;
          }
        }
      ]
    });

    self.input = alert._state;
    alert.present();
  }   
  showSerial(){
    let op = {'id': this.op_id, 'product_id': this['op']['pda_product_id'], 'qty_done': this['op']['qty_done']}
    let myModal = this.modalCtrl.create(SerialnumberPage, {'op': op, 'pack_lot_ids': this['op']['pack_lot_ids']}); 
    
    myModal.present();
    myModal.onDidDismiss(data => 
      {
        if (data) {
          this['op_selected']['qty_done'] = data.qty_done;
          this['op']['pack_lot_ids'] = data.pack_lot_ids
        }
        //this.presentAlert('Modal', data && data.message)
    })
  }

    
  loadOpObj(id = 0){
    this.last_id = this.op_id
    this.last_qty = this.op_selected['qty_done']
    var self = this
    var model = 'warehouse.app'
    var method = 'get_object_id'
    if (id==0){
      id = this.op_id
    }
    var values = {'id': id, 'model': 'stock.pack.operation'}
    self.storage.get('CONEXION').then((val) => {
      if (val == null) {
        console.log('No hay conexión');
        self.navCtrl.setRoot(HomePage, {borrar: true, login: null});
      } 
      else {
        console.log('Hay conexión');
        var con = val;
        var odoo = new OdooApi(con.url, con.db);
        odoo.login(con.username, con.password).then(
          function (uid) {
            odoo.call(model, method, values).then(
              function (res) {
                if (res['id']!=0){
                  self.state = 0;
                  self.waiting = 0;
                  self.op = res['values']
                  self.check_loaded_values()
                  return true;
                }
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

  check_loaded_values(){
    if (this.op_id == this.last_id && !Boolean(this.op_selected) && this.op_selected['qty_done']>0.00 ){
      this.op['qty_done'] = this.op_selected['qty_done']
    }

    if (this.op['result_package_id']){
      this.op_selected['result_package_id'] = this.op['result_package_id'];
    }
    if (this.source_model=='stock.picking'){
      this.pick = this.op['picking_id']
    }
    else {
      this.cargarPick()
    }
    this.cargar = false
  }


  check_new_state(){
    if (this.op['pda_done']){
      this.waiting = -1;
      this.state = 0;
      return
    }
    let waiting = this.waiting
    let ops = this.op_selected
    if (waiting <= 5) {
      if (ops['package_id']){
        waiting = 1
      }
      if (ops['pack_lot_ids']){
        waiting = 2
      }
      if (ops['product_id']){
        waiting = 3
      }
      if (waiting >= 3) {
        if (!this.op['location_id']['need_check'] || ops['location_id']){
          if (ops['qty_done']){
            waiting = 6
          }
          else {waiting = 5}
        }
        else {waiting = 4}
      }
    }  

    if (waiting >= 6) {
      if (this.op['result_package_id'] && !ops['result_package_id']){
        waiting = 7
      }
      else {
        waiting = 8
      }
      if (waiting == 8){
        if (!this.op['location_dest_id']['need_check'] || ops['location_dest_id']){
          waiting = 9
        }
      }
    }
    if (waiting <= 5) {this.state=0}
    if (waiting == 6) {this.state=1}
    if (waiting >= 7) {this.state=2}
    this.waiting = waiting
    if (waiting==9){
      this.cargar = true;
      this.doOp(this.op_id)
    }
  } 


  find_in_op(val){
    let model
    let id
    if (this.state == 0)    {
      if ((this.op['package_id'] && val == this.op['package_id']['name'])) {
        id = this.op['package_id']['id']
        model = 'stock.quant.package'
      }
      else if (val == this.op['pda_product_id']['barcode']){
        id = this.op['pda_product_id']['id']
        model = 'product.product'
      }
      else if (val == this.op['location_id']['barcode']){
        id = this.op['location_id']['id']
        model = 'stock.location'
      }
      else if (this.op['pack_lot_ids']){
        let pack_lot_id = this.op['pack_lot_ids'].some(function(pack_lot){return pack_lot['lot_id']['name']==val})
        if (pack_lot_id){
          id = pack_lot_id['lot_id']['id']
          model = 'stoc.production.lot'
        }
      }
    }

    else if (this.state ==2) {
      if (this.op['result_package_id'] && val == this.op['result_package_id']['name']){
        id = this.op['result_package_id']['id']
        model = 'stock.quant.package'
      }
      else if (val == this.op['location_dest_id']['barcode']){
        id = this.op['location_dest_id']['id']
        model = 'stock.location'
      }
    }

  }
  check_returned_value(value){
    if (this.state == 0) {

      if (value.model=='product.product') {
        if (value.id == this.op['pda_product_id']['id']){
        this.op_selected['product_id'] = this.op['pda_product_id']
        }
      }

      else if (value.model=='stock.quant.package') {
        if (value.id == this.op['package_id']['id'] && this.package_id_change == 0){
          this.op_selected['product_id'] = this.op['pda_product_id']
          this.op_selected['package_id'] = this.op['package_id']
          this.op_selected['location_id'] = this.op['location_id']
        }
        else if (value.id == this.package_id_change){
          this.package_id_change = 0;
          this.change_op_value(this.op_id, 'package_id', value.id);
          this.cargar = true;
          this.presentToast('Confirmado cambio de paquete de origen. Recargando ...')
          this.loadOpObj()
        }
        else if (this.package_id_change != 0 && value.id != this.package_id_change){
          this.package_id_change = 0;
          this.presentToast('Cancelado el cambio de paquete de origen')
        }
        else if (value.id != this.op['package_id']['id']){
          this.package_id_change = value.id;
          this.presentToast('Cambiando de paquete de origen')
        }

      }

      else if (value.model=='stock.location') {
        if (value.id == this.op['location_id']['id'] && this.location_id_change == 0){
          this.op_selected['location_id'] = this.op['location_id']
        }
        else if (value.id == this.location_id_change){
          this.package_dest_id_change = 0;
          this.change_op_value(this.op_id, 'location_id', value.id);
          this.cargar = true;
          this.presentToast('Confirmado cambio de ubicación de origen')
        }
        else if (this.location_id_change != 0 && value.id != this.location_id_change){
          this.location_id_change = 0;
          this.presentToast('Cancelado el cambio de ubicación de origen')
        }
        else if (value.id != this.op['location_id']['id']){
          this.location_id_change = value.id;
          this.presentToast('Cambiando de ubicación de origen')
        }
      }
      else if (value.model=='stock.production.lot') {
        if (value.id == this.op['lot_id']['id']){
          this.op_selected['lot_id'] = this.op['lot_id']
        }
      }
    }

    else if (this.state == 2){
      if (value.model=='stock.location') {
        if (value.id == this.op['location_dest_id']['id'] && this.location_id_change == 0){
          this.op_selected['location_dest_id'] = this.op['location_dest_id']
        }
        else if (value.id == this.location_id_change){
          this.package_dest_id_change = 0;
          this.change_op_value(this.op_id, 'location_dest_id', value.id);
          this.cargar = true;
          this.presentToast('Confirmado cambio de ubicación de destino')
        }
        else if (this.location_id_change != 0 && value.id != this.location_id_change){
          this.location_id_change = 0;
          this.presentToast('Cancelado el cambio de ubicación de destino')
        }
        else if (value.id != this.op['location_dest_id']['id']){
          this.location_id_change = value.id;
          this.presentToast('Cambiando de ubicación de destino')
        }
       
      }

      else if (value.model=='stock.quant.package') {
        if (value.id == this.op['result_package_id']['id'] && this.package_id_change == 0){
          this.op_selected['result_package_id'] = this.op['result_package_id']
        }
        else if (value.id == this.package_id_change){
          this.package_id_change = 0;
          this.change_op_value(this.op_id, 'result_package_id', value.id);
          this.cargar = true;
          this.presentToast('Confirmado cambio de paquete de destino')
        }
        else if (this.package_id_change != 0 && value.id != this.package_id_change){
          this.package_id_change = 0;
          this.presentToast('Cancelado el cambio de paquete de destino')
        }
        else if (value.id != this.op['result_package_id']['id']){
          this.package_id_change = value.id;
          this.presentToast('Cambiando de paquete de destino')
        }
      }
    }  
  } 

}
