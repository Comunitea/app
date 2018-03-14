webpackJsonp([10],{

/***/ 110:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SlideopPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__treeops_treeops__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__treepick_treepick__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_storage__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__serialnumber_serialnumber__ = __webpack_require__(111);
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
    function SlideopPage(navCtrl, modalCtrl, toastCtrl, navParams, formBuilder, alertCtrl, storage) {
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
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
        this.source_model = 'stock.picking';
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
        this.state = 0; /* 0 espera origen, 1 cantidad yo destino 2 destino*/
        this.input = 0;
        this.op_id = 0;
        this.last_read = 0;
        this.waiting = 0;
        this.pick = [];
        this.last_id = 0;
        this.last_qty = 0.00;
        this.orig_model = '';
        this.op_id = this.navParams.data.op_id;
        this.source_model = this.navParams.data.source_model;
        this.pick_id = this.navParams.data.pick_id;
        this.index = Number(this.navParams.data.index || 0);
        this.ops = this.navParams.data.ops;
        this.last_id = this.op_id;
        this.last_qty = 0.00;
        this.pick = [];
        this.reconfirm = false;
        if (!this.ops) {
            this.presentToast('Aviso:No hay operaciones', false);
        }
        this.index = Number(this.navParams.data.index || 0);
        this.barcodeForm = this.formBuilder.group({ scan: [''] });
        this.resetValues();
        this.loadOpObj(this.op_id);
        this.check_new_state();
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
        this.last_read = 0;
        this.op_selected = { 'lot_id': 0, 'package_id': 0, 'location_id': 0, 'product_id': 0, 'location_dest_id': 0, 'result_package_id': 0, 'qty_done': 0 };
        this.input = 0;
        console.log(this.source_model);
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
        this.loadOpObj(this.op_id);
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
                    var model = self.source_model;
                    var fields = self.pick_fields;
                    var domain = [['id', '=', self.pick_id]];
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
                            self.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__treeops_treeops__["a" /* TreeopsPage */], { picking_id: self.pick_id, move_to_op: value['new_op'], source_model: this.source_model });
                            return;
                        }
                        var showClose = !value['result'];
                        self.presentToast(value['message'], showClose);
                        self.cargar = false;
                        self.loadOpObj();
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
        var values = { 'model': ['stock.quant.package', 'stock.production.lot', 'stock.location', 'product.product'], 'search_str': this.barcodeForm.value['scan'] };
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
    SlideopPage.prototype.check_submit = function (value) {
        var confirm = this.reconfirm || (this.last_read == value.id);
        this.check_returned_value(value);
        this.check_new_state();
        /*if (self.waiting>=4 && self.op['location_dest_id']['need_check'] && !self.cargar){
            self.doOp(self.op_id);
        }*/
        this.scan_id = value;
        this.myScan.setFocus();
        return value;
    };
    SlideopPage.prototype.submit = function (values) {
        if (this.check_changes()) {
            return;
        }
        var res = this.find_in_op(values);
        if (res) {
            return this.check_submit(res);
        }
        this.last_read = values['search_str'];
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
                        //AQUI DECIDO QUE HACER EN FUNCION DE LO QUE RECIBO
                        confirm = self.reconfirm || (self.last_read == value.id);
                        self.check_returned_value(value);
                        self.check_new_state();
                        /*if (self.waiting>=4 && self.op['location_dest_id']['need_check'] && !self.cargar){
                            self.doOp(self.op_id);
                        }*/
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
    SlideopPage.prototype.SerialtoOp = function (id, serial, lot_id, option, qty) {
        if (lot_id === void 0) { lot_id = false; }
        if (option === void 0) { option = 'add'; }
        if (qty === void 0) { qty = 0; }
        if (this.check_changes()) {
            return;
        }
        this.cargar = true;
        var self = this;
        var model = 'stock.pack.operation';
        var method = 'SerialtoOp';
        var values = { 'id': id, 'serial': serial, 'option': option, 'qty': qty, 'lot_id': lot_id };
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
                                if (Boolean(value['id'])) {
                                    self.domain = [['id', '=', id]];
                                    self.loadOpObj(id);
                                }
                                else {
                                    self.presentAlert("Error", value['message']);
                                    self.loadOpObj(id);
                                }
                            }, 25);
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
    SlideopPage.prototype.get_next_op = function (id, index) {
        var self = this;
        var domain = [];
        var ops = self.ops.filter(function (op) {
            return op.pda_done == false && op.id != id;
        });
        console.log(ops);
        if (ops.length == 0) {
            return false;
        }
        index = index + 1;
        if (index > (self.ops.length - 1)) {
            index = 0;
        }
        ;
        if (self.op[index].pda_done) {
            return self.get_next_op(id, index);
        }
        return self.ops[index]['id'] || false;
    };
    SlideopPage.prototype.doOp = function (id) {
        if (this.check_changes()) {
            return;
        }
        var self = this;
        self.cargar = true;
        var model = 'stock.pack.operation';
        var method = 'doOp';
        var values = { 'id': id, 'qty_done': self.op_selected['qty_done'] };
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
                        var _this = this;
                        {
                            setTimeout(function () {
                                self.ops[self.index]['pda_done'] = true;
                                self.op['pda_done'] = true;
                                self.cargar = false;
                                if (self.get_next_op(id, self.index) == false) {
                                    self.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__treeops_treeops__["a" /* TreeopsPage */], { pick_id: _this.pick_id, source_model: _this.source_model });
                                }
                                else {
                                    if (Boolean(value)) {
                                        id = self.get_next_op(id, self.index);
                                        self.loadOpObj(id);
                                    }
                                    else {
                                        self.presentToast(value);
                                        self.loadOpObj(id);
                                    }
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
    SlideopPage.prototype.addQty = function (id, qty) {
        this.op_selected['qty_done'] += qty;
        var package_qty = this.op['package_id'] && this.op['package_id']['package_qty'] || this.op_selected['qty_done'];
        this.op_selected['qty_done'] = Math.max(this.op_selected['qty_done'], 0);
        this.op_selected['qty_done'] = Math.min(this.op_selected['qty_done'], package_qty);
        //this.op_selected['qty_done']= this.op['qty_done']
        this.check_new_state();
    };
    SlideopPage.prototype.inputQty = function () {
        if (this.op['tracking'] != 'none') {
            return;
        }
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
                    placeholder: (self.op_selected['qty_done'] && self.op['qty_done']).toString()
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
                            //self.op['qty_done'] = data.qty
                            self.op_selected['qty_done'] = data.qty;
                            self.check_new_state();
                        }
                        self.input = 0;
                    }
                }
            ]
        });
        self.input = alert._state;
        alert.present();
    };
    SlideopPage.prototype.addSerial = function (option) {
        if (option === void 0) { option = 'add'; }
        var message = { 'add': 'Añadir un número de serie', 'remove': "Eliminar un número de serie", 'qty': "Introduce cantidad" };
        var self = this;
        if (self.waiting < 1 && self.waiting > 4) {
            return;
        }
        var alert = this.alertCtrl.create({
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
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Aplicar',
                    handler: function (data) {
                        console.log('Saved clicked');
                        console.log(data.serial);
                        self.SerialtoOp(self.op_id, data.serial, false, option, 1);
                        self.input = 0;
                    }
                }
            ]
        });
        self.input = alert._state;
        alert.present();
    };
    SlideopPage.prototype.showSerial = function () {
        var _this = this;
        var op = { 'id': this.op_id, 'product_id': this['op']['pda_product_id'], 'qty_done': this['op']['qty_done'] };
        var myModal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_7__serialnumber_serialnumber__["a" /* SerialnumberPage */], { 'op': op, 'pack_lot_ids': this['op']['pack_lot_ids'] });
        myModal.present();
        myModal.onDidDismiss(function (data) {
            if (data) {
                _this['op_selected']['qty_done'] = data.qty_done;
                _this['op']['pack_lot_ids'] = data.pack_lot_ids;
            }
            //this.presentAlert('Modal', data && data.message)
        });
    };
    SlideopPage.prototype.loadOpObj = function (id) {
        if (id === void 0) { id = 0; }
        this.last_id = this.op_id;
        this.last_qty = this.op_selected['qty_done'];
        var self = this;
        var model = 'warehouse.app';
        var method = 'get_object_id';
        if (id == 0) {
            id = this.op_id;
        }
        var values = { 'id': id, 'model': 'stock.pack.operation' };
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
                    odoo.call(model, method, values).then(function (res) {
                        if (res['id'] != 0) {
                            self.state = 0;
                            self.waiting = 0;
                            self.op = res['values'];
                            self.check_loaded_values();
                            return true;
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
    SlideopPage.prototype.check_loaded_values = function () {
        if (this.op_id == this.last_id && !Boolean(this.op_selected) && this.op_selected['qty_done'] > 0.00) {
            this.op['qty_done'] = this.op_selected['qty_done'];
        }
        if (this.op['result_package_id']) {
            this.op_selected['result_package_id'] = this.op['result_package_id'];
        }
        if (this.source_model == 'stock.picking') {
            this.pick = this.op['picking_id'];
        }
        else {
            this.cargarPick();
        }
        this.cargar = false;
    };
    SlideopPage.prototype.check_new_state = function () {
        if (this.op['pda_done']) {
            this.waiting = -1;
            this.state = 0;
            return;
        }
        var waiting = this.waiting;
        var ops = this.op_selected;
        if (waiting <= 5) {
            if (ops['package_id']) {
                waiting = 1;
            }
            if (ops['pack_lot_ids']) {
                waiting = 2;
            }
            if (ops['product_id']) {
                waiting = 3;
            }
            if (waiting >= 3) {
                if (!this.op['location_id']['need_check'] || ops['location_id']) {
                    if (ops['qty_done']) {
                        waiting = 6;
                    }
                    else {
                        waiting = 5;
                    }
                }
                else {
                    waiting = 4;
                }
            }
        }
        if (waiting >= 6) {
            if (this.op['result_package_id'] && !ops['result_package_id']) {
                waiting = 7;
            }
            else {
                waiting = 8;
            }
            if (waiting == 8) {
                if (!this.op['location_dest_id']['need_check'] || ops['location_dest_id']) {
                    waiting = 9;
                }
            }
        }
        if (waiting <= 5) {
            this.state = 0;
        }
        if (waiting == 6) {
            this.state = 1;
        }
        if (waiting >= 7) {
            this.state = 2;
        }
        this.waiting = waiting;
        if (waiting == 9) {
            this.cargar = true;
            this.doOp(this.op_id);
        }
    };
    SlideopPage.prototype.find_in_op = function (val) {
        var model;
        var id;
        if (this.state == 0) {
            if ((this.op['package_id'] && val == this.op['package_id']['name'])) {
                id = this.op['package_id']['id'];
                model = 'stock.quant.package';
            }
            else if (val == this.op['pda_product_id']['barcode']) {
                id = this.op['pda_product_id']['id'];
                model = 'product.product';
            }
            else if (val == this.op['location_id']['barcode']) {
                id = this.op['location_id']['id'];
                model = 'stock.location';
            }
            else if (this.op['pack_lot_ids']) {
                var pack_lot_id = this.op['pack_lot_ids'].some(function (pack_lot) { return pack_lot['lot_id']['name'] == val; });
                if (pack_lot_id) {
                    id = pack_lot_id['lot_id']['id'];
                    model = 'stoc.production.lot';
                }
            }
        }
        else if (this.state == 2) {
            if (this.op['result_package_id'] && val == this.op['result_package_id']['name']) {
                id = this.op['result_package_id']['id'];
                model = 'stock.quant.package';
            }
            else if (val == this.op['location_dest_id']['barcode']) {
                id = this.op['location_dest_id']['id'];
                model = 'stock.location';
            }
        }
    };
    SlideopPage.prototype.check_returned_value = function (value) {
        if (this.state == 0) {
            if (value.model == 'product.product') {
                if (value.id == this.op['pda_product_id']['id']) {
                    this.op_selected['product_id'] = this.op['pda_product_id'];
                }
            }
            else if (value.model == 'stock.quant.package') {
                if (value.id == this.op['package_id']['id'] && this.package_id_change == 0) {
                    this.op_selected['product_id'] = this.op['pda_product_id'];
                    this.op_selected['package_id'] = this.op['package_id'];
                    this.op_selected['location_id'] = this.op['location_id'];
                }
                else if (value.id == this.package_id_change) {
                    this.package_id_change = 0;
                    this.change_op_value(this.op_id, 'package_id', value.id);
                    this.cargar = true;
                    this.presentToast('Confirmado cambio de paquete de origen. Recargando ...');
                    this.loadOpObj();
                }
                else if (this.package_id_change != 0 && value.id != this.package_id_change) {
                    this.package_id_change = 0;
                    this.presentToast('Cancelado el cambio de paquete de origen');
                }
                else if (value.id != this.op['package_id']['id']) {
                    this.package_id_change = value.id;
                    this.presentToast('Cambiando de paquete de origen');
                }
            }
            else if (value.model == 'stock.location') {
                if (value.id == this.op['location_id']['id'] && this.location_id_change == 0) {
                    this.op_selected['location_id'] = this.op['location_id'];
                }
                else if (value.id == this.location_id_change) {
                    this.package_dest_id_change = 0;
                    this.change_op_value(this.op_id, 'location_id', value.id);
                    this.cargar = true;
                    this.presentToast('Confirmado cambio de ubicación de origen');
                }
                else if (this.location_id_change != 0 && value.id != this.location_id_change) {
                    this.location_id_change = 0;
                    this.presentToast('Cancelado el cambio de ubicación de origen');
                }
                else if (value.id != this.op['location_id']['id']) {
                    this.location_id_change = value.id;
                    this.presentToast('Cambiando de ubicación de origen');
                }
            }
            else if (value.model == 'stock.production.lot') {
                if (value.id == this.op['lot_id']['id']) {
                    this.op_selected['lot_id'] = this.op['lot_id'];
                }
            }
        }
        else if (this.state == 2) {
            if (value.model == 'stock.location') {
                if (value.id == this.op['location_dest_id']['id'] && this.location_id_change == 0) {
                    this.op_selected['location_dest_id'] = this.op['location_dest_id'];
                }
                else if (value.id == this.location_id_change) {
                    this.package_dest_id_change = 0;
                    this.change_op_value(this.op_id, 'location_dest_id', value.id);
                    this.cargar = true;
                    this.presentToast('Confirmado cambio de ubicación de destino');
                }
                else if (this.location_id_change != 0 && value.id != this.location_id_change) {
                    this.location_id_change = 0;
                    this.presentToast('Cancelado el cambio de ubicación de destino');
                }
                else if (value.id != this.op['location_dest_id']['id']) {
                    this.location_id_change = value.id;
                    this.presentToast('Cambiando de ubicación de destino');
                }
            }
            else if (value.model == 'stock.quant.package') {
                if (value.id == this.op['result_package_id']['id'] && this.package_id_change == 0) {
                    this.op_selected['result_package_id'] = this.op['result_package_id'];
                }
                else if (value.id == this.package_id_change) {
                    this.package_id_change = 0;
                    this.change_op_value(this.op_id, 'result_package_id', value.id);
                    this.cargar = true;
                    this.presentToast('Confirmado cambio de paquete de destino');
                }
                else if (this.package_id_change != 0 && value.id != this.package_id_change) {
                    this.package_id_change = 0;
                    this.presentToast('Cancelado el cambio de paquete de destino');
                }
                else if (value.id != this.op['result_package_id']['id']) {
                    this.package_id_change = value.id;
                    this.presentToast('Cambiando de paquete de destino');
                }
            }
        }
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
            selector: 'page-slideop',template:/*ion-inline-start:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/slideop/slideop.html"*/'<!--\n  Generated template for the SlideopPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar color="primary">\n      <button ion-button icon-only menuToggle>\n        <ion-icon name="menu"></ion-icon>\n      </button>\n      <ion-title [hidden]="!op">\n        {{source_model  }} \n        {{ pick.name}} / {{op.picking_id && op.picking_id.name}}\n        [{{ op.id }}] {{index}} \n        [{{op.picking_id && op.picking_id.user_id && op.picking_id.user_id.name}}]\n      </ion-title>\n      <ion-buttons end>\n        \n        <button ion-button (click)="goHome()">\n          <ion-icon name="home"></ion-icon>\n        </button>\n    </ion-buttons>\n  </ion-navbar>\n  <h2 class="danger" [hidden]="message == \'\'">{{ message }}</h2>\n</ion-header>\n<ion-content>\n  <div *ngIf="!op" style="text-align: center">    \n    <ion-spinner name="circles"></ion-spinner><br>\n    <b>Cargando...</b>\n  </div>\n    <ion-list *ngIf="op">\n        <ion-item-group> \n          <ion-item no-lines [ngClass]="{\'no_ok\': state<2, \'ok\': state==2}">\n            <ion-label item-start>\n                ORIGEN\n            </ion-label>\n            <ion-icon name="repeat" item-end color="danger" (click)="resetForm()"></ion-icon>\n          </ion-item>\n          \n          <ion-item>\n              <ion-label color="primary"></ion-label>\n              <button ion-button outline item-end full [ngClass]="{\'buttonOp_ok\': waiting > 2, \'buttonOp\': waiting <= 2}"\n                    (click)="scanValue(\'product.product\', op.pda_product_id && op.pda_product_id.barcode)">{{op.pda_product_id && op.pda_product_id.name}}</button>\n          </ion-item>\n          <ion-item [hidden] = "!op.package_id">\n            <button ion-button outline item-end (click)="scanValue(\'stock.quant.package\', op.package_id && op.package_id.name)"  [ngClass]="{\'buttonOp_ok\': waiting > 1, \'buttonOp\': waiting <= 1}">{{op.package_id && op.package_id.name}}</button>\n            <ion-toggle [(ngModel)]="!op.product_id"  (ionChange)="change_package_qty()" item-start ></ion-toggle>\n          </ion-item>\n\n          <ion-item [hidden] = "op.tracking && op.tracking.value == \'none\'">\n              <ion-label color="primary" >Lote/Nº [ {{ (op.pack_lot_ids && (op.pack_lot_ids.length)) }} ]</ion-label>\n              <button ion-button outline item-end (click)="showSerial(op)"><ion-icon name="eye"></ion-icon></button>\n              <button ion-button outline item-end [hidden]="op.pda_done" (click)="addSerial(\'add\')"><ion-icon name="add"></ion-icon></button>\n              <button ion-button outline item-end [hidden]="op.pda_done || (op.pack_lot_ids && !op.pack_lot_ids.length)" (click)="addSerial(\'remove\')"><ion-icon name="trash"></ion-icon></button>\n          </ion-item>\n\n          <ion-item [hidden] = "true || op.tracking && op.tracking.value != \'lot\'">\n              <ion-label color="primary">Lote</ion-label>\n              <button ion-button outline item-end [ngClass]="{\'buttonOp_ok\': waiting != 2, \'buttonOp\': waiting == 2}" (click)="scanValue(\'stock.production.lot\', op.lot_id && op.lot_id.name)">{{op.lot_id && op.lot_id.name}}</button>\n          </ion-item>\n         \n          <ion-item [hidden] = "package_qty">\n            <ion-label color="primary">Qty: {{op.product_qty }}</ion-label>\n            <button ion-button no-lines item-end (click)="inputQty()"> {{ op_selected.qty_done }} {{ op.pda_product_id && op.pda_product_id.uom_id && op.pda_product_id.uom_id.name}}</button>\n            <button ion-button outline item-end [hidden]="op.pda_done || op.tracking && op.tracking.value != \'none\'" (click)="addQty(op.id, 1.00)" [hidden] = "op.tracking == \'serial\'"><ion-icon name="add"></ion-icon></button>\n            <button ion-button outline item-end [hidden]="op.pda_done || op.tracking && op.tracking.value != \'none\'" (click)="addQty(op.id, -1.00)" [hidden] = "op.tracking == \'serial\'"><ion-icon name="remove"></ion-icon></button>\n          </ion-item>\n          <ion-item>\n              <ion-label color="primary" >De</ion-label>\n              <button ion-button outline item-end [ngClass]="{\'buttonOp_ok\': waiting != 4, \'buttonOp\': waiting == 4}" (click)="scanValue(\'stock.location\', op.location_id.barcode)">\n                {{op.location_id && op.location_id.name}}\n              </button>\n          </ion-item>\n        </ion-item-group>\n\n        <ion-item-group>\n          <ion-item no-lines [ngClass]="{\'no_ok\': waiting<10}">\n            <ion-label class="bold" item-start onclick="set_dest()">\n              DESTINO\n            </ion-label>\n          </ion-item>\n          <ion-item>\n            <ion-label></ion-label>\n            <!--ion-icon name="log-out" [hidden] = "op.result_package_id" item-start color="danger" (click)="no_result_package(\'orig\')"></ion-icon>\n            <ion-icon name="log-in" [hidden] = "!op.result_package_id && op_selected.result_package_id" item-start color="secondary" (click)="no_result_package(\'none\')"></ion-icon>\n            <button ion-button name="log_out" [hidden] = "op.result_package_id" item-start color="odoo" (click)="no_result_package(\'orig\')">Empaquetar</button>\n\n            <button ion-button name="log_in" [hidden] = "!op.result_package_id && op_selected.result_package_id" item-start color="odoo" (click)="no_result_package(\'none\')">Sin paquete</button>\n            <button ion-button name="new_result_package" [hidden] = "result_package_id == -1" item-start color="odoo" (click)="no_result_package(\'new\')">Nuevo</button-->\n            \n            <button ion-button outline item-start [hidden]="op.pda_done" (click)="no_result_package(\'new\')" [hidden] = "result_package_id ==-1" ><ion-icon name="color-wand"></ion-icon></button>\n            <button ion-button outline item-start [hidden]="op.pda_done" (click)="no_result_package(\'orig\')" [hidden] = "op.result_package_id" ><ion-icon name="home"></ion-icon></button>\n            <button ion-button outline item-start [hidden]="op.pda_done" (click)="no_result_package(\'none\')" [hidden] = "!op.result_package_id && op_selected.result_package_id"><ion-icon name="trash"></ion-icon></button>    \n\n\n            <button ion-button outline item-end [hidden] = "!op_selected.result_package_id" (click)="scanValue(\'stock.quant.package\', op.result_package_id.name)"\n            [ngClass]="{\'buttonOp_ok\': waiting != 7, \'buttonOp\': waiting == 7}">\n              {{op_selected.result_package_id && op_selected.result_package_id.name}}\n            </button>\n          </ion-item>\n          <ion-item>\n            <ion-label color="primary">A</ion-label>\n            <button ion-button outline item-end (click)="scanValue(\'stock.location\', op.location_dest_id.barcode)"\n            [ngClass]="{\'buttonOp_ok\': waiting != 8, \'buttonOp\': waiting == 8}">\n              {{op.location_dest_id && op.location_dest_id.name}}\n            </button>\n            <ion-toggle [(ngModel)]="op.location_dest_id && op.location_dest_id.need_check"></ion-toggle>\n          </ion-item>\n        </ion-item-group>\n        <ion-item>\n          Estado: {{state}} Espero {{waiting}} Tipo {{op.tracking && op.tracking.value}}\n        </ion-item>\n        <ion-item>\n            Type: {{source_model}} {{pick && pick.name}}\n          </ion-item>\n      </ion-list>\n  \n      \n  \n</ion-content>\n<ion-footer>\n    <form [formGroup]="barcodeForm" class ="alignBottom" [hidden] = "op && op.pda_done">\n        <ion-item>\n           <ion-label color="odoo" item-start>Scan: </ion-label>\n           <ion-input #scan [formControl]="barcodeForm.controls[\'scan\']" type="text" name="scan" placeholder = "Scan"  autofocus></ion-input>\n          \n           <button ion-button icon-only item-end clear (click)="submitScan()">\n             <ion-icon name="barcode"></ion-icon>                  \n           </button>\n         </ion-item>   \n       </form>\n</ion-footer>\n\n\n'/*ion-inline-end:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/slideop/slideop.html"*/,
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* ModalController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* ModalController */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ToastController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ToastController */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]) === "function" && _f || Object, typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_6__ionic_storage__["b" /* Storage */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_6__ionic_storage__["b" /* Storage */]) === "function" && _g || Object])
    ], SlideopPage);
    return SlideopPage;
    var _a, _b, _c, _d, _e, _f, _g;
}());

