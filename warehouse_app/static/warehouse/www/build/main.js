webpackJsonp([9],{

/***/ 110:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ManualPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/*import { PROXY } from '../../providers/constants/constants';*/



var ManualPage = (function () {
    function ManualPage(navCtrl, toastCtrl, navParams, formBuilder, storage, alertCtrl) {
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.storage = storage;
        this.alertCtrl = alertCtrl;
        this.move_id = 0;
        this.model = 'stock.move';
        this.move_fields = ['id', 'product_id', 'lot_id', 'restrict_package_id', 'result_package_id', 'restrict_lot_id', 'package_qty', 'location_id', 'location_dest_id'];
        this.move = ['id', 'product_id', 'product_id_name', 'restrict_package_id', 'restrict_package_id_name', 'result_package_id', 'result_package_id_name', 'restrict_lot_id', 'restrict_lot_id_name', 'package_qty', 'location_id', 'location_dest_id', 'location_id_name', 'location_dest_id_name'];
        this.domain = [];
        this.package_qty = true;
        this.message = '';
        this.state = 0; /* 0 origen 1 destino 2 validar */
        this.scan_id = '';
        this.restrict_package_id = 0;
        this.restrict_package_id_name = '';
        this.restrict_lot_id = 0;
        this.restrict_lot_id_name = '';
        this.result_package_id = 0;
        this.result_package_id_name = '';
        this.location_id = 0;
        this.location_id_name = '';
        this.location_dest_id = 0;
        this.location_dest_id_name = '';
        this.product_qty = 0;
        this.product_id = 0;
        this.product_id_name = '';
        this.uom = '';
        this.total_package_qty = 0;
        this.models = [];
        this.last_scan = '';
        this.input = 0;
        this.move['restrict_package'] = "Restrict package";
        this.reset_form();
        this.input = 0;
        this.models = ['stock.quant.package', 'stock.production.lot', 'stock.location', 'product.product'];
    }
    ManualPage.prototype.handleKeyboardEvent = function (event) {
        if (!this.myScan._isFocus && this.input != 1) {
            this.myScan.setFocus();
        }
        ;
    };
    ManualPage.prototype.reset_form = function () {
        this.state = 0;
        this.scan_id = '';
        this.last_scan = '';
        this.barcodeForm = this.formBuilder.group({ scan: [''] });
        this.restrict_package_id = 0;
        this.restrict_package_id_name = '';
        this.restrict_lot_id = 0;
        this.restrict_lot_id_name = '';
        this.product_qty = 0;
        this.total_package_qty = 0;
        this.package_qty = false;
        this.result_package_id = 0;
        this.result_package_id_name = '';
        this.location_id = 0;
        this.location_id_name = '';
        this.location_dest_id = 0;
        this.location_dest_id_name = '';
        this.product_id = 0;
        this.product_id_name = '';
        this.uom = '';
    };
    ManualPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ManualPage');
    };
    ManualPage.prototype.submitScan = function () {
        if (this.state == 2 && this.last_scan == this.barcodeForm.value['scan']) {
            this.process_move();
        }
        else {
            var values = { 'model': this.models, 'search_str': this.barcodeForm.value['scan'], 'return_object': true };
            this.barcodeForm.reset();
            this.submit(values);
        }
    };
    ManualPage.prototype.get_id = function (val) {
        return (val && val[0]) || false;
    };
    ManualPage.prototype.include = function (arr, obj) {
        return (arr.indexOf(obj) != -1);
    };
    ManualPage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    ManualPage.prototype.check_state = function (state) {
        var self = this;
        if (self.restrict_lot_id * self.product_qty * self.location_id * self.product_id != 0) {
            self.state = 1;
        }
        else if (self.restrict_lot_id * self.location_id * self.product_id != 0) {
            self.state = 1;
        }
        if (self.state == 1 && self.location_dest_id != 0) {
            self.state = 2;
        }
    };
    ManualPage.prototype.submit = function (values) {
        var self = this;
        var model = 'warehouse.app';
        var method = 'get_object_id';
        var origenModels = self.models;
        var destModels = ['stock.quant.package', 'stock.location'];
        if (self.state == 0) {
            values['model'] = origenModels;
        }
        else {
            values['model'] = destModels;
        }
        self.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.call(model, method, values).then(function (value) {
                        //AQUI DECIDO QUE HACER EN FUNCION DE LO QUE RECIBO
                        //Estoy scaneando ORIGEN
                        if (value['id'] == 0) {
                            self.presentToast(value['message'], false);
                            return value;
                        }
                        else if (self.state == 0) {
                            if (origenModels.indexOf(value.model) != -1) {
                                if (value.model == 'stock.quant.package') {
                                    self.set_package(self.state, value['fields']);
                                }
                                else if (value.model == 'stock.location') {
                                    self.set_location(self.state, value['fields']);
                                }
                                else if (value.model == 'stock.production.lot') {
                                    self.set_lot(self.state, value['fields']);
                                }
                                else if (value.model == 'product.product') {
                                    self.set_lot(self.state, value['fields']);
                                }
                            }
                        }
                        else if (self.state >= 1) {
                            if (destModels.indexOf(value.model) != -1) {
                                self.last_scan = values['search_str'];
                                if (value.model == 'stock.quant.package') {
                                    self.set_package(self.state, value['fields']);
                                }
                                else if (value.model == 'stock.location') {
                                    self.set_location(self.state, value['fields']);
                                }
                            }
                        }
                        self.scan_id = value['id'];
                        self.check_state(self.state);
                        self.myScan.setFocus();
                        return value;
                    }, function () {
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
            }
        });
    };
    ManualPage.prototype.set_state = function () {
        var self = this;
        //self.state = 1
    };
    ManualPage.prototype.set_package = function (state, values) {
        var self = this;
        if (self.state == 0) {
            self.reset_form();
            self.restrict_lot_id = values['lot_id'];
            self.restrict_lot_id_name = values['lot_id_name'];
            self.restrict_package_id = values['id'];
            self.restrict_package_id_name = values['name'];
            self.product_qty = values['package_qty'];
            self.total_package_qty = values['package_qty'];
            self.package_qty = true;
            self.location_id = values['location_id'];
            self.location_id_name = values['location_id_name'];
            self.product_id = values['product_id'];
            self.product_id_name = values['product_id_name'];
            self.uom = values['uom'];
            self.result_package_id = values['id'];
            self.result_package_id_name = values['name'];
        }
        else if (self.state == 1) {
            if (!values['multi'] && values['lot_id'] && values['lot_id'] != self.restrict_lot_id) {
                self.presentToast('Paquete no válido. Lote distinto al inicial', true);
                self.result_package_id = 0;
                self.location_dest_id = 0;
                self.result_package_id_name = '';
                self.location_dest_id_name = '';
                return;
            }
            self.result_package_id = values['id'];
            self.result_package_id_name = values['name'];
        }
    };
    ManualPage.prototype.no_result_package = function (reset) {
        if (reset === void 0) { reset = true; }
        var self = this;
        if (reset) {
            self.result_package_id = 0;
            self.result_package_id_name = '';
        }
        else {
            if (self.product_qty == self.total_package_qty) {
                self.result_package_id = self.restrict_package_id;
                self.result_package_id_name = self.restrict_package_id_name;
            }
            else {
                self.result_package_id = -1;
                self.result_package_id_name = 'Nuevo';
            }
        }
    };
    ManualPage.prototype.set_lot = function (state, values) {
        var self = this;
        self.reset_form();
        if (self.state == 0) {
            self.restrict_lot_id = values['id'];
            self.restrict_lot_id_name = values['name'];
            self.location_id = values['location_id'];
            self.location_id_name = values['location_id_name'];
            self.product_id = values['product_id'];
            self.product_id_name = values['product_id_name'];
            self.uom = values['uom'];
        }
    };
    ManualPage.prototype.set_location = function (state, values) {
        var self = this;
        if (self.state == 0) {
            self.location_id = values['id'];
            self.location_id_name = values['name'];
        }
        else if (self.state == 1) {
            self.location_dest_id = values['id'];
            self.location_dest_id_name = values['name'];
        }
    };
    ManualPage.prototype.change_package_qty = function () {
        var self = this;
        if (self.package_qty) {
            self.product_qty = self.total_package_qty;
        }
    };
    ManualPage.prototype.inputQty = function () {
        var self = this;
        if (self.state == 0) {
            return;
        }
        var alert = this.alertCtrl.create({
            title: 'Qty',
            message: 'Cantidad a mover',
            inputs: [
                {
                    name: 'qty',
                    placeholder: self.product_qty.toString()
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Save',
                    handler: function (data) {
                        console.log('Saved clicked');
                        console.log(data.qty);
                        if (self.restrict_package_id != 0 && data.qty > self.total_package_qty) {
                            self.presentAlert('Error!', 'La cantidad debe ser menor que la contenida en el paquete');
                        }
                        else if (data.qty < 0) {
                            self.presentAlert('Error!', 'La cantidad debe ser mayor que 0');
                        }
                        else if (data.qty) {
                            self.product_qty = data.qty;
                            self.check_state(0);
                        }
                        self.input = 0;
                    }
                }
            ]
        });
        self.input = alert._state;
        alert.present();
    };
    ManualPage.prototype.presentToast = function (message, showClose) {
        if (showClose === void 0) { showClose = false; }
        var self = this;
        var duration = 3000;
        var toastClass = 'toastOk';
        if (showClose) {
            var toastClass_1 = 'toastNo';
        }
        ;
        var toast = this.toastCtrl.create({
            message: message,
            duration: duration,
            position: 'top',
            showCloseButton: showClose,
            closeButtonText: 'Ok',
            cssClass: toastClass
        });
        toast.onDidDismiss(function () {
            self.myScan.setFocus();
        });
        toast.present();
    };
    ManualPage.prototype.process_move = function () {
        /* CREAR Y PROCESAR UN MOVIMEINTO */
        var self = this;
        var values = { 'restrict_package_id': self.restrict_package_id,
            'product_id': self.product_id,
            'restrict_lot_id': self.restrict_lot_id,
            'location_id': self.location_id,
            'result_package_id': self.result_package_id,
            'location_dest_id': self.location_dest_id,
            'package_qty': self.package_qty,
            'product_uom_qty': self.product_qty };
        values['origin'] = 'PDA move';
        var field = '';
        var fields = ['restrict_package_id', 'result_package_id', 'product_id', 'lot_id', 'result_package_id', 'location_id', 'location_dest_id'];
        for (var key in fields) {
            field = fields[key];
            if (self[field] != 0) {
                values[field] = self[field];
            }
        }
        values['package_qty'] = self.package_qty;
        values['product_qty'] = self.product_qty;
        var model = 'stock.move';
        var method = 'pda_move';
        console.log(values);
        self.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.call(model, method, values).then(function (value) {
                        if (value['id'] != 0) {
                            self.presentToast(value['message'], false);
                            self.reset_form();
                            return;
                        }
                        else {
                            self.presentToast(value['message'], true);
                            return;
                        }
                    }, function () {
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('scan'),
        __metadata("design:type", Object)
    ], ManualPage.prototype, "myScan", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["y" /* HostListener */])('document:keydown', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [KeyboardEvent]),
        __metadata("design:returntype", void 0)
    ], ManualPage.prototype, "handleKeyboardEvent", null);
    ManualPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-manual',template:/*ion-inline-start:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/manual/manual.html"*/'<!--\n  Generated template for the ManualPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar color="primary">\n      <button ion-button icon-only menuToggle>\n        <ion-icon name="menu"></ion-icon>\n      </button>\n      <ion-title>Movimiento manual</ion-title>\n      <ion-buttons end>\n        \n        <button ion-button >\n          <ion-icon name="log-out"></ion-icon>\n        </button>\n    </ion-buttons>\n  </ion-navbar>\n  <h2 class="danger" [hidden]="message == \'\'">{{ message }}</h2>\n</ion-header>\n<ion-content>\n  \n    <ion-list>\n        <ion-item-group> \n          <ion-item no-lines>\n            <ion-label color="odoo" item-start class="bold" onclick="set_origin()">\n              ORIGEN\n            </ion-label>\n            <ion-icon name="repeat" item-end color="danger" (click)="reset_form()"></ion-icon>\n          </ion-item>\n      \n          <ion-item [hidden] = "!restrict_package_id">\n            <button ion-button outline item-end>{{restrict_package_id_name}}</button>\n            <ion-toggle [(ngModel)]="package_qty"  (ionChange)="change_package_qty()" item-start></ion-toggle>\n          </ion-item>\n          \n          <ion-item>\n              <ion-label color="primary" >Lote</ion-label>\n              <button ion-button outline item-end>{{restrict_lot_id_name}}</button>\n          </ion-item>\n          <ion-item>\n              <ion-label color="primary" >Articulo</ion-label>\n              <button ion-button outline item-end>{{product_id_name}}</button>\n          </ion-item>\n          <ion-item [hidden] = "package_qty">\n            <ion-label color="primary">Qty</ion-label>\n            <!--ion-input [(ngModel)]=\'product_qty\' type="number" item-end style="align-self: flex-end; max-width: 50%;"></ion-input-->\n            <button ion-button outline item-end (click)="inputQty()">{{ product_qty }} {{ uom }}</button>\n          </ion-item>\n          <ion-item>\n              <ion-label color="primary" >De</ion-label>\n              <button ion-button outline item-end>{{location_id_name}}</button>\n          </ion-item>\n        </ion-item-group>\n\n        <ion-item-group [hidden]="state==0">\n          <ion-item no-lines>\n            <ion-label color="odoo" class="bold" item-start onclick="set_dest()">\n              DESTINO\n            </ion-label>\n          </ion-item>\n          <ion-item>\n            <ion-icon name="log-out" [hidden] = "result_package_id == 0" item-start color="danger" (click)="no_result_package()"></ion-icon>\n            <ion-icon name="log-in" [hidden] = "result_package_id != 0" item-start color="secondary" (click)="no_result_package(false)"></ion-icon>\n            <button ion-button outline item-end>{{result_package_id_name}}</button>\n          </ion-item>\n          <ion-item>\n            <ion-label color="primary">A</ion-label>\n            <button ion-button outline item-end>{{location_dest_id_name}}</button>\n          </ion-item>\n        </ion-item-group>\n      </ion-list>\n  \n  \n  \n</ion-content>\n<ion-footer>\n    <form [formGroup]="barcodeForm" class ="alignBottom">\n        <ion-item>\n           <ion-label color="odoo" item-start>Scan: </ion-label>\n           <ion-input #scan [formControl]="barcodeForm.controls[\'scan\']" type="text" name="scan" placeholder = "Scan"  autofocus></ion-input>\n          \n           <button ion-button icon-only item-end clear (click)="submitScan()">\n             <ion-icon name="barcode"></ion-icon>\n           </button>\n         </ion-item>   \n       </form>\n</ion-footer>'/*ion-inline-end:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/manual/manual.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], ManualPage);
    return ManualPage;
}());

//# sourceMappingURL=manual.js.map

/***/ }),

