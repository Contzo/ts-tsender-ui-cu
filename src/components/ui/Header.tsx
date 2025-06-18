"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Title on the left */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">TSender</h1>
          </div>

          {/* GitHub button and Connect button on the right */}
          <div className="flex items-center space-x-4">
            {/* GitHub button */}
            <a
              href="https://github.com/Contzo/ts-tsender-ui-cu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <FaGithub className="w-5 h-5 mr-2" />
              GitHub
            </a>

            {/* Connect button */}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
