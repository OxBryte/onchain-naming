export type TemplateName = 'minimal' | 'corporate' | 'creative' | 'dark' | 'gradient';

export interface TemplateConfig {
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
}

export const templates: Record<TemplateName, TemplateConfig> = {
  minimal: {
    name: 'Minimal',
    description: 'Clean and simple design',
    preview: '✨',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      background: 'from-blue-50 via-white to-purple-50',
      text: 'text-gray-900',
      accent: 'bg-blue-600',
    },
  },
  corporate: {
    name: 'Corporate',
    description: 'Professional business style',
    preview: '💼',
    colors: {
      primary: '#1F2937',
      secondary: '#4B5563',
      background: 'from-gray-50 via-white to-gray-100',
      text: 'text-gray-900',
      accent: 'bg-gray-900',
    },
  },
  creative: {
    name: 'Creative',
    description: 'Bold and colorful',
    preview: '🎨',
    colors: {
      primary: '#EC4899',
      secondary: '#F59E0B',
      background: 'from-pink-50 via-yellow-50 to-orange-50',
      text: 'text-gray-900',
      accent: 'bg-gradient-to-r from-pink-500 to-orange-500',
    },
  },
  dark: {
    name: 'Dark Mode',
    description: 'Modern dark theme',
    preview: '🌙',
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      background: 'from-gray-900 via-gray-800 to-gray-900',
      text: 'text-gray-100',
      accent: 'bg-indigo-600',
    },
  },
  gradient: {
    name: 'Gradient',
    description: 'Vibrant gradient design',
    preview: '🌈',
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      background: 'from-purple-500 via-pink-500 to-red-500',
      text: 'text-white',
      accent: 'bg-white text-purple-600',
    },
  },
};

export function getTemplate(name: TemplateName): TemplateConfig {
  return templates[name] || templates.minimal;
}