/***/ 111:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SlideopPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__treeops_treeops__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__treepick_treepick__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_storage__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var SlideopPage = (function () {
    function SlideopPage(navCtrl, toastCtrl, navParams, formBuilder, alertCtrl, storage) {
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        //@HostListener('document:keydown', ['$event'])
        //handleKeyboardEvent(event: KeyboardEvent) { 
        //  if (!this.myScan._isFocus){this.myScan.setFocus()};
        //   }
        this.op = {};
        this.op_selected = {};
        this.model = 'stock.pack.operation';
        this.op_fields = ['id', 'pda_checked', 'picking_id', 'pda_done', 'product_id', 'pda_product_id', 'location_id', 'location_id_barcode', 'location_dest_id_barcode', 'location_dest_id', 'product_uom', 'lot_id', 'package_id', 'result_package_id', 'product_qty', 'total_qty', 'qty_done', 'location_dest_id_need_check'];
        this.pick_fields = ['id', 'state', 'user_id'];
        this.domain = [];
        this.isPaquete = true;
        this.isProducto = false;
        this.cargar = true;
        this.scan = '';
        this.scan_id = {};
        this.Home = __WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */];
        this.package_id_change = 0;
        this.package_dest_id_change = 0;
        this.location_id_change = 0;
        this.lot_id_change = 0;
        this.qty_change = false;
        this.ops = [];
        this.index = 0;
        this.message = '';
        this.new_qty_done = 0;
        this.state = 0; /* 0 espera origen, 1 cantidad yo destino 2 destino*/
        this.input = 0;
        this.op_id = 0;
        this.last_read = 0;
        this.waiting = 0;
        this.pick = [];
        this.op_id = this.navParams.data.op_id;
        this.pick = [];
        this.reconfirm = false;
        this.ops = this.navParams.data.ops;
        if (!this.ops) {
            this.presentToast('Aviso:No hay operaciones', false);
        }
        this.index = Number(this.navParams.data.index || 0);
        this.result_package_id = 0;
        this.barcodeForm = this.formBuilder.group({ scan: [''] });
        this.state = this.navParams.data.origin || 0;
        this.resetValues();
        this.resetForm();
    }
    SlideopPage.prototype.resetOPValues = function () {
        this.waiting = 0;
        this.package_dest_id_change = 0;
        this.package_id_change = 0;
        this.lot_id_change = 0;
        this.qty_change = false;
        this.location_id_change = 0;
        this.scan = '';
        this.state = 0;
        this.new_qty_done = 0;
        this.last_read = 0;
        this.op_selected = { 'lot_id': 0, 'package_id': 0, 'location_id': 0, 'product_id': 0, 'location_dest_id': 0, 'result_package_id': 0 };
        this.input = 0;
    };
    SlideopPage.prototype.resetValues = function () {
        this.message = '';
        this.op = {};
        this.domain = [['id', '=', this.op_id]];
        this.model = 'stock.pack.operation';
        this.resetOPValues();
    };
    SlideopPage.prototype.no_result_package = function (reset) {
        if (reset === void 0) { reset = true; }
        var self = this;
        if (reset) {
            self.op_selected['result_package_id'] = self.op_selected['result_package_id'];
        }
        else {
            self.op_selected['result_package_id'] = [-1, 'Nuevo'];
        }
    };
    SlideopPage.prototype.resetForm = function () {
        this.cargarOP();
    };
    SlideopPage.prototype.get_op_selected = function () {
        var field;
        for (field in ['id', 'package_id', 'lot_id', 'product_id', 'qty_done', 'product_qty', 'result_package_id', 'location_dest_id', 'pda_product_id']) {
        }
    };
    SlideopPage.prototype.goHome = function () { this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__treepick_treepick__["a" /* TreepickPage */], { borrar: true, login: null }); };
    SlideopPage.prototype.cargarPick = function () {
        var _this = this;
        this.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                var self = _this;
                self.cargar = true;
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    var model = 'stock.picking';
                    var fields = self.pick_fields;
                    var domain = [['id', '=', self.op['picking_id'][0]]];
                    odoo.search_read(model, domain, fields, 0, 1).then(function (value) {
                        self.pick = value[0];
                    });
                }, function () {
                    self.cargar = false;
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
            }
        });
    };
    SlideopPage.prototype.cargarOP = function () {
        var self = this;
        var last_id = self.op['id'];
        var qty_done = self.op_selected['qty_done'];
        var last_picking_id = self.op['picking_id'];
        self.resetOPValues();
        this.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    self.cargar = true;
                    odoo.search_read(self.model, self.domain, self.op_fields, 0, 0).then(function (value) {
                        //self.resetValues()
                        self.op = value[0];
                        if (self.op['id'] == last_id) {
                            self.op['qty_done'] = qty_done;
                        }
                        else {
                            self.op['qty_done'] = self.op['product_qty'];
                        }
                        if (self.op['picking_id'] != last_picking_id) {
                            self.cargarPick();
                        }
                        self.cargar = false;
                        if (self.op['result_package_id']) {
                            self.result_package_id = 0;
                            self.op_selected['result_package_id'] = self.op['result_package_id'];
                        }
                    }, function () {
                        self.cargar = false;
                        self.presentAlert('Error !', 'Se ha producido un error al recargar la operacion');
                    });
                }, function () {
                    self.cargar = false;
                    self.presentAlert('Error !', 'Se ha producido un error al recargar la operacion');
                });
                self.cargar = false;
            }
        });
    };
    SlideopPage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    SlideopPage.prototype.presentToast = function (message, showClose) {
        if (showClose === void 0) { showClose = false; }
        var self = this;
        var duration = 3000;
        var toastClass = 'toastOk';
        if (showClose) {
            var toastClass_1 = 'toastNo';
        }
        ;
        var toast = this.toastCtrl.create({
            message: message,
            duration: duration,
            position: 'top',
            showCloseButton: showClose,
            closeButtonText: 'Ok',
            cssClass: toastClass
        });
        toast.onDidDismiss(function () {
            self.myScan.setFocus();
        });
        toast.present();
    };
    SlideopPage.prototype.change_op_value = function (id, field, value) {
        if (this.check_changes()) {
            return;
        }
        var self = this;
        var model = 'stock.pack.operation';
        var method = 'change_op_value';
        var values = { 'id': id, 'field': field, 'value': value };
        var object_id = {};
        self.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    self.cargar = true;
                    odoo.call(model, method, values).then(function (value) {
                        if (field == 'pda_checked') {
                            return;
                        }
                        if (value['new_op']) {
                            var showClose_1 = !value['result'];
                            self.presentToast(value['message'], showClose_1);
                            self.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__treeops_treeops__["a" /* TreeopsPage */], { picking_id: self.op['picking_id'][0], move_to_op: value['new_op'] });
                            return;
                        }
                        var showClose = !value['result'];
                        self.presentToast(value['message'], showClose);
                        self.cargar = false;
                        self.cargarOP();
                    }, function () {
                        self.cargar = false;
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.cargar = false;
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
                self.cargar = false;
            }
        });
    };
    SlideopPage.prototype.submitScan = function () {
        if (this.check_changes()) {
            return;
        }
        var values = { 'model': ['stock.quant.package', 'stock.production.lot', 'stock.location'], 'search_str': this.barcodeForm.value['scan'] };
        this.barcodeForm.reset();
        this.submit(values);
    };
    SlideopPage.prototype.check_changes = function () {
        var res = false;
        if (this.op['pda_done']) {
            this.presentToast("Ya está hecha. No puedes modificar");
            res = true;
        }
        if (!Boolean(this.pick['user_id'])) {
            this.presentToast("No está asignado el picking");
            res = true;
        }
        return res;
    };
    SlideopPage.prototype.scanValue = function (model, scan) {
        if (this.check_changes()) {
            return;
        }
        var domain;
        var values;
        if (model == 'stock.production.lot') {
            domain = [['product_id', '=', this.op['product_id'][0]]];
            values = { 'model': [model], 'search_str': scan, 'domain': domain };
        }
        else {
            values = { 'model': [model], 'search_str': scan };
        }
        this.submit(values);
    };
    SlideopPage.prototype.get_id = function (val) {
        return (val && val[0]) || false;
    };
    SlideopPage.prototype.check_state = function () {
        var self = this;
        self.state = 0;
        /* state == 0 si es la operacion tiene pacquete y se selecciona paquete // si no lo tiene y tienen lote se selecciona lote y ubicación o si no tiene lote producto más ubicación*/
        if (self.op['package_id']) {
            if (self.op_selected['package_id'] != 0) {
                self.state = 1;
            }
        }
        else if (self.op['lot_id']) {
            if (self.op_selected['lot_id'] != 0 && self.op_selected['location_id'] != 0) {
                self.state = 1;
            }
            else if (self.op_selected['product_id'] != 0 && self.op_selected['location_id'] != 0) {
                self.state = 1;
            }
        }
        /* si state ==1 y hay paquete de destino o ubicacion de destino se puede confirmar*/
        if (self.state == 1 && (self.last_read != 0 || self.op_selected['result_package_id'] != 0 || self.op_selected['location_dest_id'] != 0)) {
            self.state = 2;
        }
        /*WAITING*/
        if (self.op['package_id']) {
            if (self.op_selected['package_id'] == 0) {
                self.waiting = 1;
            }
            else {
                self.waiting = 4;
            }
        }
        if (!self.op['package_id']) {
            if (self.op_selected['lot_id'] == 0) {
                self.waiting = 2;
            }
            else if (self.op_selected['lot_id'] > 0) {
                if (self.op_selected['location_id'] == 0) {
                    self.waiting = 3;
                }
                else {
                    self.waiting = 4;
                }
            }
        }
        if (self.waiting == 4 && ((self.op['result_package_id'] && self.op_selected['result_package_id'] > 0) || (self.op_selected['result_package_id'] > 0))) {
            self.waiting = 6;
        }
        if (self.waiting == 4 && (!self.op['result_package_id'] && self.op_selected['location_dest_id'] == 0)) {
            self.waiting = 5;
        }
        if (self.op_selected['result_package_id'] > 1 || self.op_selected['location_dest_id']) {
            self.waiting = 6;
        }
        if (self.waiting < 4) {
            self.state = 0;
        }
        else if (self.waiting < 6) {
            self.state = 1;
        }
        else if (self.last_read != 0) {
            self.state = 2;
        }
    };
    SlideopPage.prototype.submit = function (values) {
        if (this.check_changes()) {
            return;
        }
        var self = this;
        var model = 'warehouse.app';
        var method = 'get_object_id';
        var confirm = false;
        self.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.call(model, method, values).then(function (value) {
                        var lot_id = self.get_id(self.op['lot_id']);
                        var package_id = self.get_id(self.op['package_id']);
                        var result_package_id = self.get_id(self.op['result_package_id']);
                        var location_id = self.get_id(self.op['location_id']);
                        var location_dest_id = self.get_id(self.op['location_dest_id']);
                        //AQUI DECIDO QUE HACER EN FUNCION DE LO QUE RECIBO
                        confirm = self.reconfirm || (self.last_read == value.id);
                        self.last_read = value.id;
                        if (self.state == 0) {
                            // CASO 0.LOTE. LOTE SELECCIONADO
                            if (value.model == 'stock.production.lot' && self.lot_id_change == 0 && value.id == lot_id) {
                                self.op_selected['lot_id'] = value.id;
                            }
                            else if (value.model == 'stock.production.lot' && self.lot_id_change == 0 && value.id != lot_id) {
                                self.lot_id_change == value.id;
                                self.presentToast('Cambiando lote. Repite scan para confirmar');
                            }
                            else if (value.model == 'stock.production.lot' && self.lot_id_change != 0) {
                                if (value.id != self.lot_id_change) {
                                    self.op_selected['lot_id'] = value.id;
                                    self.presentToast('Lote cambiado');
                                    self.lot_id_change = 0;
                                }
                                else {
                                    self.lot_id_change = 0;
                                    self.presentToast('Cancelado el cambio de lote');
                                }
                            }
                            else if (value.model == 'stock.quant.package' && value.id == package_id) {
                                self.package_id_change = 0;
                                self.op_selected['lot_id'] = self.op['lot_id'];
                                self.op_selected['package_id'] = value.id;
                                self.op_selected['location_id'] = self.op['location_id'];
                            }
                            else if (value.model == 'stock.quant.package' && self.package_id_change == 0 && value.id != package_id) {
                                self.package_id_change = value.id;
                                self.op_selected['lot_id'] = 0;
                                self.op_selected['package_id'] = 0;
                            }
                            else if (value.model == 'stock.quant.package' && self.package_id_change == value.id) {
                                self.cargar = true;
                                self.package_id_change = value.id;
                                self.change_op_value(self.op_id, 'package_id', value.id);
                                // Reiniciamos la configuración completa  ...
                            }
                            else if (value.model == 'stock.quant.package' && self.package_id_change != 0 && self.package_id_change != value.id) {
                                if (value.id == self.op['package_id']) {
                                    self.package_id_change = 0;
                                    self.op_selected['lot_id'] = self.op['lot_id'];
                                    self.op_selected['location_id'] = self.op['location_id'];
                                    self.presentToast('Cancelado cambio de paquete');
                                }
                                else {
                                    self.package_id_change = value.id;
                                    self.presentToast('Nuevo cambio de paquete.  Repite scan para confirmar');
                                }
                            }
                            else if (value.model == 'stock.location' && value.id == location_id && self.location_id_change == 0) {
                                self.op_selected['location_id'] = value.id;
                            }
                            else if (value.model == 'stock.location' && package_id == false && self.location_id_change == 0 && value.id != location_id) {
                                self.location_id_change = value.id;
                                self.presentToast('Cambio de ubicación de origen. Repite scan para confirmar');
                            }
                            else if (value.model == 'stock.location' && self.location_id_change != 0) {
                                if (self.location_id_change == value.id) {
                                    self.cargar = true;
                                    self.presentToast('Cambio de ubicación de origen confirmado');
                                    self.change_op_value(self.op_id, 'location_id', value.id);
                                    self.location_id_change = 0;
                                }
                                else {
                                    self.presentToast('Cambio de ubicación de origen cancelado');
                                    self.location_id_change = 0;
                                }
                            }
                            // STATE = 1
                        }
                        else if (self.state != 0) {
                            // CASO 5. CANTIDAD + PAQUETE DESTINO => CONFIRMA OPERACION
                            if (value.model == 'stock.location') {
                                if (value.id == location_dest_id && self.location_id_change == 0) {
                                    if (confirm) {
                                        self.cargar = true;
                                        self.doOp(self.op['id']);
                                    }
                                    else {
                                        self.presentToast('ReScan para confirmar');
                                    }
                                }
                                else if (value.id != location_dest_id && self.location_id_change == 0) {
                                    self.location_id_change = value.id;
                                    self.presentToast('Cambiando de ubiucación');
                                }
                                else if (value.id == self.location_id_change) {
                                    self.cargar = true;
                                    self.change_op_value(self.op_id, 'location_dest_id', value.id);
                                    self.location_id_change = 0;
                                    self.presentToast('Cambio de ubicación de destino confirmado');
                                }
                                else if (value.id == self.location_id_change && self.location_id_change != 0) {
                                    self.location_id_change = 0;
                                    self.presentToast('Cancelado cambio de destino');
                                }
                            }
                            else if (value.model == 'stock.quant.package') {
                                if (value.id == result_package_id && self.package_dest_id_change == 0) {
                                    if (confirm) {
                                        self.cargar = true;
                                        self.doOp(self.op['id']);
                                    }
                                    else {
                                        self.presentToast('ReScan para confirmar');
                                    }
                                }
                                else if (value.id != result_package_id && self.package_dest_id_change == 0) {
                                    self.package_dest_id_change = value.id;
                                    self.presentToast('Cambiando de paquete de destino');
                                }
                                else if (self.package_dest_id_change == value.id) {
                                    self.package_dest_id_change = 0;
                                    self.change_op_value(self.op_id, 'result_package_id', value.id);
                                    self.cargar = true;
                                    self.presentToast('Confirmado cambio de paquete de destino');
                                }
                                else if (self.package_dest_id_change != 0 && self.package_id_change != value.id) {
                                    self.package_dest_id_change = 0;
                                    self.presentToast('Cambio de paquete de destino cancelado');
                                }
                            }
                            else if (self.op['location_dest_id_need_check'] && !Boolean(self.op['result_package_id'])) {
                                self.cargar = true;
                                self.doOp(self.op['id']);
                            }
                            // CASO 11. DESTINO + UBICACION DESTINO (<>) => CONFIRMA NUEVO UBICACION DESTINO >> CAMBIO DESTINO EN OP + CARGAR OP + CARGAR SLIDES
                        }
                        self.check_state();
                        if (self.waiting >= 4 && self.op['location_dest_id_need_check'] && !self.cargar) {
                            self.doOp(self.op['id']);
                        }
                        self.scan_id = value;
                        self.myScan.setFocus();
                        return value;
                    }, function () {
                        self.cargar = false;
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.cargar = false;
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
                self.cargar = false;
            }
        });
    };
    SlideopPage.prototype.getObjectId = function (values) {
        var self = this;
        var model = 'warehouse.app';
        var method = 'get_object_id';
        this.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.call(model, method, values).then(function (value) {
                        self.scan_id = value;
                        return value;
                    }, function () {
                        self.cargar = false;
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.cargar = false;
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
                self.cargar = false;
            }
        });
    };
    SlideopPage.prototype.get_next_op = function (id, index) {
        var self = this;
        var domain = [];
        var ops = self.ops.filter(function (op) {
            return op.pda_done == false && op.id != id;
        });
        if (ops.length == 0) {
            return [];
        }
        index = index + 1;
        if (index > (self.ops.length - 1)) {
            index = 0;
        }
        ;
        if (self.ops[index].pda_done) {
            return self.get_next_op(id, index);
        }
        return [['id', '=', self.ops[index]['id']]];
    };
    SlideopPage.prototype.doOp = function (id) {
        if (this.check_changes()) {
            return;
        }
        var self = this;
        self.cargar = true;
        var model = 'stock.pack.operation';
        var method = 'doOp';
        var values = { 'id': id, 'qty_done': self.op['qty_done'] };
        var object_id;
        this.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.call(model, method, values).then(function (value) {
                        {
                            setTimeout(function () {
                                self.ops[self.index]['pda_done'] = true;
                                self.cargar = false;
                                if (Boolean(value)) {
                                    self.domain = [['id', '=', value]];
                                    self.cargarOP();
                                }
                                else {
                                    //self.navCtrl.push(TreeopsPage, {picking_id: self.op['picking_id'][0]});
                                }
                            }, 1);
                        }
                    }, function () {
                        self.cargar = false;
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.cargar = false;
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
                self.cargar = false;
            }
        });
    };
    SlideopPage.prototype.inputQty = function () {
        if (this.check_changes()) {
            return;
        }
        var self = this;
        if (self.waiting < 1 && self.waiting > 4) {
            return;
        }
        var alert = this.alertCtrl.create({
            title: 'Qty',
            message: 'Cantidad a mover',
            inputs: [
                {
                    name: 'qty',
                    placeholder: self.op['qty_done'].toString()
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Save',
                    handler: function (data) {
                        console.log('Saved clicked');
                        console.log(data.qty);
                        if (data.qty < 0) {
                            self.presentAlert('Error!', 'La cantidad debe ser mayor que 0');
                        }
                        else if (data.qty) {
                            self.op['qty_done'] = data.qty;
                            self.check_state();
                        }
                        self.input = 0;
                    }
                }
            ]
        });
        self.input = alert._state;
        alert.present();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('scan'),
        __metadata("design:type", Object)
    ], SlideopPage.prototype, "myScan", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('qty'),
        __metadata("design:type", Object)
    ], SlideopPage.prototype, "myQty", void 0);
    SlideopPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-slideop',template:/*ion-inline-start:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/slideop/slideop.html"*/'<!--\n  Generated template for the SlideopPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar color="primary">\n      <button ion-button icon-only menuToggle>\n        <ion-icon name="menu"></ion-icon>\n      </button>\n      <ion-title>{{ op[\'picking_id\'] && op[\'picking_id\'][1]}} [{{ op[\'id\']}}] {{index}} Usuario: {{pick[\'user_id\']}}</ion-title>\n      <ion-buttons end>\n        \n        <button ion-button (click)="goHome()">\n          <ion-icon name="home"></ion-icon>\n        </button>\n    </ion-buttons>\n  </ion-navbar>\n  <h2 class="danger" [hidden]="message == \'\'">{{ message }}</h2>\n</ion-header>\n<ion-content>\n  <div *ngIf="!op" style="text-align: center">    \n    <ion-spinner name="circles"></ion-spinner><br>\n    <b>Cargando...</b>\n  </div>\n    <ion-list>\n        <ion-item-group> \n          <ion-item no-lines [ngClass]="{\'no_ok\': state==0, \'ok\': state!=0}">\n            <ion-label item-start>\n                ORIGEN\n            </ion-label>\n            <ion-icon name="repeat" item-end color="danger" (click)="resetForm()"></ion-icon>\n          </ion-item>\n          \n          <ion-item>\n              <ion-label color="primary"></ion-label>\n              <button ion-button outline item-end [ngClass]="{\'buttonOp_ok\': op_selected.product_id == 0, \'buttonOp\': op_selected.product_id != 0}">{{op.pda_product_id && op.pda_product_id[1]}}</button>\n          </ion-item>\n          <ion-item [hidden] = "!op.package_id">\n            <button ion-button outline item-end (click)="scanValue(\'stock.quant.package\', op.package_id[1])"  [ngClass]="{\'buttonOp_ok\': waiting != 1, \'buttonOp\': waiting == 1}">{{op.package_id && op.package_id[1]}}</button>\n            <ion-toggle [(ngModel)]="!product_id"  (ionChange)="change_package_qty()" item-start ></ion-toggle>\n          </ion-item>\n          \n          <ion-item>\n              <ion-label color="primary" >Lote</ion-label>\n              <button ion-button outline item-end [ngClass]="{\'buttonOp_ok\': waiting != 2, \'buttonOp\': waiting == 2}" (click)="scanValue(\'stock.production.lot\', op.lot_id[1])">{{op.lot_id && op.lot_id[1]}}</button>\n          </ion-item>\n         \n          <ion-item [hidden] = "package_qty">\n            <ion-label color="primary">Qty</ion-label>\n            <button ion-button outline item-end (click)="inputQty()"  class=\'buttonOp_ok\'> {{ op.qty_done }} {{ op.product_uom && op.product_uom[1]}}</button>\n          </ion-item>\n          <ion-item>\n              <ion-label color="primary" >De</ion-label>\n              <button ion-button outline item-end [ngClass]="{\'buttonOp_ok\': waiting != \'3\', \'buttonOp\': waiting == \'3\'}" (click)="scanValue(\'stock.location\', op.location_id_barcode)">\n                {{op.location_id && op.location_id[1]}}\n              </button>\n          </ion-item>\n        </ion-item-group>\n\n        <ion-item-group>\n          <ion-item no-lines [ngClass]="{\'ok\': state==2, \'no_ok\': state!=2}">\n            <ion-label class="bold" item-start onclick="set_dest()">\n              DESTINO\n            </ion-label>\n          </ion-item>\n          <ion-item>\n            <ion-label></ion-label>\n            <!--ion-icon name="log-out" [hidden] = "op.result_package_id" item-start color="danger" (click)="no_result_package(\'orig\')"></ion-icon>\n            <ion-icon name="log-in" [hidden] = "!op.result_package_id && op_selected.result_package_id" item-start color="secondary" (click)="no_result_package(\'none\')"></ion-icon-->\n            <button ion-button name="log_out" [hidden] = "op.result_package_id" item-start color="odoo" (click)="no_result_package(\'orig\')">Empaquetar</button>\n            <button ion-button name="log_in" [hidden] = "!op.result_package_id && op_selected.result_package_id" item-start color="odoo" (click)="no_result_package(\'none\')">Sin paquete</button>\n            <button ion-button name="new_result_package" [hidden] = "result_package_id == -1" item-start color="odoo" (click)="no_result_package(\'new\')">Nuevo</button>\n\n            <button ion-button outline item-end [hidden] = "!op_selected.result_package_id" (click)="scanValue(\'stock.quant.package\', op.result_package_id[1])"\n            [ngClass]="{\'buttonOp_ok\': waiting != 4, \'buttonOp\': waiting == 4}">\n              {{op_selected.result_package_id && op_selected.result_package_id[1]}}\n            </button>\n          </ion-item>\n          <ion-item>\n            <ion-label color="primary">A</ion-label>\n            <button ion-button outline item-end (click)="scanValue(\'stock.location\', op.location_dest_id_barcode)"\n            \n            [ngClass]="{\'buttonOp_ok\': waiting != 5, \'buttonOp\': waiting == 5}">\n              {{op.location_dest_id && op.location_dest_id[1]}}\n            </button>\n            <ion-toggle [(ngModel)]="op.location_dest_id_need_check"></ion-toggle>\n          </ion-item>\n        </ion-item-group>\n        <ion-item>\n          Estado: {{state}} Espero {{waiting}}\n        </ion-item>\n      </ion-list>\n  \n      \n  \n</ion-content>\n<ion-footer>\n    <form [formGroup]="barcodeForm" class ="alignBottom" [hidden] = "op[\'pda_done\']">\n        <ion-item>\n           <ion-label color="odoo" item-start>Scan: </ion-label>\n           <ion-input #scan [formControl]="barcodeForm.controls[\'scan\']" type="text" name="scan" placeholder = "Scan"  autofocus></ion-input>\n          \n           <button ion-button icon-only item-end clear (click)="submitScan()">\n             <ion-icon name="barcode"></ion-icon>                  \n           </button>\n         </ion-item>   \n       </form>\n</ion-footer>\n\n\n'/*ion-inline-end:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/slideop/slideop.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_6__ionic_storage__["b" /* Storage */]])
    ], SlideopPage);
    return SlideopPage;
}());

