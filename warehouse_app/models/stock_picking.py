# -*- coding: utf-8 -*-
# Copyright 2017 Comunitea - <comunitea@comunitea.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from odoo import api, models, fields
import time
from odoo.exceptions import ValidationError
from odoo.tools import DEFAULT_SERVER_DATETIME_FORMAT
WAREHOUSE_STATES = [
    ('waiting', 'Waiting assigment'),
    ('assigned', 'Assigned'),
    ('process', 'In process'),
    ('process_working', 'Working in progress'),
    ('waiting_validation', 'Waiting validatiton'),

    ('done', 'Done')]



        # if self._context.get('no_transfer', True):
        #     for op in self.picking_id.pack_operation_ids:
        #         op.picking_order = op.location_id.picking_order
        # return res


class StockPickingType(models.Model):
    _inherit = "stock.picking.type"

    show_in_pda = fields.Boolean("Show in PDA")
    short_name = fields.Char("Short name in PDA")

    @api.multi
    def _compute_picking_count(self):
        ## TODO ADAPTAR PARA USAR CON WAVE
        # TDE TODO count picking can be done using previous two

        domains = {
            'count_picking_draft': [('state', '=', 'draft')],
            'count_picking_waiting': [('state', 'in', ('confirmed', 'waiting'))],
            'count_picking_ready': [('state', 'in', ('assigned', 'partially_available'))],
            'count_picking': [('state', 'in', ('assigned', 'waiting', 'confirmed', 'partially_available'))],
            'count_picking_late': [('min_date', '<', time.strftime(DEFAULT_SERVER_DATETIME_FORMAT)),
                                   ('state', 'in', ('assigned', 'waiting', 'confirmed', 'partially_available'))],
            'count_picking_backorders': [('backorder_id', '!=', False),
                                         ('state', 'in', ('confirmed', 'assigned', 'waiting', 'partially_available'))],
        }
        for field in domains:
            data = self.env['stock.picking'].read_group(domains[field] +
                                                        [('state', 'not in', ('done', 'cancel')),
                                                         ('picking_type_id', 'in', self.ids)],
                                                        ['picking_type_id'], ['picking_type_id'])
            count = dict(
                map(lambda x: (x['picking_type_id'] and x['picking_type_id'][0], x['picking_type_id_count']), data))
            for record in self:
                record[field] = count.get(record.id, 0)
        for record in self:
            record.rate_picking_late = record.count_picking and record.count_picking_late * 100 / record.count_picking or 0
            record.rate_picking_backorders = record.count_picking and record.count_picking_backorders * 100 / record.count_picking or 0


class StockPicking(models.Model):
    _inherit = "stock.picking"

    @api.multi
    def _compute_state2(self):
        for pick in self:
            if not pick.user_id:
                pick.state_2 = 'waiting'
            else:
                if all([x.qty_done == 0.00 for x in pick.pack_operation_ids]):
                    pick.state_2 = 'assigned'
                elif all([x.qty_done > 0.00 for x in pick.pack_operation_ids]):
                    pick.state_2 = 'done'
                elif all([(x.qty_done > 0.00 or x.pda_checked) for x in pick.pack_operation_ids]):
                    pick.state_2 = 'waiting_validation'
                elif any([x.qty_done > 0.00 for x in pick.pack_operation_ids]):
                    pick.state_2 = 'process_working'
                else:
                    pick.state_2 = 'process'

    @api.multi
    def _compute_ops(self):
        for pick in self:
            pick.done_ops = len(pick.pack_operation_ids.filtered(lambda x: x.qty_done > 0))
            pick.remaining_ops = pick.pack_operation_count - pick.done_ops
            pick.ops_str = "Faltan {:02d} de {:02d}".format(pick.remaining_ops, pick.pack_operation_count)


    @api.depends('pack_operation_ids')
    @api.multi
    def _get_pack_operation_count(self):
        for pick in self:
            pick.pack_operation_count = len(pick.pack_operation_ids)

    user_id = fields.Many2one('res.users', 'Operator')
    state_2 = fields.Selection(WAREHOUSE_STATES, string ="Warehouse barcode statue", compute="_compute_state2")
    done_ops = fields.Integer('Done ops', compute="_compute_ops", multi=True)
    pack_operation_count = fields.Integer('Total ops', compute="_get_pack_operation_count", store=True)
    remaining_ops = fields.Integer('Remining ops', compute="_compute_ops", multi=True)
    ops_str = fields.Char('Str ops', compute="_compute_ops", multi=True)
    partner_id_name = fields.Char(related='partner_id.display_name')
    
    wave_id = fields.Many2one(
        'stock.picking.wave', string='Picking Wave',
        states={'done': [('readonly', True)]},
        help='Picking wave associated to this picking')

    def set_picking_order(self):
        return True
        
    @api.multi
    def send_pick_to_pda(self):
        for pick in self: 
            if pick.state in ('assigned', 'partially_available'):
                pick.picking_ids.set_picking_order()
            else:
                raise ValidationError (_("Pick state not valid"))


    @api.multi
    def do_transfer(self):
        if self._context.get('no_transfer', True):
            super(StockPicking, self).do_transfer()

    @api.multi
    def confirm_pda_done(self, transfer=False):
        for pick in self.filtered(lambda x:x.state2 in ('process', 'assigned')):
            pick.state2 = 'done'

        if transfer:
            self.filtered(lambda x:x.state == 'assigned').do_transfer()
        return True

    def confirm_from_pda(self, id, transfer=False):
        pick = self.browse(id)
        return pick.confirm_pda_done(transfer)


    @api.model
    def doTransfer(self, vals):
        id = vals.get('id', False)
        pick = self.browse(id)
        if any(op.pda_done for op in pick.pack_operation_ids):
            pick.pack_operation_ids.put_in_pack()
            pick.do_transfer()
            return True
        return False
    
    
    @api.multi
    def action_cancel(self):
        super(StockPicking, self).action_cancel()
        self.write({'wave_id': False})
        return True

    
    @api.model
    def change_pick_value(self, vals):
        print  "------------------- Cambiar valores en las albaranes ----------------\n%s"%vals
        field = vals.get('field', False)
        value = vals.get('value', False)
        id = vals.get('id', False)
        pick = self.browse(id)

        if field == 'user_id' and (not pick.user_id or pick.user_id.id == self._uid) and pick.wave_id == False:
            pick.write({'user_id': value})
        else:
            return False
        return True

    @api.model
    def _prepare_pack_ops(self, quants, forced_qties):
        if not self.picking_type_id.show_in_pda:
            return super(StockPicking, self)._prepare_pack_ops(quants,forced_qties)

        vals = super(StockPicking, self)._prepare_pack_ops(quants, forced_qties)

        location_order = {}
        for val in vals:
            id = val['location_id']
            if id in location_order.keys():
                val['picking_order'] = location_order[id]
            else:
                location_order[id] = self.env['stock.location'].search_read([('id', '=', id)], ['picking_order'], limit=1)
                val['picking_order'] = location_order[id]
        return vals