"use client";
import React, { createContext, useContext } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";



const ListContext = createContext<"ul" | "ol" | null>(null);

interface MarkdownProps {
  content: string;
}

export default function MarkdownLightRenderer({ content }: MarkdownProps) {
  const ListProvider: React.FC<{
    type: "ul" | "ol";
    children: React.ReactNode;
  }> = ({ type, children }) => <ListContext.Provider value={type}>{children}</ListContext.Provider>;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        ul: ({ children, ...props }) => (
          <ListProvider type="ul">
            <ul className="ml-0 py-2" {...props}>
              {children}
            </ul>
          </ListProvider>
        ),
        ol: ({ children, ...props }) => (
          <ListProvider type="ol">
            <ol className="ml-6 mb-4 list-decimal space-y-2" {...props}>
              {children}
            </ol>
          </ListProvider>
        ),
        li: function Li({ children, ...props }) {
          const parentType = useContext(ListContext);
          if (parentType === "ul") {
            return (
              <li className="flex items-start space-x-2 py-1" {...props}>
                <span className="w-3 h-0.5 bg-gold mt-3 shrink-0 inline-block" />
                <span>{children}</span>
              </li>
            );
          }
          return <li {...props}>{children}</li>;
        },
        h1: (props) => <h1 className="text-3xl font-bold mb-4" {...props} />,
        h2: (props) => <h2 className="text-2xl font-semibold " {...props} />,
        p: (props) => <p className="my-2 text-foreground" {...props} />,
        a: ({ children, ...props }) => (
          <span className="text-t2 hover:text-t0 inline cursor-pointer" {...props}>
            {children}
          </span>
        ),
      }}>
      {content}
    </ReactMarkdown>
  );
}
