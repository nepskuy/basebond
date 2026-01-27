import React from 'react';

interface ScriptProps {
  src?: string;
  children?: string;
}

const Script: React.FC<ScriptProps> = ({ src, children }) => {
  if (src) {
    return <script src={src} async />;
  }
  
  if (children) {
    return <script dangerouslySetInnerHTML={{ __html: children }} />;
  }
  
  return null;
};

export default Script;
