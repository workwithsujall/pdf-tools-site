import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Layers, FileOutput, ArrowUpDown } from 'lucide-react';

interface ToolButtonsProps {
  onToolSelect: (tool: string) => void;
  selectedTool: string;
}

const ToolButtons = ({ onToolSelect, selectedTool }: ToolButtonsProps) => {
  const tools = [
    {
      id: 'compress',
      name: 'Compress PDF',
      description: 'Reduce file size while maintaining quality',
      icon: (className: string) => <Layers className={className} />,
      link: null // No link as it's the default tool on homepage
    },
    {
      id: 'merge',
      name: 'Merge PDFs',
      description: 'Combine multiple PDFs into one document',
      icon: (className: string) => <ArrowUpDown className={className} />,
      link: '/merge' // Link to the merge page
    },
    {
      id: 'convert',
      name: 'Convert PDF',
      description: 'Convert PDFs to different formats',
      icon: (className: string) => <FileOutput className={className} />,
      link: null // No link yet
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
      {tools.map((tool) => {
        const isSelected = selectedTool === tool.id;
        const ButtonContent = () => (
          <>
            <div 
              className={`
                rounded-full p-2 
                ${isSelected ? 'bg-white' : 'bg-primary/10'}
                transition-all duration-200
              `}
            >
              {tool.icon(`h-5 w-5 ${isSelected ? 'text-primary' : 'text-primary/80'}`)}
            </div>
            <div>
              <p className={`font-medium ${isSelected ? 'text-white' : 'text-gray-800'}`}>{tool.name}</p>
              <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                {tool.description}
              </p>
            </div>
          </>
        );

        // If tool has a link and is not the currently selected tool, use Link component
        if (tool.link && tool.id !== selectedTool) {
          return (
            <Link href={tool.link} key={tool.id} passHref>
              <motion.div
                whileHover={{ y: -2 }}
                className={`
                  flex items-center space-x-3 p-3 rounded-lg cursor-pointer
                  border border-gray-200 hover:border-primary/30
                  ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white'}
                  transition-all duration-200
                `}
              >
                <ButtonContent />
              </motion.div>
            </Link>
          );
        }

        // Otherwise use regular button
        return (
          <motion.div
            key={tool.id}
            whileHover={{ y: -2 }}
            className={`
              flex items-center space-x-3 p-3 rounded-lg cursor-pointer
              border border-gray-200 hover:border-primary/30
              ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white'}
              transition-all duration-200
            `}
            onClick={() => onToolSelect(tool.id)}
          >
            <ButtonContent />
          </motion.div>
        );
      })}
    </div>
  );
};

export default ToolButtons; 