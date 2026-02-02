import React, { useState, useEffect, useCallback } from 'react';

// Constants
const STORAGE_KEY = 'sms_temp_state_v3';
const REGIONS = [
    { flag: '🇺🇸', code: '+1', name: 'USA' },
    { flag: '🇬🇧', code: '+44', name: 'UK' },
    { flag: '🇨🇦', code: '+1', name: 'Canada' },
    { flag: '🇦🇺', code: '+61', name: 'Australia' },
    { flag: '🇩🇪', code: '+49', name: 'Germany' },
    { flag: '🇫🇷', code: '+33', name: 'France' },
    { flag: '🇮🇹', code: '+39', name: 'Italy' },
    { flag: '🇪🇸', code: '+34', name: 'Spain' },
    { flag: '🇳🇱', code: '+31', name: 'Netherlands' },
    { flag: '🇸🇪', code: '+46', name: 'Sweden' },
    { flag: '🇨🇭', code: '+41', name: 'Switzerland' },
    { flag: '🇧🇪', code: '+32', name: 'Belgium' }
];

// --- COMPONENTS ---

const Toast = ({ message, type = 'success', onClose }: { message: string, type?: 'success' | 'error', onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-max max-w-[90vw] fade-in">
            <div className={`px-5 py-3 rounded-full flex items-center gap-3 shadow-2xl glass border ${
                type === 'success' ? 'border-green-100' : 'border-red-100'
            }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    <i className={`text-[10px] fa-solid ${type === 'success' ? 'fa-check' : 'fa-xmark'}`}></i>
                </div>
                <span className="text-sm font-bold text-slate-800 pr-2">{message}</span>
            </div>
        </div>
    );
};

const SplashScreen = () => (
    <div className="fixed inset-0 bg-[#f8fafc] flex flex-col items-center justify-center z-[100]">
        <div className="flex flex-col items-center space-y-6 animate-pulse">
            <div className="w-20 h-20 bg-indigo-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-indigo-200">
                <i className="fa-solid fa-comment-sms text-4xl text-white"></i>
            </div>
            <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SMS Temp</h1>
                <p className="text-slate-500 text-sm mt-1">Secure Protocol v4.3.0</p>
            </div>
        </div>
        <div className="absolute bottom-12 flex flex-col items-center space-y-4">
            <div className="spinner"></div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Initializing Secure Link...</p>
        </div>
    </div>
);

const AuthScreen = ({ onStart }: { onStart: () => void }) => (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center px-6 pt-20 pb-12 fade-in">
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
            <div className="w-64 h-64 bg-indigo-50 rounded-full flex items-center justify-center relative mb-12">
                <div className="absolute inset-0 bg-indigo-600 opacity-5 rounded-full animate-ping"></div>
                <i className="fa-solid fa-comment-sms text-7xl text-indigo-600"></i>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Stay Anonymous</h2>
            <p className="text-slate-500 text-center text-lg leading-relaxed mb-12">
                Instantly generate disposable numbers for verification. No SIM card required.
            </p>
        </div>
        <button 
            onClick={onStart}
            className="w-full max-w-sm py-5 bg-indigo-600 text-white rounded-[20px] font-bold text-lg shadow-xl shadow-indigo-200 btn-press transition-all hover:bg-indigo-700"
        >
            Start Now
        </button>
    </div>
);

const NavButton = ({ active, icon, label, onClick }: { active: boolean, icon: string, label: string, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center gap-1 transition-all duration-300 btn-press relative ${active ? 'text-indigo-600' : 'text-slate-400'}`}
    >
        {active && <div className="w-8 h-1 rounded-full absolute -top-4 bg-indigo-600"></div>}
        <i className={`fa-solid ${icon} text-lg`}></i>
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
);

// --- VIEWS ---

const HomeView = ({ onGenerate, isGenerating }: { onGenerate: (flag: string, code: string) => void, isGenerating: boolean }) => (
    <div className="space-y-6">
        <div className="bg-indigo-600 rounded-[28px] p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Secure Gateway</h3>
                    <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        Online
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/10">
                    <i className="fa-solid fa-shield-check text-indigo-200"></i>
                    <span className="text-sm font-medium opacity-90">Protocol TLS 1.3 Active</span>
                </div>
            </div>
        </div>

        <div className="px-1">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-slate-900 font-bold">Select Region</h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Proxy</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {REGIONS.map((region, idx) => (
                    <button
                        key={idx}
                        onClick={() => onGenerate(region.flag, region.code)}
                        disabled={isGenerating}
                        className="bg-white p-6 rounded-[24px] border border-slate-100 flex flex-col items-center justify-center space-y-3 btn-press shadow-sm hover:shadow-md transition-all hover:border-indigo-200 active:border-indigo-300"
                    >
                        <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-3xl shadow-inner border border-slate-50">
                            {region.flag}
                        </div>
                        <div className="text-center">
                            <div className="text-slate-900 font-bold text-sm tracking-tight">{region.name}</div>
                            <div className="text-[11px] text-indigo-600 font-bold mt-1 bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block">
                                {region.code}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    </div>
);

const NumbersView = ({ activeNumber, onCopy }: { activeNumber: any, onCopy: (text: string) => void }) => (
    !activeNumber ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                <i className="fa-solid fa-hashtag text-4xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Lines</h3>
            <p className="text-slate-500">Visit Home to allocate a number.</p>
        </div>
    ) : (
        <div className="space-y-6">
            <div className="bg-white rounded-[28px] p-10 border border-slate-100 shadow-sm text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <i className="fa-solid fa-hashtag text-9xl -mr-12 -mt-12"></i>
                </div>
                <div className="flex flex-col items-center space-y-6 relative z-10">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-5xl shadow-inner border border-slate-100">
                        {activeNumber.flag}
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[3px]">Secure Line</p>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{activeNumber.number}</h2>
                    </div>
                    <button 
                        onClick={() => onCopy(activeNumber.number)}
                        className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-2xl font-bold btn-press shadow-2xl"
                    >
                        <i className="fa-regular fa-copy"></i> Copy Number
                    </button>
                </div>
            </div>
        </div>
    )
);