//# sourceMappingURL=slideop.js.map

/***/ }),

/***/ 112:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ShowinfoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__home_home__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__lot_lot__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__location_location__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__package_package__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__product_product__ = __webpack_require__(48);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







//*Pagians





var ShowinfoPage = (function () {
    function ShowinfoPage(navCtrl, toastCtrl, storage, navParams, formBuilder, alertCtrl) {
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.storage = storage;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.alertCtrl = alertCtrl;
        this.barcodeForm = this.formBuilder.group({ scan: [''] });
    }
    ShowinfoPage.prototype.handleKeyboardEvent = function (event) {
        if (!this.myScan._isFocus) {
            this.myScan.setFocus();
        }
        ;
    };
    ShowinfoPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ShowinfoPage');
    };
    ShowinfoPage.prototype.submitScan = function () {
        var values = { 'model': ['stock.quant.package', 'stock.production.lot', 'stock.location', 'product.product'], 'search_str': this.barcodeForm.value['scan'] };
        this.barcodeForm.reset();
        this.submit(values);
    };
    ShowinfoPage.prototype.submit = function (values) {
        var self = this;
        var model = 'warehouse.app';
        var method = 'get_object_id';
        var confirm = false;
        self.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.call(model, method, values).then(function (value) {
                        //AQUI DECIDO QUE HACER EN FUNCION DE LO QUE RECIBO
                        self.openinfo(value);
                    }, function () {
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
            }
        });
    };
    ShowinfoPage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    ShowinfoPage.prototype.openinfo = function (value) {
        var model = value['model'];
        var id = value['id'];
        var page;
        switch (model) {
            case 'stock.production.lot':
                page = __WEBPACK_IMPORTED_MODULE_5__lot_lot__["a" /* LotPage */];
                break;
            case 'stock.location':
                page = __WEBPACK_IMPORTED_MODULE_6__location_location__["a" /* LocationPage */];
                break;
            case 'stock.quant.package':
                page = __WEBPACK_IMPORTED_MODULE_7__package_package__["a" /* PackagePage */];
                break;
            case 'product.product':
                page = __WEBPACK_IMPORTED_MODULE_8__product_product__["a" /* ProductPage */];
                break;
        }
        if (page && id) {
            this.navCtrl.push(page, { model: model, id: id });
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('scan'),
        __metadata("design:type", Object)
    ], ShowinfoPage.prototype, "myScan", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["y" /* HostListener */])('document:keydown', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [KeyboardEvent]),
        __metadata("design:returntype", void 0)
    ], ShowinfoPage.prototype, "handleKeyboardEvent", null);
    ShowinfoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-showinfo',template:/*ion-inline-start:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/showinfo/showinfo.html"*/'<!--\n  Generated template for the ShowinfoPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n    <ion-navbar color="primary">\n\n          <button ion-button icon-only menuToggle>\n            <ion-icon name="menu"></ion-icon>\n          </button>\n\n        <ion-title>Scan etiqueta</ion-title>\n        <ion-buttons end>\n          <button ion-button (click)=\'logOut()\'>\n            <ion-icon name="log-out"></ion-icon>\n          </button>\n      </ion-buttons>\n    </ion-navbar>\n\n\n\n  </ion-header>\n\n\n\n<ion-content padding>\n  <ion-list>\n    <ion-item>\n      \n    </ion-item>\n  </ion-list>\n</ion-content>\n\n\n<ion-footer>\n    <form [formGroup]="barcodeForm" class ="alignBottom">\n     <ion-item  >\n        <ion-label color="odoo" item-start>Scan: </ion-label>\n        <ion-input #scan [formControl]="barcodeForm.controls[\'scan\']" type="text" name="scan" placeholder = "Scan"  autofocus></ion-input>\n\n        <button ion-button icon-only item-end clear (click)="submitScan()">\n          <ion-icon name="barcode"></ion-icon>\n        </button>\n      </ion-item>\n    </form>\n  </ion-footer>\n'/*ion-inline-end:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/showinfo/showinfo.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ToastController */], __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], ShowinfoPage);
    return ShowinfoPage;
}());

