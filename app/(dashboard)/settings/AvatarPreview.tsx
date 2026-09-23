'use client';

import { useState } from 'react';
import Image from 'next/image';

export function AvatarPreview({ 
  user 
}: { 
  user: { firstName: string, lastName: string, avatarUrl?: string | null } 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-24 h-24 shrink-0 rounded-full bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center overflow-hidden hover:opacity-80 hover:ring-4 hover:ring-amber-500/20 transition-all cursor-zoom-in"
      >
        {user.avatarUrl ? (
          <Image src={user.avatarUrl} alt="Avatar" width={96} height={96} className="w-full h-full object-cover" unoptimized={true} />
        ) : (
          <span className="text-3xl font-bold text-amber-500 tracking-wider">
            {user.firstName[0]}{user.lastName[0]}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative w-full max-w-2xl max-h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar Enlarged" className="w-full h-auto max-h-[85vh] rounded-xl shadow-2xl object-contain" />
            ) : (
              <div className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-amber-500/10 border-4 border-amber-500/20 flex items-center justify-center shadow-2xl">
                <span className="text-[100px] font-bold text-amber-500 tracking-wider">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