//# sourceMappingURL=slideop.js.map

/***/ }),

/***/ 111:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SerialnumberPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(17);
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

var SerialnumberPage = (function () {
    function SerialnumberPage(viewCtrl, toastCtrl, storage, navParams, alertCtrl) {
        this.viewCtrl = viewCtrl;
        this.toastCtrl = toastCtrl;
        this.storage = storage;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.model = 'stock.pack.operation.lot';
        this.op = this.navParams.data.op;
        this.pack_lot_ids = this.navParams.data.pack_lot_ids;
        for (var lot in this.pack_lot_ids) {
            this.pack_lot_ids[lot]['dirty'] = false;
        }
        this.cargar = true;
    }
    SerialnumberPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad LotPage');
    };
    SerialnumberPage.prototype.loaditem = function () {
        var _this = this;
        var self = this;
        var model = 'warehouse.app';
        var method = 'get_info_object';
        var values = { 'model': 'stock.pack.operation', 'id': this.op['id'] };
        self.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                _this.viewCtrl.dismiss();
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.call(model, method, values).then(function (value) {
                        if (value) {
                            var op = value['values'];
                            self.pack_lot_ids = op['pack_lot_ids'];
                            self.op = { 'id': value['id'], 'product_id': op['pda_product_id'], 'qty_done': op['qty_done'] };
                            for (var lot in self.pack_lot_ids) {
                                self.pack_lot_ids[lot]['dirty'] = false;
                            }
                            self.cargar = true;
                        }
                        else {
                            self.presentAlert("Error", "Error al recargar la operacion");
                        }
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
    SerialnumberPage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    SerialnumberPage.prototype.cancelar = function () {
        var return_data = { 'qty_done': this.op['qty_done'], 'pack_lot_ids': this.pack_lot_ids };
        this.viewCtrl.dismiss(return_data);
    };
    SerialnumberPage.prototype.save_close = function () {
        var lot_changed = [];
        var qty_done = 0.00;
        if (!this.pack_lot_ids) {
            return this.cancelar;
        }
        for (var lot in this.pack_lot_ids) {
            qty_done += this.pack_lot_ids[lot]['qty'];
            if (this.pack_lot_ids[lot]['dirty']) {
                lot_changed.push(this.pack_lot_ids[lot]);
            }
        }
        if (lot_changed.length) {
            this.op['qty_done'] = qty_done;
            this.save_lots(lot_changed);
        }
        else {
            this.cancelar();
        }
    };
    SerialnumberPage.prototype.save_lots = function (lot_changed) {
        var _this = this;
        var self = this;
        var model = 'stock.pack.operation';
        var method = 'pda_refresh()';
        var vals = { 'id': this.op['id'], 'qty_done': this.op['qty_done'], 'pack_lot_ids': lot_changed };
        var values = { 'model': this.model, 'values': vals };
        this.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                _this.viewCtrl.dismiss();
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.call(model, method, values).then(function (value) {
                        if (value['id']) {
                            self.cancelar();
                        }
                        else {
                            self.presentAlert("Error al guardar", value['message']);
                            self.viewCtrl.dismiss();
                        }
                    }, function () {
                        self.cargar = false;
                        self.presentAlert('Falla!', 'Error al guardar lotes conectarse');
                    });
                }, function () {
                    self.cargar = false;
                    self.presentAlert('Falla!', 'Error de conexión [save_lots]');
                });
                self.cargar = false;
            }
        });
    };
    SerialnumberPage.prototype.addSerial = function (option) {
        if (option === void 0) { option = 'add'; }
        var message = { 'add': 'Añadir un número de serie', 'remove': "Eliminar un número de serie", 'qty': "Introduce cantidad" };
        var self = this;
        var alert = this.alertCtrl.create({
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
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Aplicar',
                    handler: function (data) {
                        console.log('Saved clicked');
                        console.log(data.serial);
                        self.SerialtoOp(data.serial, false, option, 1);
                    }
                }
            ]
        });
        alert.present();
    };
    SerialnumberPage.prototype.addQty = function (lot_id, qty) {
        return this.SerialtoOp('', lot_id, 'qty', qty);
    };
    SerialnumberPage.prototype.SerialtoOp = function (serial, lot_id, option, qty) {
        var _this = this;
        if (lot_id === void 0) { lot_id = false; }
        if (option === void 0) { option = 'add'; }
        if (qty === void 0) { qty = 0; }
        this.cargar = false;
        var self = this;
        var model = 'stock.pack.operation';
        var method = 'SerialtoOp';
        var values = { 'id': self.op['id'], 'serial': serial, 'option': option, 'qty': qty, 'lot_id': lot_id };
        this.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                console.log('No hay conexión');
                _this.viewCtrl.dismiss();
            }
            else {
                console.log('Hay conexión');
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.call(model, method, values).then(function (value) {
                        self.cargar = true;
                        if (values['id']) {
                            self.loaditem();
                        }
                        else {
                            self.cargar = true;
                            self.presentAlert("Error", value['message']);
                        }
                    }, function () {
                        self.cargar = false;
                        self.presentAlert('Falla!', 'Error de conexión [SerialtoOp]');
                    });
                }, function () {
                    self.cargar = false;
                    self.presentAlert('Falla!', 'Error de conexión [SerialtoOp]');
                });
                self.cargar = false;
            }
        });
    };
    SerialnumberPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-serialnumber',template:/*ion-inline-start:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/serialnumber/serialnumber.html"*/'<!--\n  Generated template for the ProductPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>{{ (op.product_id.tracking.value == \'serial\') && "Nº de serie" || (op.product_id.tracking.value) == \'lot\' && "Lotes" }}</ion-title>\n  </ion-navbar>\n\n</ion-header>\n<ion-content>\n    <div *ngIf="!cargar" style="text-align: center">    \n      <ion-spinner name="circles"></ion-spinner><br>\n      <b>Cargando...</b>\n    </div>\n\n    <ion-list *ngIf="cargar" class="all0">\n      <ion-item-group> \n        <ion-item class="all0">\n            <ion-badge item-end class="ion-info w100" >\n                {{op.product_id.display_name}} {{op.product_id.tracking.value}}\n            </ion-badge>\n        </ion-item>\n      </ion-item-group>    \n\n      <ion-item-group [hidden] = "!pack_lot_ids">\n        <ion-item *ngFor="let lot of pack_lot_ids; trackBy: index;" no-lines class="all0">\n          <ion-label></ion-label>\n        \n          <ion-badge  item-start color="odoo" class="ion-info w50" (click)="open(\'lot\', lot[\'lot_id\'][\'id\'])">\n            {{lot[\'lot_id\'][\'name\']}}\n          </ion-badge>\n          <ion-badge item-start color="white" class="ion-info w30" (click)="inputQty()">\n            {{lot[\'qty\']}} {{op.product_id.uom_id.name}}\n          </ion-badge>\n          <button ion-button outline item-end [hidden]="op.pda_done || op.product_id.tracking.value == \'serial\'" (click)="addQty(lot.id, 1.00)" ><ion-icon name="add"></ion-icon></button>\n          <button ion-button outline item-end [hidden]="op.pda_done" (click)="addQty(lot.id, -1.00)"><ion-icon name="remove"></ion-icon></button>\n        </ion-item>\n      </ion-item-group>\n      <ion-item>\n        <button ion-button item-end color="odoo" class="w33" (click)="addSerial(\'add\')">Nuevo</button>\n        <button ion-button item-end color="odoo" class="w33" (click)="save_close()">Guardar</button>      \n        <button ion-button item-end color="danger" class ="w33" (click)="cancelar()">Cerrar</button>    \n      </ion-item>        \n    </ion-list>\n\n    \n    <!--button ion-button color="danger" full (click)="cancelar()">Cancelar</button-->\n</ion-content>'/*ion-inline-end:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/serialnumber/serialnumber.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ViewController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], SerialnumberPage);
    return SerialnumberPage;
}());

//# sourceMappingURL=serialnumber.js.map

/***/ }),

/***/ 112:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ManualPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(17);
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
        this.model = 'stock.move';
        this.move = {};
        this.domain = [];
        this.package_qty = true;
        this.message = '';
        this.state = 0; /* 0 origen 1 destino 2 validar */
        this.scan_id = '';
        this.models = [];
        this.last_scan = '';
        this.input = 0;
        this.tracking = 'none';
        this.input = 0;
        this.models = ['stock.quant.package', 'stock.production.lot', 'stock.location', 'product.product'];
        this.reset_form();
        this.tracking = 'lot';
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
        this.move = {};
        this['move']['product_qty'] = 0;
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
        if (state === void 0) { state = 0; }
        if (!Boolean(this.move)) {
            state == 0;
            return;
        }
        if (this.tracking == 'none') {
            if (Boolean(this.move['location_id']) && Boolean(this.move['product_id'])) {
                this.state = 1;
            }
        }
        else if (this.tracking == 'serial') {
            if (Boolean(this.move['location_id']) && Boolean(this.move['restrict_lot_id'])) {
                this.state = 1;
            }
        }
        else {
            if (Boolean(this.move['product_id']) && Boolean(this.move['location_id']) && Boolean(this.move['restrict_lot_id'])) {
                this.state = 1;
            }
        }
        if (this.state == 2 && !this['move']['location_dest_id']['need_check']) {
            this.process_move();
        }
        if (this.state == 1 && Boolean(this.move['location_dest_id']) && Boolean(this.move['product_qty'])) {
            this.state = 2;
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
                    odoo.call(model, method, values).then(function (res) {
                        //AQUI DECIDO QUE HACER EN FUNCION DE LO QUE RECIBO
                        //Estoy scaneando ORIGEN
                        if (res['id'] == 0) {
                            self.presentToast(res['message'], false);
                            return false;
                        }
                        else if (self.state == 0) {
                            if (origenModels.indexOf(res.model) != -1) {
                                if (res.model == 'stock.quant.package') {
                                    self.set_package(res['values']);
                                }
                                else if (res.model == 'stock.location') {
                                    self.set_location(res['values']);
                                }
                                else if (res.model == 'stock.production.lot') {
                                    self.set_lot(res['values']);
                                }
                                else if (res.model == 'product.product') {
                                    self.set_product(res['values']);
                                }
                            }
                        }
                        else if (self.state >= 1) {
                            if (destModels.indexOf(res.model) != -1) {
                                self.last_scan = values['search_str'];
                                if (res.model == 'stock.quant.package') {
                                    self.set_package(res['values']);
                                }
                                else if (res.model == 'stock.location') {
                                    self.set_location(res['values']);
                                }
                            }
                        }
                        self.scan_id = res['id'];
                        self.check_state();
                        self.myScan.setFocus();
                        return true;
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
    ManualPage.prototype.set_package = function (values) {
        var obj = { 'id': values['id'], 'name': values['name'], 'location_id': values['location_id'], 'multi': values['multi'], 'product_id': values['product_id'], 'package_qty': values['package_qty'] };
        //ORIGEN IMPLICA RESET DEL MOVIMIENTO
        if (this.state == 0) {
            this.reset_form();
            this['move']['restrict_package_id'] = obj;
            this['move']['result_package_id'] = obj;
            this['move']['location_id'] = values['location_id'];
            this['move']['package_qty'] = values['package_qty'];
            this.package_qty = true;
            if (Boolean(obj.multi)) {
                this['move']['total_package_qty'] = 1;
                this['move']['product_qty'] = 1;
                this['move']['result_package_id'] = obj;
                this.tracking = 'none';
            }
            this['move']['total_package_qty'] = values['package_qty'];
            this['move']['product_qty'] = values['package_qty'];
            this['move']['restrict_lot_id'] = values['lot_id'];
            this['move']['product_id'] = values['product_id'];
            this['move']['uom_id'] = values['uom'];
            this.tracking = values['product_id']['tracking'];
        }
        else if (this.state == 1) {
            if (this['move']['restrict_package_id']['multi']) {
                this.presentAlert("Error de paquete", "Es un paquete multi");
            }
            else if (Boolean(this['move']['restrict_lot_id']) && values['lot_id']['id'] != this['move']['restrict_lot_id']['id']) {
                this.presentToast('Paquete no válido. Lote distinto al inicial', true);
                this['move']['result_package_id'] = {};
                this['move']['location_dest_id'] = {};
                return;
            }
            else {
                this['move']['result_package_id'] = obj;
                this['move']['location_dest_id'] = values['location_id'];
            }
        }
    };
    ManualPage.prototype.no_result_package = function (reset) {
        if (reset === void 0) { reset = true; }
        if (reset) {
            this['move']['result_package_id'] = {};
        }
        else {
            if (this['move']['product_qty'] == this['move']['total_package_qty']) {
                this['move']['result_package_id'] = this['move']['restrict_package_id'];
            }
            else {
                this['move']['result_package_id'] = { 'id': -1, name: 'Nuevo', 'location_id': {} };
            }
        }
    };
    ManualPage.prototype.set_lot = function (values) {
        if (this.state != 0) {
            this.presentAlert('Lote erróneo', 'Debes reiniciar para cambiar el lote');
            return;
        }
        var location_id;
        var obj = { 'id': values['id'], 'name': values['display_name'], 'product_id': values['product_id'], 'location_id': values['location_id'], 'qty_available': values['qty_available'] };
        console.log(values);
        if (values['product_id']['tracking'] == 'serial') {
            location_id = this['move']['location_id'];
            this.reset_form();
        }
        this['move']['restrict_lot_id'] = obj;
        if (Boolean(values['location_id'])) {
            this['move']['location_id'] = location_id;
        }
        this['move']['product_qty'] = values['qty_available'];
        this['move']['product_id'] = values['product_id'];
        this['move']['uom_id'] = values['uom_id'];
        this.tracking = values['product_id']['tracking'];
    };
    ManualPage.prototype.set_location = function (values) {
        var obj = { 'id': values['id'], 'name': values['name'] };
        if (this.state == 0) {
            if (Boolean(this['move']['restrict_package_id']) && this['move']['location_id'] != obj) {
                this.presentAlert('Error de paquete', 'La ubicación de origen debe ser la misma que la del paquete');
                return;
            }
            if (Boolean(this['move']['restrict_lot_id']) && Boolean(this['move']['restrict_lot_id']['location_id']) && this['move']['location_id'] != obj) {
                this.presentAlert('Error de lote', 'La ubicación de origen debe ser la misma que la del lote');
                return;
            }
            this['move']['location_id'] = obj;
        }
        else if (this.state == 1) {
            if (!Boolean(this['move']['restrict_package_id']) && Boolean(this['move']['result_package_id']) && this['move']['result_package_id']['id'] != -1 && Boolean(this['move']['result_package_id']['location_id']) && this['move']['location_id']['id'] != obj['id']) {
                this.presentAlert('Error de paquete', 'Si quieres empaquetar, la ubicación de destino debe ser la misma que la del paquete de destino');
                return;
            }
            if (Boolean(this['move']['restrict_package_id']) && Boolean(this['move']['result_package_id']) && this['move']['result_package_id']['id'] != -1 && Boolean(this['move']['result_package_id']['location_id']) && this['move']['location_id']['id'] == obj['id']) {
                this.presentAlert('Error de destino', 'Si quieres mover de un paquete, la ubicación de destino debe ser distinta del origen');
                return;
            }
            this['move']['location_dest_id'] = obj;
        }
    };
    ManualPage.prototype.set_product = function (values) {
        var obj = { 'id': values['id'], 'name': values['display_name'], 'tracking': values['tracking'], 'qty_available': values['qty_available'] };
        if (this.state == 0) {
            if (Boolean(this['move']['restrict_package_id']) && this['move']['restrict_package_id']['product_id'] && this['move']['restrict_package_id']['product_id']['id'] != obj['id']) {
                this.presentAlert('Error de producto', 'El paquete seleccionado tiene producto');
                return;
            }
            if (Boolean(this['move']['restrict_lot_id']) && this['move']['restrict_lot_id']['product_id'] && this['move']['restrict_lot_id']['product_id']['id'] != obj['id']) {
                this.presentAlert('Error de producto', 'El lote seleccionado tiene producto');
                return;
            }
            this['move']['product_id'] = obj;
            this.tracking = obj['tracking'];
        }
    };
    ManualPage.prototype.change_package_qty = function () {
        if (this['move']['package_qty']) {
            this['move']['product_qty'] = this['move']['total_package_qty'];
        }
    };
    ManualPage.prototype.inputQty = function () {
        var _this = this;
        if (this.state == 0) {
            return;
        }
        var alert = this.alertCtrl.create({
            title: 'Qty',
            message: 'Cantidad a mover',
            inputs: [
                {
                    name: 'qty',
                    placeholder: this['move']['product_qty'].toString()
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
                            _this.presentAlert('Error!', 'La cantidad debe ser mayor que 0');
                        }
                        else if (Boolean(_this['move']['restrict_package_id']) && data.qty > _this['move']['restrict_package_id']['package_qty']) {
                            _this.presentAlert('Error!', 'La cantidad debe ser menor que la contenida en el paquete');
                        }
                        else if (Boolean(_this['move']['restrict_lot_id']) && data.qty > _this['move']['restrict_lot_id']['qty_available']) {
                            _this.presentAlert('Error!', 'La cantidad debe ser menor que la disponible para ese lote');
                        }
                        _this['move']['product_qty'] = data.qty;
                        _this.check_state(0);
                        _this.input = 0;
                    }
                }
            ]
        });
        this.input = alert._state;
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
    ManualPage.prototype.get_move_values = function (move) {
        var values = { 'restrict_package_id': move['restrict_package_id'] && move['restrict_package_id']['id'],
            'product_id': move['product_id']['id'],
            'product_qty': move['product_qty'],
            'restrict_lot_id': move['restrict_lot_id'] && move['restrict_lot_id']['id'],
            'location_id': move['location_id']['id'],
            'result_package_id': move['result_package_id'] && move['result_package_id']['id'],
            'location_dest_id': move['location_dest_id']['id'],
            'package_qty': move['package_qty'],
            'product_uom_qty': move['product_qty'],
            'origin': 'PDA move' };
        return values;
    };
    ManualPage.prototype.process_move = function () {
        /* CREAR Y PROCESAR UN MOVIMEINTO */
        var self = this;
        var values = self.get_move_values(self['move']);
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
            selector: 'page-manual',template:/*ion-inline-start:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/manual/manual.html"*/'<!--\n  Generated template for the ManualPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar color="primary">\n      <button ion-button icon-only menuToggle>\n        <ion-icon name="menu"></ion-icon>\n      </button>\n      <ion-title>Movimiento manual</ion-title>\n      <ion-buttons end>\n        \n        <button ion-button >\n          <ion-icon name="log-out"></ion-icon>\n        </button>\n    </ion-buttons>\n  </ion-navbar>\n  <h2 class="danger" [hidden]="message == \'\'">{{ message }}</h2>\n</ion-header>\n<ion-content>\n  \n    <ion-list>\n        <ion-item-group> \n          <ion-item no-lines>\n            <ion-label color="odoo" item-start class="bold" onclick="set_origin()">\n              ORIGEN {{state}} {{tracking }}\n            </ion-label>\n            <ion-icon name="repeat" item-end color="danger" (click)="reset_form()"></ion-icon>\n          </ion-item>\n      \n          <ion-item [hidden] = "!move.restrict_package_id">\n            <button ion-button outline item-end>{{move.restrict_package_id && move.restrict_package_id.name}}</button>\n            <ion-toggle [(ngModel)]="move.package_qty"  (ionChange)="change_package_qty()" item-start></ion-toggle>\n          </ion-item>\n          \n          <ion-item [hidden] = "!move.restrict_lot_id">\n              <ion-label color="primary" >Lote</ion-label>\n              <button ion-button outline item-end>{{move.restrict_lot_id && move.restrict_lot_id.name}}</button>\n          </ion-item>\n          <ion-item >\n              <ion-label color="primary" >Articulo</ion-label>\n              <button ion-button outline item-end [hidden] = "!move.product_id">{{move.product_id && move.product_id.name}}</button>\n          </ion-item>\n          <ion-item [hidden] = "state==0">\n            <ion-label color="primary">Qty</ion-label>\n            <!--ion-input [(ngModel)]=\'product_qty\' type="number" item-end style="align-self: flex-end; max-width: 50%;"></ion-input-->\n            <button ion-button outline item-end (click)="inputQty()">{{ move.product_qty }} {{ move.uom_id && move.uom_id.name}}</button>\n          </ion-item>\n          <ion-item>\n              <ion-label color="primary" >De</ion-label>\n              <button ion-button outline item-end>{{move.location_id && move.location_id.name || "Ubicación Orig."}}</button>\n          </ion-item>\n        </ion-item-group>\n\n        <ion-item-group [hidden]="state==0">\n          <ion-item no-lines>\n            <ion-label color="odoo" class="bold" item-start onclick="set_dest()">\n              DESTINO\n            </ion-label>\n          </ion-item>\n          <ion-item >\n            <ion-icon name="log-out" [hidden] = "!move.result_package_id" item-start color="danger" (click)="no_result_package()"></ion-icon>\n            <ion-icon name="log-in" [hidden] = "move.result_package_id" item-start color="secondary" (click)="no_result_package(false)"></ion-icon>\n            <button ion-button outline item-end [hidden] = "!move.result_package_id">{{move.result_package_id && move.result_package_id.name}}</button>\n          </ion-item>\n          <ion-item>\n            <ion-label color="primary">A</ion-label>\n            <button ion-button outline item-end>{{move.location_dest_id && move.location_dest_id.name || "Ubicación Dest."}}</button>\n          </ion-item>\n        </ion-item-group>\n      </ion-list>\n  \n  \n  \n</ion-content>\n<ion-footer>\n    <form [formGroup]="barcodeForm" class ="alignBottom">\n        <ion-item>\n           <ion-label color="odoo" item-start>Scan: </ion-label>\n           <ion-input #scan [formControl]="barcodeForm.controls[\'scan\']" type="text" name="scan" placeholder = "Scan"  autofocus></ion-input>\n          \n           <button ion-button icon-only item-end clear (click)="submitScan()">\n             <ion-icon name="barcode"></ion-icon>\n           </button>\n         </ion-item>   \n       </form>\n</ion-footer>'/*ion-inline-end:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/manual/manual.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], ManualPage);
    return ManualPage;
}());

//# sourceMappingURL=manual.js.map

/***/ }),

/***/ 113:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ShowinfoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__home_home__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__lot_lot__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__location_location__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__package_package__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__product_product__ = __webpack_require__(49);
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
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ToastController */], __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], ShowinfoPage);
    return ShowinfoPage;
}());

