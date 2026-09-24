'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { processMoveOutAction, deleteTenantAction, updateTenantAction } from '@/app/actions/tenant';

export default function TenantActions({ 
  tenant, 
  canDelete,
  isActive
}: { 
  tenant: any;
  canDelete: boolean;
  isActive: boolean;
}) {
  const [showEdit, setShowEdit] = useState(false);
  const [showMoveOut, setShowMoveOut] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [editState, editFormAction, isEditPending] = useActionState(updateTenantAction, null);
  const [moveOutState, moveOutFormAction, isMoveOutPending] = useActionState(processMoveOutAction, null);
  const [deleteState, deleteFormAction, isDeletePending] = useActionState(deleteTenantAction, null);

  return (
    <>
      <div className="flex gap-2">
        <button 
          onClick={() => setShowEdit(true)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Edit Tenant
        </button>
        {isActive && (
          <button 
            onClick={() => setShowMoveOut(true)}
            className="px-4 py-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg transition-colors text-sm font-medium"
          >
            Process Move Out
          </button>
        )}
        <button 
          onClick={() => setShowDelete(true)}
          className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors text-sm font-medium"
        >
          Delete Tenant
        </button>
      </div>

      {showEdit && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-[#131A26] border border-slate-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">Edit Tenant</h2>
            <form action={editFormAction} className="space-y-4">
              <input type="hidden" name="tenantId" value={tenant.id} />
              <input type="hidden" name="unitId" value={tenant.unitId} />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">First Name</label>
                  <input type="text" name="firstName" required defaultValue={tenant.firstName} className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Last Name</label>
                  <input type="text" name="lastName" required defaultValue={tenant.lastName} className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2 text-white" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                <input type="email" name="email" defaultValue={tenant.email} className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                <input type="tel" name="phone" defaultValue={tenant.phone || ''} className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Lease Start</label>
                  <input type="date" name="leaseStart" required defaultValue={tenant.moveInDate.toISOString().split('T')[0]} className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Lease End</label>
                  <input type="date" name="leaseEnd" defaultValue={tenant.moveOutDate ? tenant.moveOutDate.toISOString().split('T')[0] : ''} className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2 text-white" />
                </div>
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

      {showMoveOut && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-[#131A26] border border-slate-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-2">Process Move Out</h2>
            <p className="text-slate-400 text-sm mb-6">
              This will mark the tenant as Moved Out and set their unit to Vacant. Historical invoices and payments will remain intact.
            </p>
            <form action={moveOutFormAction} className="space-y-4">
              <input type="hidden" name="tenantId" value={tenant.id} />
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Move Out Date</label>
                <input 
                  type="date" 
                  name="moveOutDate"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              {moveOutState?.error && (
                <div className="text-red-500 text-sm">{moveOutState.error}</div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowMoveOut(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isMoveOutPending}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#0B101A] font-semibold rounded-lg disabled:opacity-50"
                >
                  {isMoveOutPending ? 'Processing...' : 'Confirm Move Out'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-[#131A26] border border-slate-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-red-500 mb-2">Delete Tenant</h2>
            
            {canDelete ? (
              <p className="text-slate-300 text-sm mb-6">
                Are you sure you want to delete this tenant? This action cannot be undone.
              </p>
            ) : (
              <p className="text-amber-500 text-sm mb-6">
                This tenant cannot be deleted because they have financial history (invoices or payments). Please use "Process Move Out" instead.
              </p>
            )}

            {canDelete ? (
              <form action={deleteFormAction} className="space-y-4">
                <input type="hidden" name="tenantId" value={tenant.id} />
                
                {deleteState?.error && (
                  <div className="text-red-500 text-sm">{deleteState.error}</div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button 
                    type="button" 
                    onClick={() => setShowDelete(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isDeletePending}
                    className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg disabled:opacity-50"
                  >
                    {isDeletePending ? 'Deleting...' : 'Delete Permanently'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowDelete(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
