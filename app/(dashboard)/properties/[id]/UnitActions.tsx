'use client';

import { useState, useActionState } from 'react';
import { updateUnitAction, deleteUnitAction } from '@/app/actions/unit';

export default function UnitActions({ unit, propertyId }: { unit: any, propertyId: string }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [editState, editFormAction, isEditPending] = useActionState(updateUnitAction, null);
  const [deleteState, deleteFormAction, isDeletePending] = useActionState(deleteUnitAction, null);

  const canDelete = unit._count?.tenants === 0 && unit._count?.invoices === 0 && unit._count?.payments === 0;

  return (
    <>
      <div className="flex gap-2 justify-end">
        <button 
          onClick={() => setShowEdit(true)}
          className="text-amber-500 hover:text-amber-400 font-medium text-xs uppercase tracking-wider"
        >
          Edit
        </button>
        <button 
          onClick={() => setShowDelete(true)}
          className="text-red-500 hover:text-red-400 font-medium text-xs uppercase tracking-wider ml-3"
        >
          Delete
        </button>
      </div>

      {showEdit && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 text-left">
          <div className="bg-[#131A26] border border-slate-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-6">Edit Unit {unit.unitNumber}</h2>
            <form action={editFormAction} className="space-y-4">
              <input type="hidden" name="unitId" value={unit.id} />
              <input type="hidden" name="propertyId" value={propertyId} />
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Unit Number</label>
                <input type="text" name="unitNumber" required defaultValue={unit.unitNumber} className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Monthly Rent</label>
                  <input type="number" step="0.01" name="monthlyRent" required defaultValue={unit.monthlyRent} className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Currency</label>
                  <select name="currency" defaultValue={unit.currency} className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2 text-white">
                    <option value="USD">USD</option>
                    <option value="KES">KES</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Bedrooms (Optional)</label>
                <input type="number" name="bedrooms" defaultValue={unit.bedrooms || ''} className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>

              {editState?.error && <div className="text-red-500 text-sm">{editState.error}</div>}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowEdit(false)} className="px-4 py-2 text-slate-400">Cancel</button>
                <button type="submit" disabled={isEditPending} className="px-4 py-2 bg-amber-500 text-[#0B101A] font-semibold rounded-lg disabled:opacity-50">
                  {isEditPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 text-left">
          <div className="bg-[#131A26] border border-slate-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-red-500 mb-4">Delete Unit {unit.unitNumber}</h2>
            <p className="text-slate-300 text-sm mb-6">
              {canDelete 
                ? "Are you sure you want to delete this unit? This action is permanent."
                : "This unit has historical records (tenants, invoices). It cannot be permanently deleted, but it will be marked as INACTIVE instead."}
            </p>
            <form action={deleteFormAction}>
              <input type="hidden" name="unitId" value={unit.id} />
              <input type="hidden" name="propertyId" value={propertyId} />
              {deleteState?.error && <div className="text-red-500 text-sm mb-4">{deleteState.error}</div>}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowDelete(false)} className="px-4 py-2 text-slate-400">Cancel</button>
                <button type="submit" disabled={isDeletePending} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg disabled:opacity-50">
                  {isDeletePending ? 'Deleting...' : (canDelete ? 'Delete Permanently' : 'Deactivate Unit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