//# sourceMappingURL=showinfo.js.map

/***/ }),

/***/ 125:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 125;

/***/ }),

/***/ 167:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/location/location.module": [
		297,
		8
	],
	"../pages/lot/lot.module": [
		305,
		7
	],
	"../pages/manual/manual.module": [
		298,
		6
	],
	"../pages/package/package.module": [
		304,
		5
	],
	"../pages/product/product.module": [
		303,
		4
	],
	"../pages/showinfo/showinfo.module": [
		299,
		3
	],
	"../pages/slideop/slideop.module": [
		300,
		2
	],
	"../pages/treeops/treeops.module": [
		301,
		1
	],
	"../pages/treepick/treepick.module": [
		302,
		0
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 167;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 19:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_network__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_treepick_treepick__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_aux_aux__ = __webpack_require__(54);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/*import {PROXY} from '../../providers/constants/constants';*/
//import  * as odoo from '../../providers/odoo-connector/odoo.js';

var HomePage = (function () {
    function HomePage(navCtrl, navParams, storage, alertCtrl, network, auxProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.alertCtrl = alertCtrl;
        this.network = network;
        this.auxProvider = auxProvider;
        this.loginData = { password: '', username: '' };
        this.CONEXION = {
            url: 'http://odoopistola.com',
            port: '80',
            db: 'pistola',
            username: 'admin',
            password: 'admin',
        };
        /*CONEXION = {
          url: 'http://elnapp.livingodoo.com',
          port: '80',
          db: 'elnapp',
          username: 'admin',
          password: 'admin',
      };*/
        this.cargar = true;
        this.mensaje = '';
        var borrar = this.navParams.get('borrar');
        this.CONEXION.username = (this.navParams.get('login') == undefined) ? '' : this.navParams.get('login');
        if (borrar == true) {
            this.cargar = false;
            this.storage.remove('CONEXION');
        }
        else {
            this.conectarApp(false);
        }
    }
    HomePage_1 = HomePage;
    HomePage.prototype.loginSinDatos = function () {
        var self = this;
        this.storage.get('res.users').then(function (val) {
            if (val == null) {
                self.presentAlert('Falla!', 'Imposible conectarse');
            }
            else {
                self.navCtrl.setRoot(HomePage_1);
            }
            self.cargar = false;
        });
    };
    HomePage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    HomePage.prototype.conectarApp = function (verificar) {
        var self = this;
        var con;
        con = self.CONEXION;
        this.storage.get('CONEXION').then(function (val) {
            var con;
            if (val == null) {
                self.cargar = false;
                con = self.CONEXION;
                if (con.username.length < 3 || con.password.length < 3) {
                    if (verificar) {
                        self.presentAlert('Alerta!', 'Por favor ingrese usuario y contraseña');
                    }
                    return;
                }
            }
            else {
                //si los trae directamente ya fueron verificados
                con = val;
                if (con.username.length < 3 || con.password.length < 3) {
                    return self.cargar = false;
                }
            }
            self.cargar = true;
            //var odoo = new Odoo(con);
            var odoo = new OdooApi(con.url, con.db);
            odoo.login(con.username, con.password).then(function (uid) {
                odoo.search('res.users', [['login', '=', con.username]], ['id', 'login', 'image', 'name']).then(function (value) {
                    var user = { id: null, name: null, image: null, login: null, cliente_id: null };
                    //self.mensaje += JSON.stringify(value);
                    if (value.length > 0) {
                        self.storage.set('CONEXION', con);
                        user.id = value[0].id;
                        user.name = value[0].name;
                        user.login = value[0].login;
                        self.auxProvider.filter_user = 'assigned';
                        self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__pages_treepick_treepick__["a" /* TreepickPage */]); //-> me voy para la home page
                        //self.navCtrl.setRoot(TreepickPage);
                        //self.navCtrl.setRoot(ShowinfoPage)
                    }
                    else {
                        self.cargar = false;
                        return self.presentAlert('Falla!', 'Usuario incorrecto');
                    }
                });
            });
        });
    };
    HomePage.prototype.get_picking_types = function () {
        var self = this;
        this.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                self.navCtrl.setRoot(HomePage_1, { borrar: true, login: null });
            }
            else {
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.search_read('stock.picking.type', [['show_in_pda', '=', true]], ['id', 'name', 'short_name'], 0, 0).then(function (value) {
                        self.storage.set('stock.picking.type', value);
                    }, function () {
                        self.cargar = false;
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.cargar = false;
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
                self.cargar = false;
            }
        });
    };
    HomePage.prototype.getObjectId = function (values) {
        var self = this;
        var object_id = {};
        var model = 'warehouse.app';
        var method = 'get_object_id';
        this.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                self.navCtrl.setRoot(HomePage_1, { borrar: true, login: null });
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.call(model, method, values).then(function (value) {
                        object_id = value;
                        self.cargar = false;
                    }, function () {
                        self.cargar = false;
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.cargar = false;
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
                self.cargar = false;
            }
            return object_id;
        });
    };
    HomePage = HomePage_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/home/home.html"*/'<ion-content>  \n  <form (ngSubmit)="this.conectarApp(true)">\n\n   <div>{{mensaje}}</div>\n   \n   <div style="text-align: center">\n       <img src="assets/imgs/icon.png" alt="Almacén"/>                        \n   </div> \n\n   <ion-list *ngIf="!cargar">\n     <ion-item>\n       <ion-label color="primary" stacked>Usuario</ion-label>\n       <ion-input type="email"  [(ngModel)]="CONEXION.username" required name=\'username\' placeholder="Ingresa Usuario"></ion-input>\n     </ion-item>\n\n     <ion-item>\n       <ion-label color="primary" stacked>Contraseña</ion-label>\n       <ion-input type="password" [(ngModel)]="CONEXION.password" required name=\'password\'  placeholder="Ingresa Contraseña"></ion-input>\n     </ion-item>\n     <ion-item>\n      <ion-label color="primary" stacked>URL</ion-label>\n      <ion-input [(ngModel)]="CONEXION.url" required name=\'url\'  placeholder="Ingresa url"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label color="primary" stacked>Port</ion-label>\n      <ion-input type="number" [(ngModel)]="CONEXION.port" required name=\'port\'  placeholder="Ingresa puerto"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label color="primary" stacked>Base de datos</ion-label>\n      <ion-input [(ngModel)]="CONEXION.db" required name=\'db\'  placeholder="Ingresa base de datos"></ion-input>\n    </ion-item>\n     <ion-item>\n       <button ion-button block type="submit">Login</button>\n     </ion-item>\n     <div style="text-align: center">\n     </div>\n   </ion-list>\n </form>\n \n <div *ngIf="cargar" style="text-align: center">    \n   <ion-spinner name="circles"></ion-spinner><br>\n   <b>Verificando...</b>\n </div>\n</ion-content>\n'/*ion-inline-end:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["h" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_network__["a" /* Network */], __WEBPACK_IMPORTED_MODULE_5__providers_aux_aux__["a" /* AuxProvider */]])
    ], HomePage);
    return HomePage;
    var HomePage_1;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 212:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(213);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(233);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 233:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_http__ = __webpack_require__(287);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_storage__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_network__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_file__ = __webpack_require__(288);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__app_component__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_home_home__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_treepick_treepick__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_treeops_treeops__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_slideop_slideop__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_manual_manual__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__providers_aux_aux__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_showinfo_showinfo__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_product_product__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_lot_lot__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_package_package__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_location_location__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__ionic_native_native_audio__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__providers_app_sound_app_sound__ = __webpack_require__(290);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