const InboxView = ({ messages }: { messages: any[] }) => (
    messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                <i className="fa-regular fa-envelope text-4xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Inbox Empty</h3>
            <p className="text-slate-500">Monitoring incoming verifications...</p>
        </div>
    ) : (
        <div className="space-y-4 pb-12">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-slate-900">Recent Messages</h3>
                <span className="text-[10px] bg-indigo-600 text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">{messages.length} SMS</span>
            </div>
            {messages.map(msg => (
                <div key={msg.id} className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex gap-4 fade-in">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0 border border-indigo-100">
                        <span className="text-indigo-600 font-bold text-lg">{msg.sender.charAt(0)}</span>
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900">{msg.sender}</h4>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{msg.time}</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">{msg.body}</p>
                    </div>
                </div>
            ))}
        </div>
    )
);

// --- CORE APPLICATION ---

const App = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [state, setState] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : { isLoggedIn: false, activeNumber: null, messages: [] };
        } catch (e) {
            return { isLoggedIn: false, activeNumber: null, messages: [] };
        }
    });
    const [currentView, setCurrentView] = useState('home');
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 2200);
        return () => clearTimeout(timer);
    }, []);

    const showToastMsg = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
    }, []);

    const generateNumber = async (flag: string, dialCode: string) => {
        setIsGenerating(true);
        try {
            await new Promise(r => setTimeout(r, 2000));
            const randomNum = Math.floor(100000000 + Math.random() * 900000000).toString();
            const formattedNum = `${dialCode} ${randomNum.slice(0, 3)} ${randomNum.slice(3, 6)} ${randomNum.slice(6)}`;
            const newNumber = { flag, dialCode, number: formattedNum };
            const systemMessage = {
                id: Date.now().toString(),
                sender: 'System',
                body: 'Secure encryption active. Line ready for verifications.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setState((prev: any) => ({ ...prev, activeNumber: newNumber, messages: [systemMessage, ...prev.messages] }));
            showToastMsg('Line Activated');
            setCurrentView('numbers');
        } catch (e) {
            showToastMsg('Allocation Failed', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            showToastMsg('Copied to Clipboard');
        }).catch(() => {
            showToastMsg('Copy Failed', 'error');
        });
    };

    if (showSplash) return <SplashScreen />;
    
    if (!state.isLoggedIn) {
        return (
            <AuthScreen onStart={() => {
                setState((p: any) => ({...p, isLoggedIn: true}));
                showToastMsg('Secure Session Started');
            }} />
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <header className="fixed top-0 left-0 right-0 h-[64px] glass z-40 px-6 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                        <i className="fa-solid fa-comment-sms text-white text-sm"></i>
                    </div>
                    <span className="font-bold text-slate-900 tracking-tight uppercase text-sm">SMS TEMP</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <i className="fa-solid fa-user text-[11px]"></i>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-md mx-auto p-5 pt-24 pb-28">
                {currentView === 'home' && <HomeView onGenerate={generateNumber} isGenerating={isGenerating} />}
                {currentView === 'numbers' && <NumbersView activeNumber={state.activeNumber} onCopy={copyToClipboard} />}
                {currentView === 'inbox' && <InboxView messages={state.messages} />}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 h-[76px] glass z-40 px-10 flex items-center justify-between border-t border-slate-100">
                <NavButton active={currentView === 'home'} icon="fa-house" label="Home" onClick={() => setCurrentView('home')} />
                <NavButton active={currentView === 'numbers'} icon="fa-hashtag" label="Numbers" onClick={() => setCurrentView('numbers')} />
                <NavButton active={currentView === 'inbox'} icon="fa-envelope" label="Inbox" onClick={() => setCurrentView('inbox')} />
            </nav>

            {isGenerating && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[60] flex flex-col items-center justify-center fade-in">
                    <div className="spinner mb-6"></div>
                    <div className="text-center">
                        <p className="text-slate-900 font-extrabold text-xl">Allocating Line</p>
                        <p className="text-slate-400 text-sm mt-1">Establishing secure proxy...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;