//# sourceMappingURL=showinfo.js.map

/***/ }),

/***/ 126:
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
webpackEmptyAsyncContext.id = 126;

/***/ }),

/***/ 168:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/location/location.module": [
		298,
		9
	],
	"../pages/lot/lot.module": [
		299,
		8
	],
	"../pages/manual/manual.module": [
		300,
		7
	],
	"../pages/package/package.module": [
		301,
		6
	],
	"../pages/product/product.module": [
		302,
		5
	],
	"../pages/serialnumber/serialnumber.module": [
		303,
		4
	],
	"../pages/showinfo/showinfo.module": [
		304,
		3
	],
	"../pages/slideop/slideop.module": [
		305,
		2
	],
	"../pages/treeops/treeops.module": [
		306,
		1
	],
	"../pages/treepick/treepick.module": [
		307,
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
webpackAsyncContext.id = 168;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 20:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_network__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_treepick_treepick__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_aux_aux__ = __webpack_require__(46);
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
            url: 'http://192.168.0.112',
            port: '8069',
            db: 'lasrias_app',
            username: 'kiko',
            password: 'kiko',
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
                }, function (uid) { self.presentAlert('Alerta!', 'Por favor ingrese usuario y contraseña'); });
            }, function (uid) {
                self.cargar = false;
                self.presentAlert('Alerta!', 'Por favor ingrese usuario y contraseña');
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
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_network__["a" /* Network */], __WEBPACK_IMPORTED_MODULE_5__providers_aux_aux__["a" /* AuxProvider */]])
    ], HomePage);
    return HomePage;
    var HomePage_1;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 213:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(214);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(234);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 234:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_http__ = __webpack_require__(288);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_storage__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_network__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_file__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__app_component__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_home_home__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_treepick_treepick__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_treeops_treeops__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_slideop_slideop__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_manual_manual__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__providers_aux_aux__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_showinfo_showinfo__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_product_product__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_lot_lot__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_package_package__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_location_location__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_serialnumber_serialnumber__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__ionic_native_native_audio__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__providers_app_sound_app_sound__ = __webpack_require__(291);
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
                __WEBPACK_IMPORTED_MODULE_17__pages_product_product__["a" /* ProductPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_serialnumber_serialnumber__["a" /* SerialnumberPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_9__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/location/location.module#LocationPageModule', name: 'LocationPage', segment: 'location', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/lot/lot.module#LotPageModule', name: 'LotPage', segment: 'lot', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/manual/manual.module#ManualPageModule', name: 'ManualPage', segment: 'manual', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/package/package.module#PackagePageModule', name: 'PackagePage', segment: 'package', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/product/product.module#ProductPageModule', name: 'ProductPage', segment: 'product', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/serialnumber/serialnumber.module#SerialnumberPageModule', name: 'SerialnumberPage', segment: 'serialnumber', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/showinfo/showinfo.module#ShowinfoPageModule', name: 'ShowinfoPage', segment: 'showinfo', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/slideop/slideop.module#SlideopPageModule', name: 'SlideopPage', segment: 'slideop', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/treeops/treeops.module#TreeopsPageModule', name: 'TreeopsPage', segment: 'treeops', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/treepick/treepick.module#TreepickPageModule', name: 'TreepickPage', segment: 'treepick', priority: 'low', defaultHistory: [] }
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
                __WEBPACK_IMPORTED_MODULE_17__pages_product_product__["a" /* ProductPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_serialnumber_serialnumber__["a" /* SerialnumberPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_8__ionic_native_file__["a" /* File */],
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_network__["a" /* Network */],
                __WEBPACK_IMPORTED_MODULE_15__providers_aux_aux__["a" /* AuxProvider */],
                __WEBPACK_IMPORTED_MODULE_22__ionic_native_native_audio__["a" /* NativeAudio */],
                __WEBPACK_IMPORTED_MODULE_23__providers_app_sound_app_sound__["a" /* AppSoundProvider */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 290:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_treepick_treepick__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_manual_manual__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_showinfo_showinfo__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_aux_aux__ = __webpack_require__(46);
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




//import { SerialnumberPage } from '../pages/serialnumber/serialnumber'

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
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/app/app.html"*/'<ion-menu [content]="content">\n    <ion-header>\n      <ion-toolbar>\n        <ion-title>Menu</ion-title>\n      </ion-toolbar>\n    </ion-header>\n  \n    <ion-content>\n      <ion-list>\n        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n          {{p.title}}\n        </button>\n      </ion-list>\n    </ion-content>\n  \n  </ion-menu>\n  \n  <!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n  <ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>'/*ion-inline-end:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_8__providers_aux_aux__["a" /* AuxProvider */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 291:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppSoundProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_native_audio__ = __webpack_require__(212);
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
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_native_audio__["a" /* NativeAudio */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* Platform */]])
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
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
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */]])
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_aux_aux__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pages_home_home__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_treeops_treeops__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(17);
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
        this.fields = ['id', 'name', 'state', 'partner_id', 'location_id', 'location_dest_id', 'picking_type_id', 'user_id', 'allow_validate'];
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
                domain.push(['pack_operation_exist', '!=', false]);
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
                    //domain = [self.domain_types]
                    console.log(domain);
                    self.picks = [];
                    self.domain = domain;
                    odoo.search_read('stock.picking.wave', domain, self.fields, 0, 0).then(function (value) {
                        for (var key in value) {
                            value[key]['type'] = 'stock.picking.wave';
                            self.picks.push(value[key]);
                        }
                        self.domain.push(['wave_id', '=', false]);
                        console.log(domain);
                        odoo.search_read('stock.picking', self.domain, self.fields, 0, 0).then(function (value) {
                            for (var key in value) {
                                value[key]['type'] = 'stock.picking';
                                self.picks.push(value[key]);
                            }
                            self.cargar = false;
                        }, function () {
                            self.presentAlert('Falla!', 'Imposible conectarse');
                        });
                    }, function () {
                        self.presentAlert('Falla!', 'Imposible conectarse');
                    });
                }, function () {
                    self.presentAlert('Falla!', 'Imposible conectarse');
                });
            }
        });
    };
    TreepickPage.prototype.get_picking_types2 = function () {
        var _this = this;
        this.storage.get('stock.picking.type').then(function (val) {
            _this.picking_types = [];
            for (var key in val) {
                _this.picking_types.push(val[key]);
            }
        });
    };
    TreepickPage.prototype.get_picking_types = function () {
        var self = this;
        this.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__pages_home_home__["a" /* HomePage */], { borrar: true, login: null });
            }
            else {
                var con = val;
                var odoo = new OdooApi(con.url, con.db);
                odoo.login(con.username, con.password).then(function (uid) {
                    odoo.search_read('stock.picking.type', [['show_in_pda', '=', true]], ['id', 'name', 'short_name'], 0, 0).then(function (value) {
                        self.picking_types = [];
                        for (var key in value) {
                            self.picking_types.push(value[key]);
                        }
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
    TreepickPage.prototype.showtreeop_ids = function (pick_id, pick_type) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__pages_treeops_treeops__["a" /* TreeopsPage */], { 'picking_id': pick_id, 'source_model': pick_type });
    };
    TreepickPage.prototype.doAsign = function (pick_id, pick_type) {
        this.change_pick_value(pick_id, 'user_id', this.uid, pick_type);
        /*this.user='assigned';
        this.filter_picks(this.picking_type_id);*/
    };
    TreepickPage.prototype.doDeAsign = function (pick_id, pick_type) {
        this.change_pick_value(pick_id, 'user_id', false, pick_type);
        /*this.user='no_assigned';
        this.filter_picks(this.picking_type_id);*/
    };
    TreepickPage.prototype.change_pick_value = function (id, field, new_value, model) {
        if (model === void 0) { model = 'stock.picking'; }
        var self = this;
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
    TreepickPage.prototype.doTransfer = function (id, model) {
        if (model === void 0) { model = 'stock.picking'; }
        var self = this;
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
            selector: 'page-treepick',template:/*ion-inline-start:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/treepick/treepick.html"*/'<!--\n  Generated template for the TreepickPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar color="primary">\n     \n        <button ion-button icon-only menuToggle>\n          <ion-icon name="menu"></ion-icon>\n        </button>\n  \n      <ion-title>Listado de Albaranes</ion-title>\n      <ion-buttons end>\n        <button ion-button (click)=\'logOut()\'>\n          <ion-icon name="log-out"></ion-icon>\n        </button>\n    </ion-buttons>\n  </ion-navbar>\n  \n <div class=\'noPadding\'>\n        <ion-segment *ngIf="!picking_types">\n            <ion-segment-button value="All" (click)="filter_picks(0)"><ion-icon name="apps"></ion-icon></ion-segment-button>\n        </ion-segment>\n        <ion-segment *ngIf="picking_types">\n          <ion-segment-button value="All" (click)="filter_picks(0)"><ion-icon name="apps"></ion-icon></ion-segment-button>\n          <ion-segment-button *ngFor="let pick_type of picking_types" value="{{ pick_type && pick_type[\'name\']}}" (click)="filter_picks(pick_type && pick_type.id)">{{ pick_type && pick_type.short_name || pick_type && pick_type.name }}</ion-segment-button>\n        </ion-segment>\n</div>\n\n</ion-header>\n\n<ion-content padding>\n  \n    <div *ngIf="cargar" style="text-align: center">    \n      <ion-spinner name="circles"></ion-spinner><br>\n      <b>Cargando...</b>\n    </div>\n   \n    <ion-list >         \n        <ion-item [hidden]=\'picks.length>0 || cargar\' color ="danger"> No hay albaranes</ion-item>\n\n        <ion-item text-wrap *ngFor="let pick of picks; trackBy: index;" class="all0" >\n            <ion-label></ion-label>\n            <button ion-button item-start class="buttonProduct w75" (click)="showtreeop_ids(pick.id, pick.type)" [ngClass]="{\'pìckdone\': pick.state==\'done\'}">\n              {{pick.name}} <({{pick.state}} {{pick.picking_type_id_name}} {{pick.type}})>\n            </button>  \n        \n            <button ion-button icon-only item-end  (click)="doAsign(pick.id, pick.type)" [hidden]="pick.user_id">Asignar\n                \n            </button>  \n            <button ion-button icon-only item-end  (click)="doDeAsign(pick.id, pick.type)" [hidden]="!pick.user_id">Liberar\n                \n            </button>\n            <button ion-button icon-only item-end  (click)="doTransfer(pick.id, pick.type)" [hidden]=\'!pick.allow_transfer\'>Validar\n            </button>\n        </ion-item>\n    </ion-list> \n    </ion-content>\n  '/*ion-inline-end:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/treepick/treepick.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_2__providers_aux_aux__["a" /* AuxProvider */]])
    ], TreepickPage);
    return TreepickPage;
}());