//Paginas














var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_9__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_10__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_treepick_treepick__["a" /* TreepickPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_treeops_treeops__["a" /* TreeopsPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_slideop_slideop__["a" /* SlideopPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_manual_manual__["a" /* ManualPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_showinfo_showinfo__["a" /* ShowinfoPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_lot_lot__["a" /* LotPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_location_location__["a" /* LocationPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_package_package__["a" /* PackagePage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_product_product__["a" /* ProductPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_9__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/location/location.module#LocationPageModule', name: 'LocationPage', segment: 'location', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/manual/manual.module#ManualPageModule', name: 'ManualPage', segment: 'manual', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/showinfo/showinfo.module#ShowinfoPageModule', name: 'ShowinfoPage', segment: 'showinfo', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/slideop/slideop.module#SlideopPageModule', name: 'SlideopPage', segment: 'slideop', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/treeops/treeops.module#TreeopsPageModule', name: 'TreeopsPage', segment: 'treeops', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/treepick/treepick.module#TreepickPageModule', name: 'TreepickPage', segment: 'treepick', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/product/product.module#ProductPageModule', name: 'ProductPage', segment: 'product', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/package/package.module#PackagePageModule', name: 'PackagePage', segment: 'package', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/lot/lot.module#LotPageModule', name: 'LotPage', segment: 'lot', priority: 'low', defaultHistory: [] }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_6__ionic_storage__["a" /* IonicStorageModule */].forRoot()
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_9__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_10__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_treepick_treepick__["a" /* TreepickPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_treeops_treeops__["a" /* TreeopsPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_slideop_slideop__["a" /* SlideopPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_manual_manual__["a" /* ManualPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_showinfo_showinfo__["a" /* ShowinfoPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_lot_lot__["a" /* LotPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_location_location__["a" /* LocationPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_package_package__["a" /* PackagePage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_product_product__["a" /* ProductPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_8__ionic_native_file__["a" /* File */],
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_network__["a" /* Network */],
                __WEBPACK_IMPORTED_MODULE_15__providers_aux_aux__["a" /* AuxProvider */],
                __WEBPACK_IMPORTED_MODULE_21__ionic_native_native_audio__["a" /* NativeAudio */],
                __WEBPACK_IMPORTED_MODULE_22__providers_app_sound_app_sound__["a" /* AppSoundProvider */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 289:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_treepick_treepick__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_manual_manual__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_showinfo_showinfo__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_aux_aux__ = __webpack_require__(54);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




//Paginas





var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen, auxProvider) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.auxProvider = auxProvider;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */];
        this.ops_filter = "Todas"; /*o pendientes*/
        this.initializeApp();
        this.pages = [
            { title: 'Mis albaranes', component: __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */], param: 'assigned' },
            { title: 'Sin asignar', component: __WEBPACK_IMPORTED_MODULE_5__pages_treepick_treepick__["a" /* TreepickPage */], param: 'no_assigned' },
            { title: 'Mov. Manual', component: __WEBPACK_IMPORTED_MODULE_6__pages_manual_manual__["a" /* ManualPage */], param: 'new_move' },
            { title: 'Info Etiqueta', component: __WEBPACK_IMPORTED_MODULE_7__pages_showinfo_showinfo__["a" /* ShowinfoPage */], param: 'info' },
            { title: 'Borrar Datos', component: __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */], param: 'delete' },
            { title: 'Imprimir etiqueta', component: __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */], param: 'print_tag' },
        ];
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        if (page.param == 'assigned') {
            this.auxProvider.filter_user = 'assigned';
        }
        if (page.param == 'no_assigned') {
            this.auxProvider.filter_user = 'no_assigned';
        }
        this.nav.setRoot(page.component, { filter_user: page.param });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/app/app.html"*/'<ion-menu [content]="content">\n    <ion-header>\n      <ion-toolbar>\n        <ion-title>Menu</ion-title>\n      </ion-toolbar>\n    </ion-header>\n  \n    <ion-content>\n      <ion-list>\n        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n          {{p.title}}\n        </button>\n      </ion-list>\n    </ion-content>\n  \n  </ion-menu>\n  \n  <!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n  <ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>'/*ion-inline-end:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_8__providers_aux_aux__["a" /* AuxProvider */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 290:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppSoundProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_native_audio__ = __webpack_require__(211);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/*
  Generated class for the AppSoundProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var AppSoundProvider = (function () {
    function AppSoundProvider(http, nativeAudio, platform) {
        this.http = http;
        this.nativeAudio = nativeAudio;
        this.audioType = 'html5';
        this.sounds = [];
        if (platform.is('cordova')) {
            this.audioType = 'native';
        }
    }
    AppSoundProvider.prototype.preload = function (key, asset) {
        if (this.audioType === 'html5') {
            var audio = {
                key: key,
                asset: asset,
                type: 'html5'
            };
            this.sounds.push(audio);
        }
        else {
            this.nativeAudio.preloadSimple(key, asset);
            var audio = {
                key: key,
                asset: key,
                type: 'native'
            };
            this.sounds.push(audio);
        }
    };
    AppSoundProvider.prototype.play = function (key) {
        var audio = this.sounds.find(function (sound) {
            return sound.key === key;
        });
        if (audio.type === 'html5') {
            var audioAsset = new Audio(audio.asset);
            audioAsset.play();
        }
        else {
            this.nativeAudio.play(audio.asset).then(function (res) {
                console.log(res);
            }, function (err) {
                console.log(err);
            });
        }
    };
    AppSoundProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_native_audio__["a" /* NativeAudio */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* Platform */]])
    ], AppSoundProvider);
    return AppSoundProvider;
}());

//# sourceMappingURL=app-sound.js.map

/***/ }),

