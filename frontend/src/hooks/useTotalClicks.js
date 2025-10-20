import { useState, useEffect, useCallback } from 'react';
import api from '../assets/api/BackendApiToken';

// Helper function to get the current date in the YYYY-MM-DD format
const getFormattedDate = (date) => date.toISOString().split('T')[0];

/**
 * Custom hook to fetch the total click count data for a given date range.
 * @param {string} startDate - The start date for the API query (YYYY-MM-DD format).
 * @param {string} endDate - The end date for the API query (YYYY-MM-DD format).
 */
export function useTotalClicks(startDate, endDate) {
  // 1. STATE DEFINITIONS
  const [totalClicks, setTotalClicks] = useState(null); // Grand total number
  const [chartData, setChartData] = useState([]);       // Array of objects for the chart
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTotalClicks = useCallback(async () => {
    if (!startDate || !endDate) {
      setError("Dates are required for this query.");
      setIsLoading(false);
      return;
    }
      
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/api/urls/totalclicks', {
        params: {
          startDate: startDate, 
          endDate: endDate,
        }
      });
      
      const responseData = response.data;
      
      let newChartData = [];
      let grandTotal = 0;

      // 2. DATA TRANSFORMATION LOGIC
      // Input: {"2025-10-20": 156, "2025-10-21": 201}
      // Output: [{date: "2025-10-20", clicks: 156}, {date: "2025-10-21", clicks: 201}]
      if (typeof responseData === 'object' && responseData !== null) {
          newChartData = Object.keys(responseData)
              .map(dateKey => {
                  const clickCount = Number(responseData[dateKey]);
                  grandTotal += clickCount;
                  return {
                      date: dateKey,
                      clicks: clickCount
                  };
              })
              // Sort data chronologically for the chart
              .sort((a, b) => new Date(a.date) - new Date(b.date));
      } 
      
      setChartData(newChartData);
      setTotalClicks(grandTotal); 
      
    } catch (err) {
      console.error("Error fetching total clicks:", err); 
      
      const status = err.response ? err.response.status : 'N/A';
      const message = err.response 
        ? err.response.data.message || 'The server returned an unexpected error.'
        : 'Network Error.';
        
      setError(`Server Error (${status}): ${message}`);

    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]); 

  useEffect(() => {
    fetchTotalClicks();
  }, [fetchTotalClicks]); 

  // 3. COMPLETE RETURN OBJECT
  return { totalClicks, chartData, isLoading, error, refetch: fetchTotalClicks };
}

export { getFormattedDate };