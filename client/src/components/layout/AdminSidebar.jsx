import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, ShieldAlert, Building2, GraduationCap, UserCog, UserCheck, 
  CalendarDays, ClipboardCheck, BookOpenCheck, TestTube, Award, Megaphone, Files, 
  Library, Home, Bus, Wallet, Briefcase, Ticket, Calendar, MessageSquare, Bell, 
  Bot, PieChart, FolderTree, FileTerminal, Settings, LogOut, ChevronDown, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuData = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { 
    name: 'User Management', icon: Users, path: '/admin/users',
    subItems: [
      { name: 'Students', path: '/admin/users/students' },
      { name: 'Teachers', path: '/admin/users/teachers' }
    ]
  },
  { name: 'Role & Permission', icon: ShieldAlert, path: '/admin/roles' },
  { name: 'Departments', icon: Building2, path: '/admin/departments' },
  { 
    name: 'Academic Management', icon: GraduationCap, path: '/admin/academic',
    subItems: [
      { name: 'Courses', path: '/admin/academic/courses' },
      { name: 'Subjects', path: '/admin/academic/subjects' },
      { name: 'Semesters', path: '/admin/academic/semesters' },
      { name: 'Sections', path: '/admin/academic/sections' },
      { name: 'Academic Years', path: '/admin/academic/years' }
    ]
  },
  { name: 'Faculty Management', icon: UserCog, path: '/admin/faculty' },
  { name: 'Student Management', icon: UserCheck, path: '/admin/students' },
  { name: 'Timetable Management', icon: CalendarDays, path: '/admin/timetable' },
  { name: 'Attendance Management', icon: ClipboardCheck, path: '/admin/attendance' },
  { name: 'Assignment Management', icon: BookOpenCheck, path: '/admin/assignments' },
  { name: 'Examination Management', icon: TestTube, path: '/admin/examination' },
  { name: 'Results & Grade', icon: Award, path: '/admin/results' },
  { name: 'Announcements', icon: Megaphone, path: '/admin/announcements' },
  { 
    name: 'Document Management', icon: Files, path: '/admin/documents',
    subItems: [
      { name: 'Upload Documents', path: '/admin/documents/upload' },
      { name: 'Approvals', path: '/admin/documents/approvals' },
      { name: 'Certificates', path: '/admin/documents/certificates' }
    ]
  },
  { name: 'Library Management', icon: Library, path: '/admin/library' },
  { name: 'Hostel Management', icon: Home, path: '/admin/hostel' },
  { name: 'Transport Management', icon: Bus, path: '/admin/transport' },
  { name: 'Fee Management', icon: Wallet, path: '/admin/fees' },
  { name: 'Placement Cell', icon: Briefcase, path: '/admin/placement' },
  { name: 'Events Management', icon: Ticket, path: '/admin/events' },
  { name: 'Academic Calendar', icon: Calendar, path: '/admin/calendar' },
  { name: 'Messaging', icon: MessageSquare, path: '/admin/messaging' },
  { name: 'Notifications', icon: Bell, path: '/admin/notifications' },

  { 
    name: 'Reports & Analytics', icon: PieChart, path: '/admin/reports',
    subItems: [
      { name: 'Student Reports', path: '/admin/reports/students' },
      { name: 'Faculty Reports', path: '/admin/reports/faculty' },
      { name: 'Attendance Reports', path: '/admin/reports/attendance' },
      { name: 'Exam Reports', path: '/admin/reports/exams' },
      { name: 'Placement Reports', path: '/admin/reports/placement' }
    ]
  },

  { name: 'Audit Logs', icon: FileTerminal, path: '/admin/logs' },
  { 
    name: 'System Settings', icon: Settings, path: '/admin/settings',
    subItems: [
      { name: 'General Settings', path: '/admin/settings/general' },
      { name: 'Email Configuration', path: '/admin/settings/email' },
      { name: 'Security Settings', path: '/admin/settings/security' },
      { name: 'Backup & Restore', path: '/admin/settings/backup' },
      { name: 'API Keys', path: '/admin/settings/apikeys' }
    ]
  },
];

const MenuItem = ({ item, isExpanded, onToggle, currentPath }) => {
  const hasSubItems = item.subItems && item.subItems.length > 0;
  // Automatically consider item active if exact path matches, or if a sub-path matches and the menu isn't explicitly expanded yet
  const isActive = currentPath === item.path || (hasSubItems && currentPath.startsWith(item.path));

  return (
    <div className="flex flex-col mb-1">
      {hasSubItems ? (
        <button
          onClick={onToggle}
          className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300 ${
            isActive && !isExpanded ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <item.icon size={20} className={isActive && !isExpanded ? 'text-orange-500' : 'text-gray-400'} />
            <span className={`font-medium ${isActive && !isExpanded ? 'text-orange-700' : ''}`}>{item.name}</span>
          </div>
          {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
        </button>
      ) : (
        <NavLink
          to={item.path}
          className={({ isActive: linkActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              linkActive ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20' : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          {({ isActive: linkActive }) => (
            <>
              <item.icon size={20} className={linkActive ? 'text-white' : 'text-gray-400'} />
              <span className="font-medium">{item.name}</span>
            </>
          )}
        </NavLink>
      )}

      {/* Sub Menu Items */}
      <AnimatePresence>
        {hasSubItems && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden flex flex-col pl-11 pr-2 mt-1 gap-1"
          >
            {item.subItems.map(subItem => (
              <NavLink
                key={subItem.path}
                to={subItem.path}
                className={({ isActive: subActive }) =>
                  `block px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                    subActive ? 'bg-orange-100 text-orange-700 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {subItem.name}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminSidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState(() => {
    // Auto-expand menus based on current route
    const initialExpanded = {};
    menuData.forEach(item => {
      if (item.subItems && location.pathname.startsWith(item.path)) {
        initialExpanded[item.name] = true;
      }
    });
    return initialExpanded;
  });

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-80 bg-white/60 backdrop-blur-xl border-r border-gray-200/50 flex flex-col h-screen sticky top-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
    >
      <div className="p-6 flex items-center gap-4 border-b border-gray-200/50 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/30">
          A
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500 tracking-tight">
          Admin Portal
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col custom-scrollbar">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-3">
          Main Menu
        </div>
        
        <div className="flex flex-col pb-20">
          {menuData.map((item) => (
            <MenuItem 
              key={item.name} 
              item={item} 
              isExpanded={!!expandedMenus[item.name]} 
              onToggle={() => toggleMenu(item.name)}
              currentPath={location.pathname}
            />
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200/50 bg-white/40 backdrop-blur-md shrink-0">
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 font-medium group"
        >
          <LogOut size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
          <span>Log Out</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