/***/ 34:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LocationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the LocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LocationPage = (function () {
    function LocationPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    LocationPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad LocationPage');
    };
    LocationPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-location',template:/*ion-inline-start:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/location/location.html"*/'<!--\n  Generated template for the ProductPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n    <ion-navbar>\n      <ion-title>LOT: {{item && item.display_name || "Cargando ..."}}</ion-title>\n    </ion-navbar>\n  \n  </ion-header>\n  <ion-content>\n      <div *ngIf="!cargar" style="text-align: center">    \n        <ion-spinner name="circles"></ion-spinner><br>\n        <b>Cargando...</b>\n      </div>\n  \n      <ion-list *ngIf="cargar">\n        <ion-item-group> \n          \n          <ion-item class="all0">\n              <ion-badge item-end class="ion-info w100" >\n                  {{item.product_id.display_name}}\n              </ion-badge>\n          </ion-item>\n          <ion-item class="all0">\n              <ion-label></ion-label>\n              <ion-badge item-end class="ion-info w50">\n                  QTY {{item.qty_available}} {{item.uom_id.name}}\n              </ion-badge>\n          </ion-item>\n          <ion-item class="all0">\n              <ion-label></ion-label>\n              <ion-badge item-end class="ion-info w33">\n                  CAD {{item.usage}}\n              </ion-badge>\n              <ion-badge item-end class="ion-info w33" >\n                  DEL {{item.removal_date}}\n              </ion-badge>\n              <ion-badge item-end class="ion-info w33" >\n                  DEL {{item.removal_date}}\n              </ion-badge>\n          </ion-item>\n        </ion-item-group>    \n  \n        <ion-item-group [hidden] = "!item[\'quant_ids\']">\n          <ion-item  no-lines class="all0">\n              <ion-label></ion-label>\n              <ion-badge item-start color="odoolight" class="ion-info w50">LOTE </ion-badge>\n              <ion-badge item-start color="odoolight" class="ion-info w50">UBICACION </ion-badge>\n  \n          </ion-item>\n          <ion-item *ngFor="let subitem of item[\'quant_ids\']; trackBy: index;" no-lines class="all0">\n            <ion-label></ion-label>\n            <ion-badge  item-start color="odoo" class="ion-info w50" (click)="open(\'lot\', subitem[\'lot_id\'][\'id\'])">\n              {{subitem[\'display_name\']}}\n            </ion-badge>\n            <ion-badge item-start color="white" class="ion-info w50" (click)="open(\'location\', subitem[\'location_id\'][\'id\'])">\n              {{subitem[\'location_id\'][\'name\']}}\n            </ion-badge>\n          </ion-item>\n        </ion-item-group>\n              \n      </ion-list>\n  </ion-content>'/*ion-inline-end:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/location/location.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */]])
    ], LocationPage);
    return LocationPage;
}());

//# sourceMappingURL=location.js.map

/***/ }),

/***/ 35:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TreepickPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_aux_aux__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pages_home_home__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_treeops_treeops__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/*import { PROXY } from '../../providers/constants/constants';*/

/**
 * Generated class for the TreepickPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



var TreepickPage = (function () {
    function TreepickPage(navCtrl, navParams, alertCtrl, storage, auxProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.auxProvider = auxProvider;
        this.picks = [];
        this.cargar = true;
        this.fields = [];
        this.domain = [];
        this.uid = 0;
        this.picking_types = [];
        this.domain_state = [];
        this.domain_types = [];
        this.states_show = [];
        this.user = '';
        this.picking_type_id = 0;
        this.filter_user = '';
        this.states_show = auxProvider.get_pick_states_visible();
        if (this.navCtrl.getPrevious()) {
            this.navCtrl.remove(this.navCtrl.getPrevious().index, 2);
        }
        this.uid = 0;
        this.picks = [];
        this.picking_types = [];
        this.picking_type_id = 0;
        this.domain_types = [];
        this.filter_user = this.auxProvider.filter_user;
        this.domain_state = ['state', 'in', this.states_show];
        this.fields = ['id', 'name', 'state', 'partner_id_name', 'location_id_name', 'location_dest_id_name', 'picking_type_id_name', 'user_id', 'allow_validate'];
        this.get_picking_types();
        this.filter_picks(0);
    }
    TreepickPage.prototype.logOut = function () { this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__pages_home_home__["a" /* HomePage */], { borrar: true, login: null }); };
    TreepickPage.prototype.get_picks = function () {
        var self = this;
        self.cargar = true;
        self.picks = [];
        self.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__pages_home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                var con = val;
                var domain = [];
                domain.push(['pack_operation_ids', '!=', '[]']);
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    self.uid = uid;
                    if (self.domain_state != []) {
                        domain.push(self.domain_state);
                    }
                    if (self.domain_types != []) {
                        domain.push(self.domain_types);
                    }
                    if (self.auxProvider.filter_user == 'assigned') {
                        domain.push(['user_id', '=', uid]);
                    }
                    else {
                        domain.push(['user_id', '=', false]);
                    }
                    console.log(domain);
                    odoo.search_read('stock.picking', domain, self.fields, 0, 0).then(function (value) {
                        self.picks = [];
                        for (var key in value) {
                            self.picks.push(value[key]);
                        }
                        self.cargar = false;
                        self.storage.set('stock.picking', value);
                    }, function () {
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
            }
        });
    };
    TreepickPage.prototype.get_picking_types = function () {
        var _this = this;
        this.storage.get('stock.picking.type').then(function (val) {
            _this.picking_types = [];
            for (var key in val) {
                _this.picking_types.push(val[key]);
            }
        });
    };
    TreepickPage.prototype.filter_picks = function (picking_type_id) {
        if (picking_type_id === void 0) { picking_type_id = 0; }
        if (Boolean(picking_type_id)) {
            this.picking_type_id = picking_type_id;
        }
        if (this.picking_type_id == 0) {
            this.domain_types = ['picking_type_id', '!=', false];
        }
        else {
            this.domain_types = ['picking_type_id', '=', this.picking_type_id];
        }
        this.get_picks();
    };
    TreepickPage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    TreepickPage.prototype.ionViewDidLoad = function () {
    };
    TreepickPage.prototype.showtreeop_ids = function (pick_id) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__pages_treeops_treeops__["a" /* TreeopsPage */], { picking_id: pick_id });
    };
    TreepickPage.prototype.doAsign = function (pick_id) {
        this.change_pick_value(pick_id, 'user_id', this.uid);
        /*this.user='assigned';
        this.filter_picks(this.picking_type_id);*/
    };
    TreepickPage.prototype.doDeAsign = function (pick_id) {
        this.change_pick_value(pick_id, 'user_id', false);
        /*this.user='no_assigned';
        this.filter_picks(this.picking_type_id);*/
    };
    TreepickPage.prototype.change_pick_value = function (id, field, new_value) {
        var self = this;
        var model = 'stock.picking';
        var method = 'change_pick_value';
        var values = { 'id': id, 'field': field, 'value': new_value };
        var object_id;
        self.cargar = true;
        self.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__pages_home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.call(model, method, values).then(function (value) {
                        if (new_value) {
                            self.filter_user = 'assigned';
                            self.auxProvider.filter_user = 'assigned';
                        }
                        else {
                            self.filter_user = 'no_assigned';
                            self.auxProvider.filter_user = 'no_assigned';
                        }
                        self.filter_picks();
                    }, function () {
                        self.cargar = false;
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.cargar = false;
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
                self.cargar = false;
            }
        });
    };
    TreepickPage.prototype.doTransfer = function (id) {
        var self = this;
        var model = 'stock.picking';
        var method = 'doTransfer';
        var values = { 'id': id };
        var object_id = {};
        self.cargar = true;
        this.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__pages_home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.call(model, method, values).then(function (value) {
                        object_id = value;
                        self.filter_picks();
                    }, function () {
                        self.cargar = false;
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.cargar = false;
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
                self.cargar = false;
            }
        });
    };
    TreepickPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-treepick',template:/*ion-inline-start:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/treepick/treepick.html"*/'<!--\n  Generated template for the TreepickPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar color="primary">\n     \n        <button ion-button icon-only menuToggle>\n          <ion-icon name="menu"></ion-icon>\n        </button>\n  \n      <ion-title>Listado de Albaranes</ion-title>\n      <ion-buttons end>\n        <button ion-button (click)=\'logOut()\'>\n          <ion-icon name="log-out"></ion-icon>\n        </button>\n    </ion-buttons>\n  </ion-navbar>\n  \n <div class=\'noPadding\'>\n        <ion-segment *ngIf="!picking_types">\n            <ion-segment-button value="All" (click)="filter_picks(0)"><ion-icon name="apps"></ion-icon></ion-segment-button>\n        </ion-segment>\n        <ion-segment *ngIf="picking_types">\n          <ion-segment-button value="All" (click)="filter_picks(0)"><ion-icon name="apps"></ion-icon></ion-segment-button>\n          <ion-segment-button *ngFor="let pick_type of picking_types" value="{{ pick_type.name}}" (click)="filter_picks(pick_type.id)">{{ pick_type.short_name || pick_type.name }}</ion-segment-button>\n        </ion-segment>\n</div>\n\n</ion-header>\n\n<ion-content padding>\n  \n    <div *ngIf="cargar" style="text-align: center">    \n      <ion-spinner name="circles"></ion-spinner><br>\n      <b>Cargando...</b>\n    </div>\n   \n    <ion-list >         \n        <ion-item [hidden]=\'picks.length>0 || cargar\' color ="danger"> No hay albaranes</ion-item>\n\n        <ion-item text-wrap *ngFor="let pick of picks; trackBy: index;" class="all0" >\n            <ion-label></ion-label>\n            <button ion-button item-start class="buttonProduct" (click)="showtreeop_ids(pick.id)" [ngClass]="{\'pìckdone\': pick.state==\'done\'}">\n              {{pick.name}} <!--({{pick.state_2}} {{pick.picking_type_id_name}})-->\n            </button>  \n        \n            <button ion-button icon-only item-end  (click)="doAsign(pick.id)" [hidden]="pick.user_id">Asignar\n                <!--ion-icon name="person-add" color="secondary" ></ion-icon-->\n            </button>  \n            <button ion-button icon-only item-end  (click)="doDeAsign(pick.id)" [hidden]="!pick.user_id">Liberar\n                <!--ion-icon name="people" color="danger" ></ion-icon-->\n            </button>\n            <button ion-button icon-only item-end  (click)="doTransfer(pick.id)" [hidden]=\'!pick.allow_transfer\'>Validar\n            </button>\n        </ion-item>\n    </ion-list> \n    </ion-content>\n  '/*ion-inline-end:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/treepick/treepick.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_2__providers_aux_aux__["a" /* AuxProvider */]])
    ], TreepickPage);
    return TreepickPage;
}());

//# sourceMappingURL=treepick.js.map

/***/ }),

/***/ 46:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LotPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__location_location__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__package_package__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__product_product__ = __webpack_require__(48);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


//import { ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

//import { HostListener } from '@angular/core';

//*Pagians

//import { LotPage } from '../lot/lot';



