'use client';

import { useState } from 'react';
import { updateProfileAction } from '@/app/actions/user';
import { X, Loader2 } from 'lucide-react';

export function EditProfileModal({ 
  user 
}: { 
  user: { firstName: string, lastName: string, email: string, role: string, avatarUrl?: string | null } 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await updateProfileAction(formData);
    
    if (result.success) {
      setIsOpen(false);
    } else {
      setError(result.error || 'Failed to update profile');
    }
    
    setIsLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700 mt-4 md:mt-0"
      >
        Edit Profile
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131A26] border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm border border-red-500/20">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">First Name</label>
                  <input 
                    name="firstName" 
                    defaultValue={user.firstName}
                    required
                    className="w-full bg-[#0B101A] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Last Name</label>
                  <input 
                    name="lastName" 
                    defaultValue={user.lastName}
                    required
                    className="w-full bg-[#0B101A] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                <input 
                  type="email"
                  name="email" 
                  defaultValue={user.email}
                  required
                  className="w-full bg-[#0B101A] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
                <select 
                  name="role" 
                  defaultValue={user.role}
                  className="w-full bg-[#0B101A] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="PROPERTY_MANAGER">Property Manager</option>
                  <option value="SYSTEM_ADMIN">System Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Avatar Image URL (Optional)</label>
                <input 
                  name="avatarUrl" 
                  defaultValue={user.avatarUrl || ''}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-[#0B101A] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
