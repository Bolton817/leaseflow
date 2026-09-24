'use client';

import { useState, useActionState } from 'react';
import { updatePropertyAction, deletePropertyAction } from '@/app/actions/property';

export default function PropertyActions({ property }: { property: any }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [editState, editFormAction, isEditPending] = useActionState(updatePropertyAction, null);
  const [deleteState, deleteFormAction, isDeletePending] = useActionState(deletePropertyAction, null);

  const canDelete = !property.units.some((u: any) => 
    u._count?.tenants > 0 || u._count?.invoices > 0 || u._count?.payments > 0
  );

  return (
    <>
      <div className="flex gap-2">
        <button 
          onClick={() => setShowEdit(true)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Edit Property
        </button>
        <button 
          onClick={() => setShowDelete(true)}
          className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors text-sm font-medium"
        >
          Delete Property
        </button>
      </div>

      {showEdit && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-[#131A26] border border-slate-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-6">Edit Property</h2>
            <form action={editFormAction} className="space-y-4">
              <input type="hidden" name="propertyId" value={property.id} />
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Property Image (Optional)</label>
                <input type="file" name="image" accept="image/*" className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2 text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300" />
                {property.imageUrl && (
                  <p className="text-xs text-amber-500 mt-2">Uploading a new image will replace the current one.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Property Name</label>
                <input type="text" name="name" required defaultValue={property.name} className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Address</label>
                <input type="text" name="address" required defaultValue={property.address} className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">City</label>
                <input type="text" name="city" required defaultValue={property.city} className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Description (Optional)</label>
                <textarea name="description" defaultValue={property.description || ''} className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2 text-white" />
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-[#131A26] border border-slate-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-red-500 mb-4">Delete Property</h2>
            <p className="text-slate-300 text-sm mb-6">
              {canDelete 
                ? "Are you sure you want to delete this property? This action is permanent."
                : "This property has historical records (tenants, invoices). It cannot be permanently deleted, but it will be archived and hidden from your dashboard instead."}
            </p>
            <form action={deleteFormAction}>
              <input type="hidden" name="propertyId" value={property.id} />
              {deleteState?.error && <div className="text-red-500 text-sm mb-4">{deleteState.error}</div>}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowDelete(false)} className="px-4 py-2 text-slate-400">Cancel</button>
                <button type="submit" disabled={isDeletePending} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg disabled:opacity-50">
                  {isDeletePending ? 'Deleting...' : (canDelete ? 'Delete Permanently' : 'Archive Property')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