var LotPage = (function () {
    function LotPage(navCtrl, toastCtrl, storage, navParams, alertCtrl) {
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.storage = storage;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.model = this.navParams.data.model;
        this.id = this.navParams.data.id;
        this.item = [];
        this.cargar = false;
        this.loaditem();
    }
    LotPage_1 = LotPage;
    LotPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad LotPage');
    };
    LotPage.prototype.loaditem = function () {
        var self = this;
        var model = 'warehouse.app';
        var method = 'get_info_object';
        var values = { 'model': this.model, 'id': this.id };
        self.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.call(model, method, values).then(function (value) {
                        self.cargar = Boolean(value['id']);
                        self.item = value['values'];
                        //AQUI DECIDO QUE HACER EN FUNCION DE LO QUE RECIBO
                        //self.openinfo(value)
                    }, function () {
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
            }
        });
    };
    LotPage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    LotPage.prototype.open = function (model, id) {
        var page;
        switch (model) {
            case 'lot':
                page = LotPage_1;
                break;
            case 'location':
                page = __WEBPACK_IMPORTED_MODULE_4__location_location__["a" /* LocationPage */];
                break;
            case 'package':
                page = __WEBPACK_IMPORTED_MODULE_5__package_package__["a" /* PackagePage */];
                break;
            case 'product':
                page = __WEBPACK_IMPORTED_MODULE_6__product_product__["a" /* ProductPage */];
                break;
        }
        if (page && id) {
            this.navCtrl.push(page, { model: model, id: id });
        }
    };
    LotPage = LotPage_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-lot',template:/*ion-inline-start:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/lot/lot.html"*/'<!--\n  Generated template for the ProductPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n    <ion-navbar>\n      <ion-title>LOT: {{item && item.display_name || "Cargando ..."}}</ion-title>\n    </ion-navbar>\n  \n  </ion-header>\n  <ion-content>\n      <div *ngIf="!cargar" style="text-align: center">    \n        <ion-spinner name="circles"></ion-spinner><br>\n        <b>Cargando...</b>\n      </div>\n  \n      <ion-list *ngIf="cargar">\n        <ion-item-group> \n          \n          <ion-item class="all0">\n              <ion-badge item-end class="ion-info w100" >\n                  {{item.product_id.display_name}}\n              </ion-badge>\n          </ion-item>\n          <ion-item class="all0">\n              <ion-label></ion-label>\n              <ion-badge item-end class="ion-info w50">\n                  QTY {{item.qty_available}} {{item.uom_id.name}}\n              </ion-badge>\n          </ion-item>\n          <ion-item class="all0">\n              <ion-label></ion-label>\n              <ion-badge item-end class="ion-info w50">\n                  CAD {{item.use_date}}\n              </ion-badge>\n              <ion-badge item-end class="ion-info w50" >\n                  DEL {{item.removal_date}}\n              </ion-badge>\n          </ion-item>\n        </ion-item-group>    \n  \n        <ion-item-group [hidden] = "!item[\'quant_ids\']">\n          <ion-item  no-lines class="all0">\n              <ion-label></ion-label>\n              <ion-badge item-start color="odoolight" class="ion-info w50">LOTE </ion-badge>\n              <ion-badge item-start color="odoolight" class="ion-info w50">UBICACION </ion-badge>\n  \n          </ion-item>\n          <ion-item *ngFor="let subitem of item[\'quant_ids\']; trackBy: index;" no-lines class="all0">\n            <ion-label></ion-label>\n            <ion-badge  item-start color="odoo" class="ion-info w50" (click)="open(\'lot\', subitem[\'lot_id\'][\'id\'])">\n              {{subitem[\'display_name\']}}\n            </ion-badge>\n            <ion-badge item-start color="white" class="ion-info w50" (click)="open(\'location\', subitem[\'location_id\'][\'id\'])">\n              {{subitem[\'location_id\'][\'name\']}}\n            </ion-badge>\n          </ion-item>\n        </ion-item-group>\n              \n      </ion-list>\n  </ion-content>'/*ion-inline-end:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/lot/lot.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], LotPage);
    return LotPage;
    var LotPage_1;
}());

//# sourceMappingURL=lot.js.map

/***/ }),

/***/ 47:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PackagePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lot_lot__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__location_location__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__product_product__ = __webpack_require__(48);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


//import { ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

//import { HostListener } from '@angular/core';

//*Pagians



//import { PackagePage } from '../package/package';

var PackagePage = (function () {
    function PackagePage(navCtrl, toastCtrl, storage, navParams, alertCtrl) {
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.storage = storage;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.model = this.navParams.data.model;
        this.id = this.navParams.data.id;
        this.item = [];
        this.cargar = false;
        this.loaditem();
    }
    PackagePage_1 = PackagePage;
    PackagePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ProductPage');
    };
    PackagePage.prototype.loaditem = function () {
        var self = this;
        var model = 'warehouse.app';
        var method = 'get_info_object';
        var values = { 'model': this.model, 'id': this.id };
        self.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.call(model, method, values).then(function (value) {
                        self.cargar = Boolean(value['id']);
                        self.item = value['values'];
                        //AQUI DECIDO QUE HACER EN FUNCION DE LO QUE RECIBO
                        //self.openinfo(value)
                    }, function () {
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
            }
        });
    };
    PackagePage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    PackagePage.prototype.open = function (model, id) {
        var page;
        switch (model) {
            case 'stock.production.lot':
                page = __WEBPACK_IMPORTED_MODULE_4__lot_lot__["a" /* LotPage */];
                break;
            case 'stock.location':
                page = __WEBPACK_IMPORTED_MODULE_5__location_location__["a" /* LocationPage */];
                break;
            case 'stock.quant.package':
                page = PackagePage_1;
                break;
            case 'product.product':
                page = __WEBPACK_IMPORTED_MODULE_6__product_product__["a" /* ProductPage */];
                break;
        }
        if (page && id) {
            this.navCtrl.push(page, { model: model, id: id });
        }
    };
    PackagePage = PackagePage_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-package',template:/*ion-inline-start:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/package/package.html"*/'<!--\n  Generated template for the ProductPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n    <ion-navbar>\n      <ion-title>PACK: {{item && item.name || "Cargando ..."}}</ion-title>\n    </ion-navbar>\n  \n  </ion-header>\n  <ion-content>\n      <div *ngIf="!cargar" style="text-align: center">    \n        <ion-spinner name="circles"></ion-spinner><br>\n        <b>Cargando...</b>\n      </div>\n  \n      <ion-list *ngIf="cargar">\n        <ion-item-group> \n          <ion-item class="all0">\n            <ion-label></ion-label>\n            <ion-badge item-end class="ion-info w100" (click)="open(\'product.product\', item.product_id.id)">\n                {{item.product_id.name}}\n            </ion-badge>\n          </ion-item>\n\n          <ion-item class="all0">\n              <ion-label></ion-label>\n              <ion-badge item-end class="ion-info w50"  (click)="open(\'stock.production.lot\', item.lot_id.id)">\n                  LOT {{item.lot_id.name}}\n              </ion-badge>\n              <ion-badge item-end class="ion-info w50">\n                  {{item.package_qty}} {{item.uom_id.name}}\n              </ion-badge>\n          </ion-item>\n          \n          <ion-item class="all0">\n              <ion-label></ion-label>\n              \n              <ion-badge item-end class="ion-info w50"  (click)="open(\'stock.location\', item.location_id.id)">\n                  UBI {{item.location_id.name}}\n              </ion-badge>\n          </ion-item>\n        </ion-item-group>    \n  \n        <ion-item-group [hidden] = "!item[\'quant_ids\']">\n          <ion-item  no-lines class="all0">\n              <ion-label></ion-label>\n              <ion-badge item-start color="odoolight" class="ion-info w50">QTY </ion-badge>\n              <ion-badge item-start color="odoolight" class="ion-info w50">ENTRADA </ion-badge>\n  \n          </ion-item>\n          <ion-item *ngFor="let subitem of item[\'quant_ids\']; trackBy: index;" no-lines class="all0">\n            <ion-label></ion-label>\n            <ion-badge item-start color="odoo" class="ion-info w50" [ngClass]="{\'not_op_done\': reservation_id != false}">\n                {{subitem.display_name}}\n            </ion-badge>\n            <ion-badge item-start color="white" class="ion-info w50">\n              {{subitem.in_date}}\n            </ion-badge>\n          </ion-item>\n\n        </ion-item-group>\n              \n      </ion-list>\n  </ion-content>\n  '/*ion-inline-end:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/package/package.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], PackagePage);
    return PackagePage;
    var PackagePage_1;
}());

//# sourceMappingURL=package.js.map

/***/ }),

/***/ 48:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProductPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lot_lot__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__location_location__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__package_package__ = __webpack_require__(47);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


//import { ViewChild } from '@angular/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

//import { HostListener } from '@angular/core';

//*Pagians




var ProductPage = (function () {
    function ProductPage(navCtrl, toastCtrl, storage, navParams, alertCtrl) {
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.storage = storage;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.model = this.navParams.data.model;
        this.id = this.navParams.data.id;
        this.item = [];
        this.cargar = false;
        this.loaditem();
    }
    ProductPage_1 = ProductPage;
    ProductPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ProductPage');
    };
    ProductPage.prototype.loaditem = function () {
        var self = this;
        var model = 'warehouse.app';
        var method = 'get_info_object';
        var values = { 'model': this.model, 'id': this.id };
        self.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.call(model, method, values).then(function (value) {
                        self.cargar = Boolean(value['id']);
                        self.item = value['values'];
                        //AQUI DECIDO QUE HACER EN FUNCION DE LO QUE RECIBO
                        //self.openinfo(value)
                    }, function () {
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
            }
        });
    };
    ProductPage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    ProductPage.prototype.open = function (model, id) {
        var page;
        switch (model) {
            case 'stock.production.lot':
                page = __WEBPACK_IMPORTED_MODULE_4__lot_lot__["a" /* LotPage */];
                break;
            case 'stock.location':
                page = __WEBPACK_IMPORTED_MODULE_5__location_location__["a" /* LocationPage */];
                break;
            case 'stock.quant.package':
                page = __WEBPACK_IMPORTED_MODULE_6__package_package__["a" /* PackagePage */];
                break;
            case 'product.product':
                page = ProductPage_1;
                break;
        }
        if (page && id) {
            this.navCtrl.push(page, { model: model, id: id });
        }
    };
    ProductPage = ProductPage_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-product',template:/*ion-inline-start:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/product/product.html"*/'<!--\n  Generated template for the ProductPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>{{item && item.display_name || "Cargando ..."}}</ion-title>\n  </ion-navbar>\n\n</ion-header>\n<ion-content>\n    <div *ngIf="!cargar" style="text-align: center">\n      <ion-spinner name="circles"></ion-spinner><br>\n      <b>Cargando...</b>\n    </div>\n\n    <ion-list *ngIf="cargar">\n      <ion-item-group>\n\n        <ion-item class="all0">\n            <ion-label></ion-label>\n            <ion-badge item-end class="ion-info" w50>\n                {{item.qty_available}} {{item.uom_id[[\'name\']]}}\n            </ion-badge>\n        </ion-item>\n\n        <ion-item class="all0">\n            <ion-label></ion-label>\n            <ion-badge item-end class="ion-info w50">\n                EAN {{item.barcode}}\n            </ion-badge>\n            <ion-badge item-end class="ion-info w50" >\n                REF {{item.default_code}}\n            </ion-badge>\n        </ion-item>\n      </ion-item-group>\n\n      <ion-item-group [hidden] = "!item[\'quant_ids\']">\n        <ion-item  no-lines class="all0">\n            <ion-label></ion-label>\n            <ion-badge item-start color="odoolight" class="ion-info w50">LOTE </ion-badge>\n            <ion-badge item-start color="odoolight" class="ion-info w50">UBICACION </ion-badge>\n\n        </ion-item>\n        <ion-item *ngFor="let subitem of item[\'quant_ids\']; trackBy: index;" no-lines class="all0">\n          <ion-label></ion-label>\n          <ion-badge item-start color="odoo" class="ion-info w50" (click)="open(\'stock.production.lot\', subitem[\'lot_id\'][\'id\'])">\n              {{subitem[\'display_name\']}}\n          </ion-badge>\n\n          <ion-badge item-start color="white" class="ion-info w50" (click)="open(\'stock.location\', subitem[\'location_id\'][\'id\'])">\n            {{subitem[\'location_id\'][\'name\']}}\n          </ion-badge>\n        </ion-item>\n      </ion-item-group>\n\n    </ion-list>\n</ion-content>\n'/*ion-inline-end:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/product/product.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], ProductPage);
    return ProductPage;
    var ProductPage_1;
}());

//# sourceMappingURL=product.js.map

/***/ }),

/***/ 54:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuxProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

/*
  Generated class for the AuxProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var AuxProvider = (function () {
    function AuxProvider() {
        this.pick_states_visible = [];
        this.filter_user = 'assigned';
        this.pick_states_visible = ['partially_available', 'assigned'];
        console.log('Hello AuxProvider Provider');
    }
    AuxProvider.prototype.set_filter_user = function (new_filter) {
        this.filter_user = new_filter;
    };
    AuxProvider.prototype.get_filter_user = function () {
        return this.filter_user;
    };
    AuxProvider.prototype.set_pick_states_visible = function (new_states) {
        var self = this;
        self.pick_states_visible = new_states;
    };
    AuxProvider.prototype.get_pick_states_visible = function () {
        var self = this;
        return self.pick_states_visible;
    };
    AuxProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], AuxProvider);
    return AuxProvider;
}());

//# sourceMappingURL=aux.js.map

/***/ }),

