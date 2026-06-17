import React, { useEffect, useState } from 'react';
import { api } from './api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  LayoutDashboard, UserCheck, GraduationCap, Calendar, Settings, 
  Search, Bell, FileText, TrendingUp, AlertCircle, CheckCircle2 
} from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [atRisk, setAtRisk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    async function initDashboard() {
      try {
        const [s, t, r] = await Promise.all([
          api.getStudents(),
          api.getTopPerformers(),
          api.getAtRiskStudents()
        ]);
        setStudents(s || []);
        setTopPerformers(t || []);
        setAtRisk(r || []);
      } catch (err) {
        console.error("Data coupling failed: ", err);
      } finally {
        setLoading(false);
      }
    }
    initDashboard();
  }, []);

  // Simulated layout data based on visual indicators in 1000148164.jpg
  const trendData = [
    { name: 'Sep', Current: 3.2, Previous: 3.0 },
    { name: 'Oct', Current: 3.5, Previous: 3.1 },
    { name: 'Nov', Current: 3.3, Previous: 3.4 },
    { name: 'Dec', Current: 3.4, Previous: 3.2 },
    { name: 'Jan', Current: 3.6, Previous: 3.3 },
    { name: 'Feb', Current: 3.84, Previous: 3.4 },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0d14]">
        <div className="text-[#3b82f6] font-medium tracking-wide animate-pulse">
          Initializing EduAnalytics Workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0b0d14] text-slate-200">
      
      {/* ── LEFT SIDEBAR PANEL (As seen in 1000148164.jpg) ── */}
      <aside className="w-64 bg-[#111420] border-r border-[#1e2330] flex flex-col justify-between p-5 hidden md:flex">
        <div>
          <div className="flex items-center gap-2.5 px-2 py-3 mb-8">
            <div className="bg-[#2563eb] text-white p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <GraduationCap size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">EduAnalytics</h2>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Admin Portal</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { name: 'Overview', icon: <LayoutDashboard size={18} /> },
              { name: 'Individual Progress', icon: <UserCheck size={18} /> },
              { name: 'Subject Performance', icon: <GraduationCap size={18} /> },
              { name: 'Attendance', icon: <Calendar size={18} /> },
              { name: 'Settings', icon: <Settings size={18} /> },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                  activeTab === item.name
                    ? 'bg-[#1d4ed8] text-white shadow-lg shadow-blue-600/10'
                    : 'text-slate-400 hover:bg-[#161a2b] hover:text-slate-200'
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <button className="w-full bg-[#1e2538] hover:bg-[#252e47] text-white text-xs font-bold py-3 px-4 rounded-xl transition-all border border-[#2b3550] flex items-center justify-center gap-2">
          <FileText size={14} /> Export Report
        </button>
      </aside>

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR SEARCH & PROFILE */}
        <header className="h-16 border-b border-[#1e2330] bg-[#111420]/50 backdrop-blur-md px-6 flex items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search students, classes, or records..." 
              className="w-full bg-[#151926] border border-[#22293d] rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500 text-slate-200 placeholder-slate-500 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-200 bg-[#151926] rounded-xl border border-[#22293d]">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 border-l border-[#1e2330] pl-4">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                alt="Admin Profile" 
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-blue-500/20"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-white leading-tight">Sarah Jenkins</p>
                <p className="text-[10px] text-slate-500 font-medium">Chief Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* METRIC WRAPPERS & DASHBOARD CARDS */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TOP KPI BANNER ROW (Matches 1000148164.jpg Top Metrics) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* CARD 1: GPA */}
            <div className="bg-[#111420] border border-[#1e2330] p-5 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start text-slate-400">
                <span className="text-[11px] font-bold tracking-wider uppercase">Average GPA</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <TrendingUp size={10} /> +0.15
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-white tracking-tight mt-3">3.84</h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Term 2 • 2024</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20" />
            </div>

            {/* CARD 2: ATTENDANCE */}
            <div className="bg-[#111420] border border-[#1e2330] p-5 rounded-2xl">
              <div className="text-slate-400 text-[11px] font-bold tracking-wider uppercase">Attendance Rate</div>
              <h3 className="text-3xl font-extrabold text-white tracking-tight mt-3">94.2%</h3>
              <div className="w-full bg-[#181d2e] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '94.2%' }} />
              </div>
            </div>

            {/* CARD 3: PENDING TASKS */}
            <div className="bg-[#111420] border border-[#1e2330] p-5 rounded-2xl">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[11px] font-bold tracking-wider uppercase">Pending Assignments</span>
                <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">High Priority</span>
              </div>
              <h3 className="text-3xl font-extrabold text-white tracking-tight mt-3">128</h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Across active modules</p>
            </div>

            {/* CARD 4: CRITICAL ALERTS */}
            <div className="bg-[#111420] border border-[#1e2330] p-5 rounded-2xl relative">
              <div className="text-rose-400 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <AlertCircle size={12} /> Across all grades
              </div>
              <h3 className="text-3xl font-extrabold text-white tracking-tight mt-3">{atRisk.length || 14}</h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Student alerts active</p>
            </div>
          </div>

          {/* MAIN GRAPH SPLIT PANEL */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LINE / AREA CHART */}
            <div className="bg-[#111420] border border-[#1e2330] p-5 rounded-2xl lg:col-span-2 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Academic Performance Trends</h4>
                  <p className="text-[11px] text-slate-500">Monthly GPA distribution across all departments</p>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-[#161a2b] border border-[#22293d] px-2.5 py-1 rounded-lg">2023-24</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#161b2c" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={11} tickLine={false} domain={[2.5, 4.0]} />
                    <Tooltip contentStyle={{ backgroundColor: '#151926', borderColor: '#22293d', borderRadius: '12px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="Current" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCurrent)" />
                    <Area type="monotone" dataKey="Previous" stroke="#475569" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RECENT ACTIVITY LOG PANEL */}
            <div className="bg-[#111420] border border-[#1e2330] p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-white">Recent Activity</h4>
                  <button className="text-[11px] font-bold text-blue-500 hover:underline">View All</button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl h-fit"><CheckCircle2 size={14} /></div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">Physics Grade Update</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">Class 12-B average increased to 84% after Final Assessment.</p>
                      <span className="text-[9px] text-slate-600 font-semibold block mt-1">12 mins ago</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl h-fit"><AlertCircle size={14} /></div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">Attendance Alert</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">Marcus Reed (Gr. 11) attendance dropped below 85% safety threshold.</p>
                      <span className="text-[9px] text-slate-600 font-semibold block mt-1 font-mono">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1e2330] mt-4 flex items-center justify-between text-[11px] text-slate-400">
                <span>Total Active Profiles: {students.length || 'Loading...'}</span>
              </div>
            </div>
          </div>

          {/* SUBJECT PERFORMANCE PROGRESS BARS */}
          <div className="bg-[#111420] border border-[#1e2330] p-5 rounded-2xl">
            <h4 className="text-sm font-bold text-white mb-4">Top Performing Subjects</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Advanced Mathematics', score: '92%', color: 'from-blue-600 to-sky-400' },
                { name: 'Computer Science', score: '88%', color: 'from-indigo-600 to-blue-500' },
                { name: 'Theoretical Physics', score: '85%', color: 'from-violet-600 to-indigo-500' },
                { name: 'English Literature', score: '78%', color: 'from-emerald-600 to-teal-500' },
              ].map((subject, idx) => (
                <div key={idx} className="bg-[#151926] border border-[#22293d] p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300 truncate pr-2">{subject.name}</span>
                    <span className="text-xs font-mono font-bold text-blue-400">{subject.score}</span>
                  </div>
                  <div className="w-full bg-[#1e2538] h-1.5 rounded-full overflow-hidden">
                    <div className={`bg-gradient-to-r ${subject.color} h-full rounded-full`} style={{ width: subject.score }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
