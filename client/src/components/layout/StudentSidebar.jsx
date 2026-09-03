import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  ClipboardList,
  CheckCircle,
  FileText,
  User,
  LogOut,
  Award,
  Library,
  FolderOpen,
  BellRing,
  Users,
  Bot,
  Bell,
  MessageSquare,
  TrendingUp,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

const StudentSidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
    { name: 'My Courses', icon: BookOpen, path: '/student/courses' },
    { name: 'Timetable', icon: Calendar, path: '/student/timetable' },
    { name: 'Assignments', icon: FileText, path: '/student/assignments' },
    { name: 'Attendance', icon: CheckCircle, path: '/student/attendance' },
    { name: 'Exams', icon: ClipboardList, path: '/student/exams' },
    { name: 'Results / Grades', icon: Award, path: '/student/results' },
    { name: 'Study Materials', icon: Library, path: '/student/materials' },
    { name: 'Documents', icon: FolderOpen, path: '/student/documents' },
    { name: 'Notices', icon: BellRing, path: '/student/notices' },
    { name: 'My Teachers', icon: Users, path: '/student/teachers' },
    { name: 'Notifications', icon: Bell, path: '/student/notifications' },
    { name: 'Messages', icon: MessageSquare, path: '/student/messages' },
    { name: 'My Progress', icon: TrendingUp, path: '/student/progress' },
    { name: 'Profile', icon: User, path: '/student/profile' },
    { name: 'Settings', icon: Settings, path: '/student/settings' },
  ];

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-72 bg-white/60 backdrop-blur-xl border-r border-gray-200/50 flex flex-col h-screen sticky top-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
    >
      <div className="p-6 flex items-center gap-4 border-b border-gray-200/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
          S
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 tracking-tight">
          Student Portal
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-1.5 custom-scrollbar">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-3">
          Main Menu
        </div>
        
        {navItems.map((item, index) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? 'bg-blue-50/80 text-blue-600 font-semibold shadow-sm border border-blue-100/50'
                  : 'text-gray-500 hover:bg-gray-50/80 hover:text-gray-900 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600 transition-colors'} 
                />
                <span className={isActive ? 'translate-x-1 transition-transform' : 'group-hover:translate-x-1 transition-transform'}>
                  {item.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator" 
                    className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full" 
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-5 border-t border-gray-200/50 bg-gray-50/30">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 w-full group border border-transparent hover:border-red-100"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Log Out</span>
        </NavLink>
      </div>
    </motion.aside>
  );
};

export default StudentSidebar;