/***/ 59:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TreeopsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__slideop_slideop__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__treepick_treepick__ = __webpack_require__(35);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/*import { PROXY } from '../../providers/constants/constants';*/


/**
 * Generated class for the TreepickPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */




var TreeopsPage = (function () {
    function TreeopsPage(navCtrl, navParams, formBuilder, alertCtrl, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.op_fields = ['id', 'pda_checked', 'pda_done', 'product_id', 'product_uom', 'product_qty', 'qty_done', 'package_id', 'lot_id', 'location_id'];
        this.pick_fields = ['id', 'name', 'location_id_name', 'location_dest_id_name', 'min_date', 'picking_type_id_name', 'state', 'partner_id_name', 'done_ops', 'all_ops'];
        this.items = [];
        this.picks = [];
        this.pick = {};
        this.cargar = true;
        this.pick_id = 0;
        this.limit = 25;
        this.offset = 0;
        this.order = 'picking_order, product_id asc';
        this.model = 'stock.pack.operation';
        this.domain = [];
        this.pick_domain = [];
        this.record_count = 0;
        this.isPaquete = true;
        this.isProducto = false;
        this.pick_name = '';
        this.pick_type = '';
        this.selected_picking = {};
        this.scan = '';
        this.ops = [];
        this.model_fields = { 'stock.quant.package': 'package_id', 'stock.location': 'location_id', 'stock.production.lot': 'lot_id' };
        this.items = [];
        this.picks = [];
        this.pick = {};
        this.pick_id = this.navParams.data.picking_id;
        this.domain = [['picking_id', '=', this.pick_id]];
        this.pick_domain = [['id', '=', this.pick_id]];
        this.record_count = 0;
        this.pick_name = 'Nombre albarán';
        this.pick_type = 'pick_type';
        this.selected_picking = {};
        this.scan = '';
        this.storage.get('WhatOps').then(function (val) {
            if (val == null) {
                _this.whatOps = 'Todas';
            }
            else {
                _this.whatOps = val;
            }
        });
        this.treeForm = this.formBuilder.group({
            scan: ['']
        });
    }
    TreeopsPage.prototype.handleKeyboardEvent = function (event) {
        this.myScanPackage.setFocus();
    };
    TreeopsPage.prototype.ionViewWillEnter = function () {
        this.loadList();
    };
    TreeopsPage.prototype.seeAll = function () {
        if (this.whatOps == 'Todas') {
            this.whatOps = 'Pendientes';
        }
        else {
            this.whatOps = 'Todas';
        }
        this.storage.set('WhatOps', this.whatOps);
    };
    TreeopsPage.prototype.ionViewLoaded = function () {
        var _this = this;
        setTimeout(function () {
            _this.myScanPackage.setFocus();
        }, 150);
    };
    TreeopsPage.prototype.goHome = function () { this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_6__treepick_treepick__["a" /* TreepickPage */], { borrar: true, login: null }); };
    TreeopsPage.prototype.loadList = function () {
        var self = this;
        self.items = [];
        this.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay');
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                console.log('hay');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.search_read(self.model, self.domain, self.op_fields, self.offset, self.limit, self.order).then(function (value) {
                        self.items = [];
                        var newOP = {};
                        self.ops = [];
                        for (var key in value) {
                            self.items.push(value[key]);
                        }
                        for (var key in self.items) {
                            newOP = { 'index': key,
                                'id': self.items[key]['id'],
                                'pda_done': self.items[key['pda_done']] };
                            self.ops.push(newOP);
                        }
                        self.record_count = self.items.length;
                        self.cargar = false;
                        self.storage.set(self.model, value);
                    }, function () {
                        self.navParams.data.op_id;
                        self.cargar = false;
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.cargar = false;
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.search_read('stock.picking', self.pick_domain, self.pick_fields).then(function (value) {
                        for (var key in value) {
                            self.picks.push(value[key]);
                        }
                        console.log("Pick " + self.picks['name']);
                        self.pick = self.picks[0];
                        self.cargar = false;
                        self.storage.set('stock.picking', value);
                    }, function () {
                        self.cargar = false;
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.cargar = false;
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
                self.cargar = false;
            }
            ;
            self.selected_picking = { 'pick': self.pick, 'ops': self.items };
        });
    };
    TreeopsPage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    TreeopsPage.prototype.loadNext = function () {
        this.offset = Math.max(this.offset + this.limit, this.record_count - this.limit);
        this.loadList();
    };
    TreeopsPage.prototype.loadPrev = function () {
        this.offset = Math.min(0, this.offset - this.limit);
        this.loadList();
    };
    TreeopsPage.prototype.notify_do_op = function (op_id) {
        console.log("Do op");
    };
    TreeopsPage.prototype.openOp = function (op_id, op_id_index) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__slideop_slideop__["a" /* SlideopPage */], { op_id: op_id, index: op_id_index, ops: this.ops });
    };
    TreeopsPage.prototype.submitScan = function () {
        this.getObjectId({ 'model': ['stock.location', 'stock.quant.package', 'stock.production.lot'], 'search_str': this.treeForm.value['scan'] });
        this.treeForm.reset();
    };
    TreeopsPage.prototype.findId = function (value) {
        for (var op in this.items) {
            var opObj = this.items[op];
            console.log(opObj);
            if (opObj[this.model_fields[value['model']]][0] == value['id']) {
                return { 'op_id': opObj['id'], 'index': op, 'ops': this.items, 'origin': true };
            }
        }
        return false;
    };
    TreeopsPage.prototype.getObjectId = function (values) {
        var self = this;
        var object_id = {};
        var model = 'warehouse.app';
        var method = 'get_object_id';
        self.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.call(model, method, values).then(function (value) {
                        setTimeout(function () {
                            var res = self.findId(value);
                            if (res) {
                                self.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__slideop_slideop__["a" /* SlideopPage */], res);
                            }
                        }, 150);
                    }, function () {
                        self.cargar = false;
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.cargar = false;
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
            }
        });
    };
    TreeopsPage.prototype.doTransfer = function (id) {
        var _this = this;
        var self = this;
        var model = 'stock.picking';
        var method = 'doTransfer';
        var values = { 'id': id };
        var object_id = {};
        this.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.call(model, method, values).then(function (value) {
                        object_id = value;
                        self.cargar = false;
                        self.loadList();
                    }, function () {
                        self.cargar = false;
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.cargar = false;
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
                self.cargar = false;
            }
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__treepick_treepick__["a" /* TreepickPage */]);
        });
    };
    TreeopsPage.prototype.doOp = function (id, do_id) {
        var self = this;
        var model = 'stock.pack.operation';
        var method = 'doOp';
        var values = { 'id': id, 'do_id': do_id };
        var object_id;
        this.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.call(model, method, values).then(function (value) {
                        object_id = value;
                        /*self.ionViewLoaded()*/
                        self.loadList();
                    }, function () {
                        self.cargar = false;
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.cargar = false;
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
                self.cargar = false;
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('scanPackage'),
        __metadata("design:type", Object)
    ], TreeopsPage.prototype, "myScanPackage", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["y" /* HostListener */])('document:keydown', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [KeyboardEvent]),
        __metadata("design:returntype", void 0)
    ], TreeopsPage.prototype, "handleKeyboardEvent", null);
    TreeopsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-treeops',template:/*ion-inline-start:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/treeops/treeops.html"*/'<!--\n  Generated template for the TreepickPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  \n  \n  <ion-navbar color="primary">\n      <button ion-button icon-only menuToggle>\n        <ion-icon name="menu"></ion-icon>\n      </button>\n      <ion-title>{{ pick.name}} [{{ pick.done_ops }} / {{pick.all_ops}}]</ion-title>\n      <ion-buttons end>\n        <button ion-button (click)="goHome()">\n          <ion-icon name="home"></ion-icon>\n        </button>\n      </ion-buttons>\n  </ion-navbar>        \n  <!--ion-item no-lines class=\'noPadding\'>   \n    <ion-label class=\'noPadding\' color="primary"> {{ pick.picking_type_id_name}} </ion-label>\n  </ion-item-->\n  \n</ion-header>\n\n<ion-content padding>\n  \n    <div *ngIf="!items" style="text-align: center" no-lines >    \n      <ion-spinner name="circles"></ion-spinner><br>\n      <b>Cargando...</b>\n    </div>\n\n  <ion-list class="noPadding">\n    <ion-item-group>\n      \n      <ion-item class=\'all0\'>   \n        <ion-label></ion-label>\n        <button ion-button item-start (click)="seeAll()">{{whatOps}}</button>\n        <button ion-button item-end (click)="doTransfer(pick.id)" [hidden]=\'pick.state == done || pick.done_ops == 0\' color=\'odoo\'>Validar</button>\n        <!--button ion-button item-end (click)="doAssign(false)" [hidden]=\'pick.user_id\'>Liberar</button-->\n        <button ion-button item-end (click)="doAssign(pick.id)" [hidden]=\'!pick.user_id\'>Asignarme</button>\n        <!--button ion-button item-end (click)="refresh(pick.id)">Refrescar</button-->\n      </ion-item>\n      <ion-item no-lines class=\'all0\'>   \n        <ion-badge color="primary">{{pick.state}} </ion-badge>\n        <ion-label color="primary">{{pick.location_id_name}} >> {{ pick.location_dest_id_name}}</ion-label>          \n        </ion-item>\n      </ion-item-group>        \n      <ion-item-group *ngFor="let item of items; trackBy: index;">\n      <ion-item-group [hidden] = "whatOps==\'Pendientes\' && item.pda_done">\n        <ion-item no-lines class="all0">\n          <ion-label></ion-label>\n          <button ion-button item-end (click)="openOp(item.id, item.index)" class=\'buttonProduct w100\'> {{item.product_id[1] || \'\'}}</button>\n        </ion-item>\n        <ion-item class="all0">\n          <ion-label></ion-label>\n          <ion-badge item-end class="ion-info">\n              {{item.package_id[0] && item[\'package_id\'][1] || item.lot_id[0] && item[\'lot_id\'][1]}}\n          </ion-badge> \n          <ion-badge item-end class="ion-info" color=\'danger\'[ngClass]="{\'badge_0\': item.pda_done}">{{ item.product_qty - item.qty_done }} {{item.product_uom[1]}}</ion-badge> \n        </ion-item>\n      </ion-item-group>\n    </ion-item-group>\n  </ion-list>\n   \n\n  </ion-content>\n  <ion-footer>\n    <form [formGroup]="treeForm" class ="alignBottom">\n     <ion-item  >\n        <ion-label color="odoo" item-start>Scan: </ion-label>\n        <ion-input #scanPackage [formControl]="treeForm.controls[\'scan\']" type="text" name="scan" placeholder = "Scan"  autofocus></ion-input>\n       \n        <button ion-button icon-only item-end clear (click)="submitScan()">\n          <ion-icon name="barcode"></ion-icon>\n        </button>\n      </ion-item>   \n    </form>\n  </ion-footer>\n      '/*ion-inline-end:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/treeops/treeops.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
    ], TreeopsPage);
    return TreeopsPage;
}());

//# sourceMappingURL=treeops.js.map

/***/ })

},[212]);
//# sourceMappingURL=main.js.map