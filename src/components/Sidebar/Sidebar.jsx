import React, { useEffect, useState } from "react";
import { run } from "../config/config"; 

const Sidebar = () => {
  const [inputData, setInputData] = useState(""); 
  const [sidebarData, setSidebarData] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const handleInputChange = (event) => {
    setInputData(event.target.value);
  };

  const fetchSidebarData = async () => {
    setIsLoading(true); 
    try {
      const response = await run(inputData);
      setSidebarData(response);
    } catch (error) {
      console.error("Error fetching sidebar data:", error); 
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    
    fetchSidebarData();
  }, [inputData]); 

  return (
    <div className="sidebar">
      <div className="top">
        <div className="menu">
          <div className="new-chat">
            <input
              type="text" // Specify input type for clarity
              value={inputData}
              onChange={handleInputChange}
              placeholder="Enter data for sidebar..." // Add informative placeholder
            />
            {isLoading ? (
              <p>Loading...</p>
            ) : sidebarData ? (
              <div dangerouslySetInnerHTML={{ __html: sidebarData }} /> // Handle potential XSS risks
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;