//# sourceMappingURL=treepick.js.map

/***/ }),

/***/ 46:
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
        this.pick_states_visible = ['partially_available', 'assigned', 'in_progress'];
        console.log('Hello AuxProvider Provider');
        this.location_badge = "<ion-badge item-start color='odoo' (click)=\"open('stock.location', pick['location_dest_id'] && pick['location_dest_id'].id)\"{{ pick['location_dest_id'] && pick.location_dest_id.name}} </ion-badge>";
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

/***/ 47:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LotPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__location_location__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__package_package__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__product_product__ = __webpack_require__(49);
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
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], LotPage);
    return LotPage;
    var LotPage_1;
}());

//# sourceMappingURL=lot.js.map

/***/ }),

/***/ 48:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PackagePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lot_lot__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__location_location__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__product_product__ = __webpack_require__(49);
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
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], PackagePage);
    return PackagePage;
    var PackagePage_1;
}());

//# sourceMappingURL=package.js.map

/***/ }),

/***/ 49:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProductPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lot_lot__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__location_location__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__package_package__ = __webpack_require__(48);
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
            selector: 'page-product',template:/*ion-inline-start:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/product/product.html"*/'<!--\n  Generated template for the ProductPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>{{item && item.display_name || "Cargando ..."}}</ion-title>\n  </ion-navbar>\n\n</ion-header>\n<ion-content>\n    <div *ngIf="!cargar" style="text-align: center">    \n      <ion-spinner name="circles"></ion-spinner><br>\n      <b>Cargando...</b>\n    </div>\n\n    <ion-list *ngIf="cargar">\n      <ion-item-group> \n        \n        <ion-item class="all0">\n            <ion-label></ion-label>\n            <ion-badge item-end class="ion-info" w50>\n                {{item.qty_available}} {{item.uom_id[[\'name\']]}}\n            </ion-badge>\n        </ion-item>\n        \n        <ion-item class="all0">\n            <ion-label></ion-label>\n            <ion-badge item-end class="ion-info w50">\n                EAN {{item.ean13}}\n            </ion-badge>\n            <ion-badge item-end class="ion-info w50" >\n                REF {{item.default_code}}\n            </ion-badge>\n        </ion-item>\n      </ion-item-group>    \n\n      <ion-item-group [hidden] = "!item[\'quant_ids\']">\n        <ion-item  no-lines class="all0">\n            <ion-label></ion-label>\n            <ion-badge item-start color="odoolight" class="ion-info w50">LOTE </ion-badge>\n            <ion-badge item-start color="odoolight" class="ion-info w50">UBICACION </ion-badge>\n\n        </ion-item>\n        <ion-item *ngFor="let subitem of item[\'quant_ids\']; trackBy: index;" no-lines class="all0">\n          <ion-label></ion-label>\n          <ion-badge item-start color="odoo" class="ion-info w50" (click)="open(\'stock.production.lot\', subitem[\'lot_id\'][\'id\'])">\n              {{subitem[\'display_name\']}}\n          </ion-badge>\n          \n          <ion-badge item-start color="white" class="ion-info w50" (click)="open(\'stock.location\', subitem[\'location_id\'][\'id\'])">\n            {{subitem[\'location_id\'][\'name\']}}\n          </ion-badge>\n        </ion-item>\n      </ion-item-group>\n            \n    </ion-list>\n</ion-content>\n'/*ion-inline-end:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/product/product.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], ProductPage);
    return ProductPage;
    var ProductPage_1;
}());

//# sourceMappingURL=product.js.map

/***/ }),

