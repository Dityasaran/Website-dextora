import React from 'react';
import { Clapperboard } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-[#05050A] pt-20 pb-10 px-6 md:px-16 rounded-t-[4rem] border-t border-white/5 relative z-20">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#7B61FF]/20 flex items-center justify-center">
                            <Clapperboard size={16} className="text-[#7B61FF]" />
                        </div>
                        <span className="font-heading font-bold text-xl text-white">Dextora<span className="text-[#7B61FF]">Studio</span></span>
                    </div>
                    <p className="text-[#8a8a9a] text-sm max-w-xs leading-relaxed">
                        The cinematic front-end interface for automated AI video and avatar timeline generation.
                    </p>
                </div>

                <div className="flex gap-16">
                    <div className="flex flex-col gap-3">
                        <span className="text-white font-bold font-data text-xs mb-2">PLATFORM</span>
                        <a href="#engine" className="text-[#8a8a9a] hover:text-white transition-colors text-sm">Engine Layer</a>
                        <a href="#workflow" className="text-[#8a8a9a] hover:text-white transition-colors text-sm">GSAP Workflow</a>
                        <a href="/studio" className="text-[#7B61FF] hover:text-[#9b88ff] transition-colors text-sm font-medium">Launch Console</a>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <span className="text-[#555566] text-xs font-data">© 2026 Dextora Studio. All systems nominal.</span>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-data text-[#8a8a9a]">System Operational</span>
                </div>
            </div>
        </footer>
    );
};