/***/ 59:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TreeopsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_aux_aux__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__home_home__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__slideop_slideop__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_storage__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__treepick_treepick__ = __webpack_require__(35);
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
        this.cargar = true;
        this.pick_id = 0;
        this.limit = 25;
        this.offset = 0;
        this.order = 'picking_order, pda_product_id asc';
        this.model = 'stock.pack.operation';
        this.source_model = 'stock.picking';
        this.domain = [];
        this.pick_domain = [];
        this.record_count = 0;
        this.isPaquete = true;
        this.isProducto = false;
        this.scan = '';
        this.model_fields = { 'stock.quant.package': 'package_id', 'stock.location': 'location_id', 'stock.production.lot': 'lot_id' };
        this.aux = new __WEBPACK_IMPORTED_MODULE_3__providers_aux_aux__["a" /* AuxProvider */];
        this.pick = {};
        this.pick_id = this.navParams.data.picking_id;
        this.source_model = this.navParams.data.source_model;
        this.record_count = 0;
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
    TreeopsPage.prototype.goHome = function () { this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_7__treepick_treepick__["a" /* TreepickPage */], { borrar: true, login: null }); };
    TreeopsPage.prototype.loadList = function (id) {
        if (id === void 0) { id = 0; }
        var self = this;
        var model = 'warehouse.app';
        var method = 'get_object_id';
        if (id == 0) {
            id = this.pick_id;
        }
        var values = { 'id': id, 'model': this.source_model };
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
                    odoo.call(model, method, values).then(function (res) {
                        if (res['id'] != 0) {
                            self.pick = res['values'];
                            self.cargar = false;
                            self.record_count = self.pick['pack_operation_count'];
                            return true;
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
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__slideop_slideop__["a" /* SlideopPage */], { op_id: op_id, index: op_id_index, ops: this.pick['pack_operation_ids'], pick_id: this.pick_id, source_model: this.source_model });
    };
    TreeopsPage.prototype.submitScan = function () {
        this.getObjectId({ 'model': ['stock.location', 'stock.quant.package', 'stock.production.lot', 'product.product'], 'search_str': this.treeForm.value['scan'] });
        this.treeForm.reset();
    };
    TreeopsPage.prototype.findId = function (value) {
        for (var op in this.pick['pack_operation_ids']) {
            var opObj = this.pick['pack_operation_ids'][op];
            console.log(opObj);
            if (opObj[this.model_fields[value['model']]][0] == value['id']) {
                return { 'op_id': opObj['id'], 'index': op, 'ops': this.pick['pack_operation_ids'], 'origin': true };
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
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__home_home__["a" /* HomePage */], { borrar: true, login: null });
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
                                self.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__slideop_slideop__["a" /* SlideopPage */], res);
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
        var model = this.source_model;
        var method = 'doTransfer';
        var values = { 'id': id };
        var object_id = {};
        this.storage.get('CONEXION').then(function (val) {
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
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__treepick_treepick__["a" /* TreepickPage */]);
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
                self.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__home_home__["a" /* HomePage */], { borrar: true, login: null });
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
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], TreeopsPage.prototype, "handleKeyboardEvent", null);
    TreeopsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-treeops',template:/*ion-inline-start:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/treeops/treeops.html"*/'<!--\n  Generated template for the TreepickPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  \n  <ion-navbar color="primary">\n      <button ion-button icon-only menuToggle>\n        <ion-icon name="menu"></ion-icon>\n      </button>\n      <ion-title>{{ pick && pick.name }} [{{ pick[\'remaining_ops\'] }} / {{pick[\'pack_operation_count\']}}]</ion-title>\n      <ion-buttons end>\n        <button ion-button (click)="goHome()">\n          <ion-icon name="home"></ion-icon>\n        </button>\n      </ion-buttons>\n  </ion-navbar>        \n  <!--ion-item no-lines class=\'noPadding\'>   show_in_PDA\n    <ion-label class=\'noPadding\' color="primary"> {{ pick.picking_type_id_name}} </ion-label>\n  </ion-item-->\n  \n</ion-header>\n\n<ion-content padding>\n  \n  <div *ngIf="cargar" style="text-align: center" no-lines >    \n    <ion-spinner name="circles"></ion-spinner><br>\n    <b>Cargando...</b>\n  </div>\n\n  <ion-list [hidden] = "cargar" class="noPadding">\n    <ion-item-group class=\'back_light\'>\n      \n      <ion-item no-lines class=\'all0 back_light\'>   \n        <ion-label></ion-label>\n        <ion-badge item-start color="primary">{{pick.state && pick.state.name}} </ion-badge>\n        <ion-badge item-end color=\'odoo\' (click)="seeAll()">{{whatOps}}</ion-badge>\n        <ion-badge item-end (click)="doTransfer(pick.id)" [hidden]=\'pick.state == "done" || pick.done_ops == 0\' color=\'odoo\'>Validar</ion-badge>\n        <ion-badge item-end (click)="doAssign(pick.id)" [hidden]=\'!pick.user_id\' color=\'odoo\'>Asignarme</ion-badge>\n        \n      </ion-item>\n\n      <ion-item no-lines class=\'all0\'>   \n          <ion-label></ion-label>\n          <ion-badge item-start color="odoo" (click)="open(\'stock.location\', pick[\'location_id\'] && pick[\'location_id\'].id)">\n            {{pick[\'location_id\'] && pick.location_id.name}}\n          </ion-badge>       \n          {{aux.location_badge}}\n          <ion-badge item-start color="odoo" (click)="open(\'stock.location\', pick[\'location_dest_id\'] && pick[\'location_dest_id\'].id)">\n            {{ pick[\'location_dest_id\'] && pick.location_dest_id.name}}\n          </ion-badge>          \n        </ion-item>\n    </ion-item-group>    \n    \n    <ion-item-group *ngFor="let item of pick.pack_operation_ids; trackBy: index;">\n      <ion-item-group [hidden] = "whatOps==\'Pendientes\' && item.qty_done">\n        <ion-item no-lines class="all0">\n          <ion-label></ion-label>\n          <button ion-button item-end (click)="openOp(item.id, item.index)" class=\'buttonProduct w100\'> {{item.pda_product_id && item.pda_product_id.name || \'\'}}</button>\n        </ion-item>\n        <ion-item class="all0">\n          <ion-label></ion-label>\n          <ion-badge item-end class="ion-info" [hidden] = "!item.package_id && !item.lot_id">\n              {{item.package_id && item[\'package_id\'][\'name\'] || item.lot_id && item[\'lot_id\'][1]}}\n          </ion-badge>\n          <ion-select class ="w33" [hidden]="item.tracking != \'serial\'" placeholder ="Nº de serie">\n            <ion-option *ngFor="let pack_lot of item.pack_lot_ids; trackBy: index;" value="pack_lot.id">{{ pack_lot.lot_id.name}}</ion-option>\n          </ion-select>\n          <ion-badge [hidden]="item.tracking != \'serial\'" item-end class="ion-info w33" color=\'danger\'[ngClass]="{\'badge_0\': item.qty_done}">\n            {{ (item.pda_done && item.qty_done) || item.product_qty }}  {{item.product_uom_id && item.product_uom_id.name}}\n          </ion-badge> \n          <ion-badge [hidden]="item.tracking == \'serial\'" item-end class="ion-info w33" color=\'danger\'[ngClass]="{\'badge_0\': item.pda_done}">\n            {{ (item.pda_done && item.qty_done) || item.product_qty }}  {{item.product_uom_id && item.product_uom_id.name}}\n          </ion-badge> \n        </ion-item>\n      </ion-item-group>\n    </ion-item-group>\n  </ion-list>\n   \n\n  </ion-content>\n  <ion-footer>\n      <form [formGroup]="treeForm" class ="alignBottom">\n     <ion-item  >\n        <ion-label color="odoo" item-start>Scan: </ion-label>\n        <ion-input #scanPackage [formControl]="treeForm.controls[\'scan\']" type="text" name="scan" placeholder = "Scan"  autofocus></ion-input>\n       \n        <button ion-button icon-only item-end clear (click)="submitScan()">\n          <ion-icon name="barcode"></ion-icon>\n        </button>\n      </ion-item>   \n    </form>\n  </ion-footer>\n      '/*ion-inline-end:"/home/kiko/py10/odoo10/odoo-repos/app/warehouse_app/static/warehouse/src/pages/treeops/treeops.html"*/,
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_6__ionic_storage__["b" /* Storage */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_6__ionic_storage__["b" /* Storage */]) === "function" && _e || Object])
    ], TreeopsPage);
    return TreeopsPage;
    var _a, _b, _c, _d, _e;
}());

//# sourceMappingURL=treeops.js.map

/***/ })

},[213]);
//# sourceMappingURL=main.js.map